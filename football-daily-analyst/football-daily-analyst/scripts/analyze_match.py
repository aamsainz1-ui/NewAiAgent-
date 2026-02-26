"""Single-match deep dive for UFAX9 (Thai output).
Usage:
  python scripts/analyze_match.py --match-id 123456
  python scripts/analyze_match.py --home "Liverpool" --away "Manchester City" --date 2026-02-20
"""

import argparse
import io
import json
import os
import sys
from datetime import datetime, timedelta, timezone
from typing import Optional
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

# UTF-8 output for Windows consoles
if sys.stdout and sys.stdout.encoding and sys.stdout.encoding.lower() not in ("utf-8", "utf8"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
if sys.stderr and sys.stderr.encoding and sys.stderr.encoding.lower() not in ("utf-8", "utf8"):
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

API_BASE = "https://api.football-data.org/v4"
API_KEY = os.environ.get("FOOTBALLDATA_KEY", "0b5856b21f964b398ecc12918f22c7a2")
TH_TZ = timezone(timedelta(hours=7))

try:
    from thai_analysis_gen import TEAM_TH, LEAGUE_TH  # type: ignore
except Exception:  # pragma: no cover
    TEAM_TH, LEAGUE_TH = {}, {}


def fetch_json(path: str, params: Optional[dict] = None) -> dict:
    if params:
        query = f"?{urlencode(params)}"
    else:
        query = ""
    url = f"{API_BASE}{path}{query}"
    req = Request(url, headers={"X-Auth-Token": API_KEY})
    try:
        with urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except HTTPError as e:
        raise SystemExit(f"API error {e.code}: {e.read().decode('utf-8', 'ignore')}")
    except URLError as e:
        raise SystemExit(f"Network error: {e}")


def th_team(name: str) -> str:
    return TEAM_TH.get(name, name)


def th_league(name: str) -> str:
    return LEAGUE_TH.get(name, name)


def parse_iso(dt: str) -> datetime:
    return datetime.fromisoformat(dt.replace("Z", "+00:00"))


def summarize_form(team_id: int, limit: int = 5) -> dict:
    data = fetch_json(f"/teams/{team_id}/matches", {"limit": limit, "status": "FINISHED"})
    matches = data.get("matches", [])
    results = []
    goals_for = goals_against = 0
    for m in matches:
        score = m.get("score", {})
        full = score.get("fullTime", {})
        if m.get("homeTeam", {}).get("id") == team_id:
            gf = full.get("home") or 0
            ga = full.get("away") or 0
            outcome = score.get("winner")
            if outcome == "HOME_TEAM":
                res = "W"
            elif outcome == "AWAY_TEAM":
                res = "L"
            else:
                res = "D"
        else:
            gf = full.get("away") or 0
            ga = full.get("home") or 0
            outcome = score.get("winner")
            if outcome == "AWAY_TEAM":
                res = "W"
            elif outcome == "HOME_TEAM":
                res = "L"
            else:
                res = "D"
        goals_for += gf
        goals_against += ga
        results.append(res)
    return {
        "results": results,
        "gf": goals_for,
        "ga": goals_against,
        "avg_gf": goals_for / limit if limit else 0,
        "avg_ga": goals_against / limit if limit else 0,
        "wins": results.count("W"),
        "draws": results.count("D"),
        "losses": results.count("L"),
    }


def summarize_h2h(match_id: int, limit: int = 5) -> dict:
    data = fetch_json(f"/matches/{match_id}/head2head", {"limit": limit})
    summary = data.get("aggregate", {})
    matches = data.get("matches", [])
    overs = sum(1 for m in matches if ((m.get("score", {}).get("fullTime", {}).get("home") or 0) + (m.get("score", {}).get("fullTime", {}).get("away") or 0)) >= 3)
    return {
        "played": summary.get("numberOfMatches", len(matches)),
        "homeWins": summary.get("homeTeamWins", 0),
        "awayWins": summary.get("awayTeamWins", 0),
        "draws": summary.get("draws", 0),
        "overs": overs,
    }


def search_match(home: str, away: str, date: datetime, window: int) -> Optional[dict]:
    start = (date - timedelta(days=window)).strftime("%Y-%m-%d")
    end = (date + timedelta(days=window)).strftime("%Y-%m-%d")
    data = fetch_json("/matches", {"dateFrom": start, "dateTo": end})
    home_lower, away_lower = home.lower(), away.lower()
    for match in data.get("matches", []):
        h = match.get("homeTeam", {}).get("name", "").lower()
        a = match.get("awayTeam", {}).get("name", "").lower()
        if home_lower in h and away_lower in a:
            return match
        if away_lower in h and home_lower in a:
            return match
    return None


def format_form_line(team_name: str, form: dict) -> str:
    res = "".join(form["results"]) or "-"
    return f"{team_name}: {res} (ยิง {form['gf']} / เสีย {form['ga']})"


def main() -> None:
    parser = argparse.ArgumentParser(description="เจาะลึกคู่นี้แบบเร่งด่วน")
    parser.add_argument("--match-id", type=int, help="football-data match ID")
    parser.add_argument("--home", help="ชื่อทีมเหย้า")
    parser.add_argument("--away", help="ชื่อทีมเยือน")
    parser.add_argument("--date", help="YYYY-MM-DD (default = วันนี้)")
    parser.add_argument("--window", type=int, default=3, help="ค้นหาช่วงวันก่อน/หลัง")
    parser.add_argument("--form-limit", type=int, default=5)
    args = parser.parse_args()

    if not args.match_id and (not args.home or not args.away):
        parser.error("ต้องระบุ match-id หรือ home+away")

    target_date = datetime.strptime(args.date, "%Y-%m-%d").replace(tzinfo=timezone.utc) if args.date else datetime.now(timezone.utc)

    if args.match_id:
        match = fetch_json(f"/matches/{args.match_id}").get("match")
        if not match:
            raise SystemExit("ไม่พบข้อมูลแมตช์นี้")
    else:
        match = search_match(args.home, args.away, target_date, args.window)
        if not match:
            raise SystemExit("หาแมตช์ไม่เจอในช่วงวันที่ระบุ")

    home = match.get("homeTeam", {})
    away = match.get("awayTeam", {})
    comp = match.get("competition", {})
    utc = parse_iso(match.get("utcDate"))
    local_time = utc.astimezone(TH_TZ)

    home_th = th_team(home.get("name", "ทีมเหย้า"))
    away_th = th_team(away.get("name", "ทีมเยือน"))
    league_th = th_league(comp.get("name", ""))

    home_form = summarize_form(home.get("id"), args.form_limit)
    away_form = summarize_form(away.get("id"), args.form_limit)
    h2h = summarize_h2h(match.get("id"))

    print("⚽️ เจาะลึกคู่นี้ (Member Bot)")
    print(f"🏆 {league_th}")
    print(f"📍 สนาม: {match.get('venue', 'ไม่ระบุ')} | ⏰ เตะ {local_time.strftime('%d/%m %H:%M')} น.")
    print("━━━━━━━━━━━━━━━━━━")

    print("📊 ฟอร์ม 5 นัดล่าสุด")
    print(f"• {format_form_line(home_th, home_form)}")
    print(f"• {format_form_line(away_th, away_form)}")

    print("\n🤝 เฮดทูเฮด")
    print(f"เจอกัน {h2h['played']} นัด: {home_th} ชนะ {h2h['homeWins']} | {away_th} ชนะ {h2h['awayWins']} | เสมอ {h2h['draws']}")
    if h2h["overs"]:
        print(f"มีสกอร์รวม ≥3 ลูก {h2h['overs']} ครั้ง → คู่กันทีไรลุ้นสูงได้")

    momentum = "กำลังร้อน" if home_form["wins"] >= 3 else "ยังไม่นิ่ง"
    away_momentum = "แพ้ทาง" if h2h["awayWins"] == 0 and h2h["homeWins"] >= 2 else "มีลุ้นบุกแบ่งแต้ม"

    print("\n🧠 มุมวิเคราะห์")
    print(f"• {home_th} {momentum}: ยิงเฉลี่ย {home_form['avg_gf']:.2f} ลูก/เกมในช่วงนี้")
    print(f"• {away_th} {away_momentum}: เสียเฉลี่ย {away_form['avg_ga']:.2f} ลูก")
    print("• เกมนี้ควรจับตาแท็คติกเพรสกลาง (ดูไฟล์ references/tactical-analysis.md)")

    print("\n💰 มุมเดิมพัน")
    print("ใช้ scripts/calculate_odds.py หรือ winrate_tracker.py เพื่อเช็คความคุ้มของราคา")
    print("ข้อเสนอ: ถ้าราคาต่อไม่เกิน -0.5 ยังพออยู่ฝั่งทีมที่ฟอร์มร้อนกว่า")

    print("\n👉 UFAX9 Member Bot — วิเคราะห์ก่อนแทง เล่นอย่างมีสติ")


if __name__ == "__main__":
    main()
