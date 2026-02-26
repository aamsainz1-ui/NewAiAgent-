"""
UFAX9 Daily Football Analysis v3
- ดึงตารางแข่ง+วิเคราะห์จาก football-data.org (API key required)
- แปล+สรุปเป็นภาษาไทย
- Format พร้อมส่ง Telegram
"""

import json
import os
import sys
from datetime import datetime, timezone, timedelta
from urllib.request import Request, urlopen

TIMEZONE = timezone(timedelta(hours=7))
NOW = datetime.now(TIMEZONE)
TODAY = NOW.strftime("%Y-%m-%d")
DATE_TH = NOW.strftime("%d/%m/%Y")
DAY_TH = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"][NOW.weekday()]

API_KEY = os.environ.get("FOOTBALLDATA_KEY", "0b5856b21f964b398ecc12918f22c7a2")

LEAGUE_EMOJI = {
    "Premier League": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Primera Division": "🇪🇸",
    "Serie A": "🇮🇹",
    "Bundesliga": "🇩🇪",
    "Ligue 1": "🇫🇷",
    "Champions League": "🏆",
    "Europa League": "🏆",
    "Championship": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Eredivisie": "🇳🇱",
    "Primeira Liga": "🇵🇹",
    "Copa Libertadores": "🌎",
    "FIFA World Cup": "🌍",
    "European Championship": "🇪🇺",
    "Campeonato Brasileiro": "🇧🇷",
}

def get_league_emoji(name):
    for key, emoji in LEAGUE_EMOJI.items():
        if key.lower() in name.lower():
            return emoji
    return "⚽"

def fetch_matches():
    """Fetch today's matches from football-data.org"""
    url = "https://api.football-data.org/v4/matches"
    req = Request(url)
    req.add_header("X-Auth-Token", API_KEY)
    
    try:
        with urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
            return data.get("matches", [])
    except Exception as e:
        print(f"API Error: {e}", file=sys.stderr)
        return []

def fetch_standings(comp_code):
    """Fetch current standings for a competition"""
    url = f"https://api.football-data.org/v4/competitions/{comp_code}/standings"
    req = Request(url)
    req.add_header("X-Auth-Token", API_KEY)
    
    try:
        with urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            standings = data.get("standings", [])
            if standings:
                return standings[0].get("table", [])
    except:
        pass
    return []

def fetch_h2h(match_id):
    """Fetch head-to-head for a match"""
    url = f"https://api.football-data.org/v4/matches/{match_id}/head2head?limit=5"
    req = Request(url)
    req.add_header("X-Auth-Token", API_KEY)
    
    try:
        with urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            return data.get("matches", [])
    except:
        pass
    return []

def get_team_form(standings, team_name):
    """Get team position and form from standings"""
    for entry in standings:
        t = entry.get("team", {})
        if t.get("name", "").lower() == team_name.lower() or t.get("shortName", "").lower() == team_name.lower():
            pos = entry.get("position", "?")
            won = entry.get("won", 0)
            draw = entry.get("draw", 0)
            lost = entry.get("lost", 0)
            pts = entry.get("points", 0)
            gf = entry.get("goalsFor", 0)
            ga = entry.get("goalsAgainst", 0)
            form = entry.get("form", "")
            return {
                "pos": pos, "won": won, "draw": draw, "lost": lost,
                "pts": pts, "gf": gf, "ga": ga, "form": form
            }
    return None

def format_form(form_str):
    """Convert WDLWW to emoji"""
    mapping = {"W": "🟢", "D": "🟡", "L": "🔴"}
    if not form_str:
        return ""
    return "".join(mapping.get(c, c) for c in form_str.replace(",", ""))

def format_h2h(h2h_matches, home_name, away_name):
    """Format H2H results"""
    if not h2h_matches:
        return ""
    
    home_wins = 0
    draws = 0
    away_wins = 0
    results = []
    
    for m in h2h_matches[:5]:
        h = m.get("homeTeam", {}).get("shortName", m.get("homeTeam", {}).get("name", "?"))
        a = m.get("awayTeam", {}).get("shortName", m.get("awayTeam", {}).get("name", "?"))
        ft = m.get("score", {}).get("fullTime", {})
        hg = ft.get("home", 0)
        ag = ft.get("away", 0)
        
        if hg > ag:
            winner = h
        elif ag > hg:
            winner = a
        else:
            winner = "Draw"
        
        # Track wins relative to today's home/away
        if winner == "Draw":
            draws += 1
        elif winner.lower() in home_name.lower() or home_name.lower() in winner.lower():
            home_wins += 1
        else:
            away_wins += 1
        
        results.append(f"{h} {hg}-{ag} {a}")
    
    return home_wins, draws, away_wins, results

