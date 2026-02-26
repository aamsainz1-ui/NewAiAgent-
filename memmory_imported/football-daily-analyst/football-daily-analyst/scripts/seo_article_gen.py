"""
UFAX9 SEO Football Article Generator
สร้างบทความวิเคราะห์บอล SEO-optimized ภาษาไทย

Usage:
  python seo_article_gen.py                    บทความวิเคราะห์บอลวันนี้
  python seo_article_gen.py --match HOME AWAY  บทความเฉพาะคู่
"""

import sys, os, io, argparse, json
from datetime import datetime, timezone, timedelta
from urllib.request import Request, urlopen

if sys.stdout and sys.stdout.encoding and sys.stdout.encoding.lower() not in ('utf-8', 'utf8'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
if sys.stderr and sys.stderr.encoding and sys.stderr.encoding.lower() not in ('utf-8', 'utf8'):
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

TZ = timezone(timedelta(hours=7))
NOW = datetime.now(TZ)
API_KEY = os.environ.get("FOOTBALLDATA_KEY", "0b5856b21f964b398ecc12918f22c7a2")

# Import team/league translations from main script
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
try:
    from thai_analysis_gen import TEAM_TH, LEAGUE_TH, th_name, th_league, api_get
except ImportError:
    TEAM_TH = {}
    LEAGUE_TH = {}
    def th_name(n): return n
    def th_league(n): return n
    def api_get(path):
        url = f"https://api.football-data.org/v4{path}"
        req = Request(url)
        req.add_header("X-Auth-Token", API_KEY)
        with urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())