def build_message(matches):
    """Build the full analysis message"""
    lines = []
    lines.append(f"⚽ วิเคราะห์บอลวันนี้ — วัน{DAY_TH}ที่ {DATE_TH}")
    lines.append(f"🕐 เวลาไทย (GMT+7)")
    lines.append("━" * 28)
    
    if not matches:
        lines.append("\n😴 วันนี้ไม่มีคู่แข่งในลีกที่ติดตาม")
        lines.append("📅 เช็คตารางแข่งถัดไปที่ ufax9.com")
    else:
        # Group by competition
        by_comp = {}
        for m in matches:
            comp = m.get("competition", {})
            comp_name = comp.get("name", "Other")
            comp_code = comp.get("code", "")
            if comp_name not in by_comp:
                by_comp[comp_name] = {"code": comp_code, "matches": []}
            by_comp[comp_name]["matches"].append(m)
        
        # Cache standings per competition
        standings_cache = {}
        
        match_count = 0
        for comp_name, comp_data in by_comp.items():
            emoji = get_league_emoji(comp_name)
            lines.append(f"\n🏟️ {comp_name} {emoji}")
            lines.append("─" * 24)
            
            comp_code = comp_data["code"]
            
            for m in comp_data["matches"]:
                match_count += 1
                match_id = m.get("id")
                home = m.get("homeTeam", {})
                away = m.get("awayTeam", {})
                home_name = home.get("shortName", home.get("name", "?"))
                away_name = away.get("shortName", away.get("name", "?"))
                status = m.get("status", "TIMED")
                score = m.get("score", {})
                ft = score.get("fullTime", {})
                
                # Convert UTC to Bangkok time
                utc_str = m.get("utcDate", "")
                kick_off = "TBD"
                if utc_str:
                    try:
                        dt = datetime.fromisoformat(utc_str.replace("Z", "+00:00"))
                        kick_off = dt.astimezone(TIMEZONE).strftime("%H:%M")
                    except:
                        pass
                
                if status == "FINISHED":
                    lines.append(f"  🏁 {home_name} {ft.get('home',0)} - {ft.get('away',0)} {away_name}")
                elif status in ["IN_PLAY", "PAUSED"]:
                    lines.append(f"  🔴 LIVE: {home_name} {ft.get('home',0)} - {ft.get('away',0)} {away_name}")
                else:
                    lines.append(f"  ⏰ {kick_off} น. | {home_name} vs {away_name}")
                
                # Fetch standings for form data (max 2 API calls per comp)
                if comp_code and comp_code not in standings_cache and match_count <= 6:
                    try:
                        standings_cache[comp_code] = fetch_standings(comp_code)
                    except:
                        standings_cache[comp_code] = []
                
                standings = standings_cache.get(comp_code, [])
                
                if standings:
                    home_info = get_team_form(standings, home.get("name", ""))
                    away_info = get_team_form(standings, away.get("name", ""))
                    
                    if home_info and away_info:
                        lines.append(f"  📊 อันดับ: {home_name} #{home_info['pos']} ({home_info['pts']}pts) vs {away_name} #{away_info['pos']} ({away_info['pts']}pts)")
                        
                        home_form = format_form(home_info.get("form", ""))
                        away_form = format_form(away_info.get("form", ""))
                        if home_form or away_form:
                            lines.append(f"  📈 ฟอร์ม: {home_name} {home_form} | {away_name} {away_form}")
                        
                        # Goal stats
                        home_gd = home_info['gf'] - home_info['ga']
                        away_gd = away_info['gf'] - away_info['ga']
                        gd_h = f"+{home_gd}" if home_gd > 0 else str(home_gd)
                        gd_a = f"+{away_gd}" if away_gd > 0 else str(away_gd)
                        lines.append(f"  ⚔️ ประตู: {home_name} {home_info['gf']}ยิง/{home_info['ga']}เสีย ({gd_h}) | {away_name} {away_info['gf']}ยิง/{away_info['ga']}เสีย ({gd_a})")
                
                # Fetch H2H (limit API calls)
                if match_id and match_count <= 4:
                    try:
                        h2h = fetch_h2h(match_id)
                        if h2h:
                            hw, d, aw, results = format_h2h(h2h, home_name, away_name)
                            lines.append(f"  🔄 สถิติเจอกัน 5 นัด: {home_name} ชนะ {hw} | เสมอ {d} | {away_name} ชนะ {aw}")
                            for r in results[:3]:
                                lines.append(f"     • {r}")
                    except:
                        pass
                
                # Thai-style prediction
                if standings:
                    home_info = get_team_form(standings, home.get("name", ""))
                    away_info = get_team_form(standings, away.get("name", ""))
                    if home_info and away_info:
                        diff = home_info['pts'] - away_info['pts']
                        h_gd = home_info['gf'] - home_info['ga']
                        a_gd = away_info['gf'] - away_info['ga']
                        
                        # Thai-style tip
                        tips = []
                        if abs(diff) <= 5:
                            tips.append("⚖️ คู่นี้สูสีกัน พอฟัดพอเหวี่ยง")
                        elif diff > 15:
                            tips.append(f"🔥 {home_name} เต็งจ๋า เล่นเหย้าด้วย")
                        elif diff > 5:
                            tips.append(f"💪 {home_name} ฟอร์มมา + เล่นบ้าน ได้เปรียบ")
                        elif diff < -15:
                            tips.append(f"🔥 {away_name} เต็งหนัก แม้เล่นนอกบ้าน")
                        else:
                            tips.append(f"💪 {away_name} อันดับดีกว่า แต่เล่นเยือน ระวังสะดุด")
                        
                        # Form analysis
                        h_form = home_info.get("form", "")
                        a_form = away_info.get("form", "")
                        if h_form:
                            h_wins = h_form.replace(",","").count("W")
                            h_losses = h_form.replace(",","").count("L")
                            if h_wins >= 4:
                                tips.append(f"📈 {home_name} ซิ่งมา {h_wins} นัด ฟอร์มมาแรง")
                            elif h_losses >= 3:
                                tips.append(f"📉 {home_name} ฟอร์มตก ร่วงมา {h_losses} นัด")
                        if a_form:
                            a_wins = a_form.replace(",","").count("W")
                            a_losses = a_form.replace(",","").count("L")
                            if a_wins >= 4:
                                tips.append(f"📈 {away_name} ชนะรวด {a_wins} นัด กำลังมา")
                            elif a_losses >= 3:
                                tips.append(f"📉 {away_name} แพ้ติด {a_losses} นัด น่าเป็นห่วง")
                        
                        # Goal tendency
                        total_goals_avg = (home_info['gf'] + away_info['gf']) / max(home_info['won']+home_info['draw']+home_info['lost'], 1)
                        if total_goals_avg > 1.8:
                            tips.append("⬆️ ทั้งคู่บุกหนัก น่าออกสูง")
                        elif total_goals_avg < 1.0:
                            tips.append("⬇️ ทั้งคู่รับแน่น น่าออกต่ำ")
                        
                        for t in tips:
                            lines.append(f"  💡 {t}")
                
                lines.append("")
        
        lines.append("━" * 28)
        lines.append(f"📌 รวม {match_count} คู่วันนี้")
    
    lines.append("")
    lines.append("💰 เดิมพันอย่างมีสติ ดูฟอร์ม+สถิติประกอบ")
    lines.append("⚠️ วิเคราะห์ประกอบการตัดสินใจเท่านั้น ไม่ใช่คำแนะนำ")
    lines.append("")
    lines.append("🔥 แทงบอลออนไลน์ ค่าน้ำดีที่สุด")
    lines.append("👉 ufax9.com — ฝากถอนออโต้ 24 ชม.")
    
    return "\n".join(lines)

if __name__ == "__main__":
    print(f"Fetching football data for {TODAY}...", file=sys.stderr)
    
    matches = fetch_matches()
    print(f"Found {len(matches)} matches", file=sys.stderr)
    
    message = build_message(matches)
    print(message)
    
    output = os.path.join(os.path.dirname(os.path.abspath(__file__)), "football_analysis.txt")
    with open(output, "w", encoding="utf-8") as f:
        f.write(message)
    print(f"Saved to {output}", file=sys.stderr)