def generate_seo_article(matches=None):
    """Generate SEO-optimized Thai football analysis article"""
    day_names = ["จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์","อาทิตย์"]
    month_names = ["","มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
                   "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"]

    date_th = f"วัน{day_names[NOW.weekday()]}ที่ {NOW.day} {month_names[NOW.month]} {NOW.year + 543}"

    if not matches:
        print("กำลังดึงข้อมูลแมตช์วันนี้...", file=sys.stderr)
        data = api_get("/matches")
        matches = data.get("matches", [])[:5]

    # SEO Title
    teams = []
    for m in matches[:3]:
        h = th_name(m.get("homeTeam", {}).get("shortName", ""))
        a = th_name(m.get("awayTeam", {}).get("shortName", ""))
        if h and a:
            teams.append(f"{h} vs {a}")

    title = f"ทีเด็ดบอลวันนี้ {date_th} วิเคราะห์บอลคืนนี้"
    if teams:
        title += f" {', '.join(teams[:2])}"

    lines = []

    # HTML-friendly article
    lines.append(f"# {title}")
    lines.append("")
    lines.append(f"**วันที่:** {date_th}")
    lines.append(f"**อัพเดทล่าสุด:** {NOW.strftime('%H:%M')} น.")
    lines.append("")

    # Meta description
    meta = f"วิเคราะห์บอล{date_th} ทีเด็ดบอลคืนนี้ พร้อมสถิติ H2H ฟอร์ม 5 นัดล่าสุด ตารางคะแนน"
    lines.append(f"*Meta Description:* {meta}")
    lines.append("")

    # Keywords
    keywords = ["ทีเด็ดบอลวันนี้", "วิเคราะห์บอลคืนนี้", "ทีเด็ดบอล", "บอลวันนี้",
                "วิเคราะห์บอล", "ผลบอล", "ตารางคะแนน"]
    for m in matches[:3]:
        h = th_name(m.get("homeTeam", {}).get("shortName", ""))
        a = th_name(m.get("awayTeam", {}).get("shortName", ""))
        if h: keywords.append(h)
        if a: keywords.append(a)
    lines.append(f"*Keywords:* {', '.join(keywords)}")
    lines.append("")

    # Intro paragraph (SEO-rich)
    lines.append(f"## ทีเด็ดบอลวันนี้ {date_th}")
    lines.append("")
    lines.append(f"สวัสดีครับแฟนบอลทุกท่าน วันนี้ทีมวิเคราะห์ UFAX9 ได้รวบรวม**ทีเด็ดบอลวันนี้**และ**วิเคราะห์บอลคืนนี้**มาให้ครบทุกคู่ พร้อมสถิติเจอกัน (H2H) ฟอร์มล่าสุด 5 นัด และตารางคะแนนประกอบ เพื่อให้ท่านตัดสินใจได้อย่างมีข้อมูล")
    lines.append("")

    # Match analysis sections
    for i, m in enumerate(matches):
        home = m.get("homeTeam", {})
        away = m.get("awayTeam", {})
        home_th = th_name(home.get("shortName", home.get("name", "?")))
        away_th = th_name(away.get("shortName", away.get("name", "?")))
        comp = m.get("competition", {}).get("name", "")
        comp_th = th_league(comp)
        comp_code = m.get("competition", {}).get("code", "")

        utc = m.get("utcDate", "")
        kick = "TBD"
        if utc:
            try:
                dt = datetime.fromisoformat(utc.replace("Z", "+00:00"))
                kick = dt.astimezone(TZ).strftime("%H:%M")
            except: pass

        lines.append(f"## คู่ที่ {i+1}: {home_th} vs {away_th}")
        lines.append(f"**ลีก:** {comp_th} | **เวลาเตะ:** {kick} น.")
        lines.append("")

        # Standings
        standings = []
        if comp_code:
            try:
                sd = api_get(f"/competitions/{comp_code}/standings")
                standings = sd.get("standings", [{}])[0].get("table", [])
            except: pass

        home_info = None
        away_info = None
        for s in standings:
            if s.get("team", {}).get("name", "").lower() == home.get("name", "").lower():
                home_info = s
            if s.get("team", {}).get("name", "").lower() == away.get("name", "").lower():
                away_info = s

        if home_info:
            pos = home_info.get("position", "?")
            pts = home_info.get("points", 0)
            form = (home_info.get("form") or "").replace(",", "")
            gf = home_info.get("goalsFor", 0)
            ga = home_info.get("goalsAgainst", 0)
            lines.append(f"### สถานการณ์ {home_th}")
            lines.append(f"- **อันดับ:** {pos} ({pts} คะแนน)")
            lines.append(f"- **สถิติ:** ชนะ {home_info.get('won',0)} เสมอ {home_info.get('draw',0)} แพ้ {home_info.get('lost',0)}")
            lines.append(f"- **ประตู:** ยิงได้ {gf} เสีย {ga}")
            if form:
                emoji = "".join({"W":"🟢","D":"🟡","L":"🔴"}.get(c,c) for c in form)
                lines.append(f"- **ฟอร์ม 5 นัด:** {emoji}")
            lines.append("")

        if away_info:
            pos = away_info.get("position", "?")
            pts = away_info.get("points", 0)
            form = (away_info.get("form") or "").replace(",", "")
            gf = away_info.get("goalsFor", 0)
            ga = away_info.get("goalsAgainst", 0)
            lines.append(f"### สถานการณ์ {away_th}")
            lines.append(f"- **อันดับ:** {pos} ({pts} คะแนน)")
            lines.append(f"- **สถิติ:** ชนะ {away_info.get('won',0)} เสมอ {away_info.get('draw',0)} แพ้ {away_info.get('lost',0)}")
            lines.append(f"- **ประตู:** ยิงได้ {gf} เสีย {ga}")
            if form:
                emoji = "".join({"W":"🟢","D":"🟡","L":"🔴"}.get(c,c) for c in form)
                lines.append(f"- **ฟอร์ม 5 นัด:** {emoji}")
            lines.append("")

        # H2H
        mid = m.get("id")
        if mid:
            try:
                hd = api_get(f"/matches/{mid}/head2head?limit=5")
                h2h = hd.get("matches", [])
                if h2h:
                    lines.append(f"### สถิติเจอกัน {home_th} vs {away_th}")
                    for hm in h2h[:5]:
                        ht = th_name(hm.get("homeTeam",{}).get("shortName", "?"))
                        at = th_name(hm.get("awayTeam",{}).get("shortName", "?"))
                        ft = hm.get("score",{}).get("fullTime",{})
                        lines.append(f"- {ht} {ft.get('home',0)}-{ft.get('away',0)} {at}")
                    lines.append("")
            except: pass

        # Analysis paragraph
        lines.append(f"### วิเคราะห์ {home_th} vs {away_th}")
        if home_info and away_info:
            h_pts = home_info.get("points", 0)
            a_pts = away_info.get("points", 0)
            diff = h_pts - a_pts
            if abs(diff) > 15:
                fav = home_th if diff > 0 else away_th
                lines.append(f"จากข้อมูลทั้งหมด **{fav}** ถือเป็นเต็งในเกมนี้ คะแนนห่างกัน {abs(diff)} แต้ม ซึ่งแสดงให้เห็นถึงความแตกต่างของคุณภาพทีมอย่างชัดเจน")
            else:
                lines.append(f"คู่นี้ถือว่าสูสีกันพอสมควร คะแนนห่างกันแค่ {abs(diff)} แต้ม ต้องดูฟอร์มล่าสุดและสถิติเจอกันประกอบการตัดสินใจ")
        lines.append("")
        lines.append("---")
        lines.append("")

    # Footer
    lines.append("## สรุปทีเด็ดบอลวันนี้")
    lines.append("")
    lines.append("ทั้งหมดนี้เป็น**วิเคราะห์บอลวันนี้**จากทีมงาน UFAX9 หวังว่าจะเป็นประโยชน์ในการตัดสินใจของท่าน อย่าลืมเช็คข่าวบาดเจ็บและตัวจริงก่อนเกมด้วยนะครับ")
    lines.append("")
    lines.append("⚠️ *วิเคราะห์ประกอบการตัดสินใจเท่านั้น เดิมพันอย่างมีสติ*")
    lines.append("")
    lines.append("🔥 **แทงบอลออนไลน์ ค่าน้ำดีที่สุด** → [ufax9.com](https://ufax9.com)")
    lines.append("ฝากถอนออโต้ 24 ชม.")

    full_text = "\n".join(lines)
    print(full_text)

    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "seo_article.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(full_text)
    print(f"\nบันทึกบทความที่: {out_path}", file=sys.stderr)


if __name__ == "__main__":
    generate_seo_article()
