"""
UFAX9 Thai Football Analysis v4
- ใช้ชื่อทีม/ลีกเป็นไทย
- เขียนวิเคราะห์เป็นย่อหน้าแบบนักวิเคราะห์บอลไทย
- ศัพท์ฟุตบอลไทยทั้งหมด
"""

import json, os, sys
from datetime import datetime, timezone, timedelta
from urllib.request import Request, urlopen

TZ = timezone(timedelta(hours=7))
NOW = datetime.now(TZ)
TODAY = NOW.strftime("%Y-%m-%d")
DATE_TH = NOW.strftime("%d/%m/%Y")
DAY_NAMES = ["จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์","อาทิตย์"]
DAY_TH = DAY_NAMES[NOW.weekday()]

API_KEY = os.environ.get("FOOTBALLDATA_KEY", "0b5856b21f964b398ecc12918f22c7a2")

# ชื่อทีมไทย
TEAM_TH = {
    "FC Barcelona": "บาร์ซ่า", "Barcelona": "บาร์ซ่า", "Barça": "บาร์ซ่า",
    "Real Madrid CF": "เรอัลมาดริด", "Real Madrid": "เรอัลมาดริด",
    "Girona FC": "กิโรน่า", "Girona": "กิโรน่า",
    "Atlético de Madrid": "แอตเลติโก้", "Atlético Madrid": "แอตเลติโก้",
    "Manchester United FC": "แมนยู", "Man United": "แมนยู",
    "Manchester City FC": "แมนซิตี้", "Man City": "แมนซิตี้",
    "Liverpool FC": "ลิเวอร์พูล", "Liverpool": "ลิเวอร์พูล",
    "Arsenal FC": "อาร์เซนอล", "Arsenal": "อาร์เซนอล",
    "Chelsea FC": "เชลซี", "Chelsea": "เชลซี",
    "Tottenham Hotspur FC": "สเปอร์ส", "Spurs": "สเปอร์ส",
    "FC Bayern München": "บาเยิร์น", "Bayern": "บาเยิร์น",
    "Juventus FC": "ยูเว่", "Juventus": "ยูเว่",
    "AC Milan": "เอซีมิลาน", "Milan": "เอซีมิลาน",
    "FC Internazionale Milano": "อินเตอร์", "Inter": "อินเตอร์",
    "SSC Napoli": "นาโปลี", "Napoli": "นาโปลี",
    "Paris Saint-Germain FC": "เปแอสเช", "PSG": "เปแอสเช",
    "Cagliari Calcio": "กายารี่", "Cagliari": "กายารี่",
    "US Lecce": "เลชเช่", "Lecce": "เลชเช่",
    "Coventry City FC": "โคเวนทรี่", "Coventry City": "โคเวนทรี่", "Coventry": "โคเวนทรี่",
    "Middlesbrough FC": "มิดเดิลสโบรห์", "Middlesbrough": "มิดเดิลสโบรห์", "Boro": "มิดเดิลสโบรห์",
    "Rio Ave FC": "ริโอ อาเว", "Rio Ave": "ริโอ อาเว",
    "Moreirense FC": "โมเรเรนเซ่", "Moreirense": "โมเรเรนเซ่",
    "Borussia Dortmund": "ดอร์ทมุนด์", "AS Roma": "โรม่า",
    "SS Lazio": "ลาซิโอ", "Atalanta BC": "อตาลันต้า",
    "ACF Fiorentina": "ฟิออเรนติน่า",
}

LEAGUE_TH = {
    "Premier League": "พรีเมียร์ลีก 🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Primera Division": "ลาลีกา 🇪🇸",
    "Serie A": "เซเรียอา 🇮🇹",
    "Bundesliga": "บุนเดสลีกา 🇩🇪",
    "Ligue 1": "ลีกเอิง 🇫🇷",
    "Championship": "แชมเปี้ยนชิพ อังกฤษ 🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Champions League": "แชมเปี้ยนส์ลีก 🏆",
    "Europa League": "ยูโรปาลีก 🏆",
    "Eredivisie": "เอเรดิวิซี่ 🇳🇱",
    "Primeira Liga": "ลีกโปรตุเกส 🇵🇹",
}

def th_name(name):
    """แปลงชื่อทีมเป็นไทย"""
    if name in TEAM_TH:
        return TEAM_TH[name]
    # ลอง match บางส่วน
    for k, v in TEAM_TH.items():
        if k.lower() in name.lower() or name.lower() in k.lower():
            return v
    return name

def th_league(name):
    """แปลงชื่อลีกเป็นไทย"""
    for k, v in LEAGUE_TH.items():
        if k.lower() in name.lower():
            return v
    return name + " ⚽"

def api_get(path):
    url = f"https://api.football-data.org/v4{path}"
    req = Request(url)
    req.add_header("X-Auth-Token", API_KEY)
    with urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())

def form_emoji(form_str):
    if not form_str:
        return ""
    return "".join({"W":"🟢","D":"🟡","L":"🔴"}.get(c,c) for c in form_str.replace(",",""))

def form_desc(form_str, team_name):
    """สร้างคำอธิบายฟอร์มแบบไทย"""
    if not form_str:
        return ""
    f = form_str.replace(",","")
    w = f.count("W")
    d = f.count("D")
    l = f.count("L")
    
    if w >= 4:
        return f"{team_name} ฟอร์มมาแรง ชนะรวด {w} จาก 5 นัดล่าสุด"
    elif w >= 3:
        return f"{team_name} ฟอร์มดี ชนะ {w} จาก 5 นัด"
    elif l >= 3:
        return f"{team_name} ฟอร์มร่วง แพ้ติด {l} จาก 5 นัด"
    elif l >= 2 and w <= 1:
        return f"{team_name} ฟอร์มไม่ค่อยดี ชนะแค่ {w} แพ้ {l}"
    elif w == 2 and d >= 2:
        return f"{team_name} ฟอร์มปานกลาง ชนะ {w} เสมอ {d}"
    else:
        return f"{team_name} ฟอร์มผสม ชนะ {w} เสมอ {d} แพ้ {l}"

def write_analysis(match, standings, h2h_matches):
    """เขียนวิเคราะห์ 1 คู่แบบไทย"""
    home = match.get("homeTeam", {})
    away = match.get("awayTeam", {})
    home_full = home.get("name", "?")
    away_full = away.get("name", "?")
    home_th = th_name(home.get("shortName", home_full))
    away_th = th_name(away.get("shortName", away_full))
    comp_th = th_league(match.get("competition", {}).get("name", ""))
    
    utc_str = match.get("utcDate", "")
    kick = "TBD"
    if utc_str:
        try:
            dt = datetime.fromisoformat(utc_str.replace("Z", "+00:00"))
            kick = dt.astimezone(TZ).strftime("%H:%M")
        except:
            pass
    
    lines = []
    lines.append(f"⚽ {home_th} vs {away_th}")
    lines.append(f"🏆 {comp_th}")
    lines.append(f"⏰ เวลาเตะ {kick} น.")
    lines.append("")
    
    # หาข้อมูลตาราง
    home_info = None
    away_info = None
    for entry in standings:
        t = entry.get("team", {}).get("name", "")
        if t.lower() == home_full.lower():
            home_info = entry
        if t.lower() == away_full.lower():
            away_info = entry
    
    # สถานการณ์ทั้ง 2 ทีม
    lines.append("📊 สถานการณ์:")
    if home_info:
        pos = home_info.get("position", "?")
        pts = home_info.get("points", 0)
        w = home_info.get("won", 0)
        d = home_info.get("draw", 0)
        l = home_info.get("lost", 0)
        gf = home_info.get("goalsFor", 0)
        ga = home_info.get("goalsAgainst", 0)
        form = home_info.get("form", "")
        
        lines.append(f"🏠 {home_th} — อันดับ {pos} ({pts} คะแนน)")
        lines.append(f"   ชนะ {w} เสมอ {d} แพ้ {l} | ยิงได้ {gf} เสีย {ga}")
        if form:
            lines.append(f"   ฟอร์ม 5 นัด: {form_emoji(form)}")
    
    if away_info:
        pos = away_info.get("position", "?")
        pts = away_info.get("points", 0)
        w = away_info.get("won", 0)
        d = away_info.get("draw", 0)
        l = away_info.get("lost", 0)
        gf = away_info.get("goalsFor", 0)
        ga = away_info.get("goalsAgainst", 0)
        form = away_info.get("form", "")
        
        lines.append(f"✈️ {away_th} — อันดับ {pos} ({pts} คะแนน)")
        lines.append(f"   ชนะ {w} เสมอ {d} แพ้ {l} | ยิงได้ {gf} เสีย {ga}")
        if form:
            lines.append(f"   ฟอร์ม 5 นัด: {form_emoji(form)}")
    
    lines.append("")
    
    # สถิติเจอกัน
    if h2h_matches:
        lines.append("🔄 เจอกัน 5 นัดหลังสุด:")
        hw, dw, aw = 0, 0, 0
        for hm in h2h_matches[:5]:
            ht = th_name(hm.get("homeTeam", {}).get("shortName", hm.get("homeTeam", {}).get("name", "?")))
            at = th_name(hm.get("awayTeam", {}).get("shortName", hm.get("awayTeam", {}).get("name", "?")))
            ft = hm.get("score", {}).get("fullTime", {})
            hg = ft.get("home", 0) or 0
            ag = ft.get("away", 0) or 0
            
            if hg > ag:
                winner_name = hm.get("homeTeam", {}).get("name", "")
            elif ag > hg:
                winner_name = hm.get("awayTeam", {}).get("name", "")
            else:
                winner_name = "draw"
            
            if winner_name == "draw":
                dw += 1
            elif winner_name.lower() == home_full.lower():
                hw += 1
            else:
                aw += 1
            
            lines.append(f"   • {ht} {hg}-{ag} {at}")
        
        lines.append(f"   สรุป: {home_th} ชนะ {hw} เสมอ {dw} {away_th} ชนะ {aw}")
        lines.append("")
    
    # วิเคราะห์เป็นย่อหน้า (แบบนักวิเคราะห์บอลไทย)
    lines.append("💡 วิเคราะห์:")
    
    analysis_parts = []
    
    if home_info and away_info:
        h_pts = home_info.get("points", 0)
        a_pts = away_info.get("points", 0)
        h_pos = home_info.get("position", 99)
        a_pos = away_info.get("position", 99)
        h_gf = home_info.get("goalsFor", 0)
        a_gf = away_info.get("goalsFor", 0)
        h_ga = home_info.get("goalsAgainst", 0)
        a_ga = away_info.get("goalsAgainst", 0)
        diff = h_pts - a_pts
        h_form = (home_info.get("form") or "").replace(",","")
        a_form = (away_info.get("form") or "").replace(",","")
        h_games = home_info.get("won",0)+home_info.get("draw",0)+home_info.get("lost",0)
        a_games = away_info.get("won",0)+away_info.get("draw",0)+away_info.get("lost",0)
        
        # ฟอร์ม
        h_desc = form_desc(h_form, home_th)
        a_desc = form_desc(a_form, away_th)
        if h_desc:
            analysis_parts.append(h_desc)
        if a_desc:
            analysis_parts.append(a_desc)
        
        # ยิงประตู
        if h_games > 0:
            h_avg = h_gf / h_games
            if h_avg >= 2.0:
                analysis_parts.append(f"{home_th} เน้นบุก ยิงเฉลี่ย {h_avg:.1f} ลูกต่อนัด")
            elif h_avg <= 0.8:
                analysis_parts.append(f"{home_th} ยิงได้น้อย เฉลี่ยแค่ {h_avg:.1f} ลูกต่อนัด")
        if a_games > 0:
            a_avg = a_gf / a_games
            if a_avg >= 2.0:
                analysis_parts.append(f"{away_th} บุกหนัก ยิงเฉลี่ย {a_avg:.1f} ลูกต่อนัด")
        
        # แนวรับ
        if h_games > 0 and h_ga / h_games < 0.8:
            analysis_parts.append(f"{home_th} รับแน่น เสียเฉลี่ยแค่ {h_ga/h_games:.1f} ลูกต่อนัด")
        if a_games > 0 and a_ga / a_games < 0.8:
            analysis_parts.append(f"{away_th} แนวรับดี เสียเฉลี่ย {a_ga/a_games:.1f} ลูกต่อนัด")
        
        # H2H context
        if h2h_matches:
            if hw >= 4:
                analysis_parts.append(f"สถิติเจอกัน {home_th} ขยี้ ชนะ {hw} จาก 5 นัด")
            elif aw >= 4:
                analysis_parts.append(f"สถิติเจอกัน {away_th} ครองสถิติ ชนะ {aw} จาก 5 นัด")
        
        # สรุป
        if abs(diff) > 20:
            fav = home_th if diff > 0 else away_th
            und = away_th if diff > 0 else home_th
            if diff > 0:
                analysis_parts.append(f"สรุป: {fav} เต็งจ๋า เล่นเหย้า + คะแนนห่างกัน {abs(diff)} แต้ม น่าเก็บ 3 คะแนนได้")
            else:
                analysis_parts.append(f"สรุป: {fav} เต็งหนัก แม้เล่นเยือนแต่คะแนนห่างกัน {abs(diff)} แต้ม น่าจะคุมเกมได้")
        elif abs(diff) > 10:
            fav = home_th if diff > 0 else away_th
            if diff > 0:
                analysis_parts.append(f"สรุป: {fav} ได้เปรียบเล่นเหย้า + อันดับดีกว่า เต็งเบาๆ")
            else:
                analysis_parts.append(f"สรุป: {fav} อันดับดีกว่า แต่เล่นนอกบ้าน ระวังสะดุด")
        else:
            analysis_parts.append(f"สรุป: คู่นี้พอฟัดพอเหวี่ยง ต้องดูฟอร์มวันจริงประกอบ")
        
        # สูง-ต่ำ
        if h_games > 0 and a_games > 0:
            total_avg = (h_gf/h_games + a_gf/a_games)
            if total_avg > 3.5:
                analysis_parts.append(f"เกมนี้น่ามีประตูเยอะ ทั้งคู่บุกหนัก ลุ้นสูง 💥")
            elif total_avg > 2.5:
                analysis_parts.append(f"น่ามีประตู ทั้งคู่ยิงพอได้ ลุ้นสูง")
            elif total_avg < 1.5:
                analysis_parts.append(f"เกมนี้น่าจะประตูน้อย ทั้งคู่เน้นรับ ลุ้นต่ำ")
    
    for part in analysis_parts:
        lines.append(f"• {part}")
    
    return "\n".join(lines)

# === Main ===
if __name__ == "__main__":
    print("กำลังดึงข้อมูลแมตช์วันนี้...", file=sys.stderr)
    
    data = api_get("/matches")
    matches = data.get("matches", [])
    print(f"พบ {len(matches)} แมตช์", file=sys.stderr)
    
    # เลือก 2 คู่เด็ด (La Liga + Championship)
    target = []
    for m in matches:
        comp = m.get("competition", {}).get("name", "")
        if "Primera" in comp:
            target.insert(0, m)  # ลาลีกาขึ้นก่อน
        elif "Championship" in comp:
            target.append(m)
    if len(target) < 2:
        target = matches[:2]
    target = target[:2]
    
    # Header
    output_lines = []
    output_lines.append(f"⚽ บทวิเคราะห์บอลวันนี้")
    output_lines.append(f"📅 วัน{DAY_TH}ที่ {DATE_TH}")
    output_lines.append("━" * 28)
    
    for m in target:
        comp_code = m.get("competition", {}).get("code", "")
        mid = m.get("id")
        
        # ดึง standings
        standings = []
        if comp_code:
            try:
                sd = api_get(f"/competitions/{comp_code}/standings")
                standings = sd.get("standings", [{}])[0].get("table", [])
            except:
                pass
        
        # ดึง H2H
        h2h = []
        if mid:
            try:
                hd = api_get(f"/matches/{mid}/head2head?limit=5")
                h2h = hd.get("matches", [])
            except:
                pass
        
        analysis = write_analysis(m, standings, h2h)
        output_lines.append("")
        output_lines.append(analysis)
    
    output_lines.append("")
    output_lines.append("━" * 28)
    output_lines.append("💰 เดิมพันอย่างมีสติ ดูฟอร์ม+สถิติประกอบ")
    output_lines.append("⚠️ วิเคราะห์ประกอบการตัดสินใจเท่านั้น")
    output_lines.append("")
    output_lines.append("🔥 แทงบอลออนไลน์ ค่าน้ำดีที่สุด")
    output_lines.append("👉 ufax9.com — ฝากถอนออโต้ 24 ชม.")
    
    full_text = "\n".join(output_lines)
    print(full_text)
    
    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "thai_analysis.txt")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(full_text)
    print(f"\nบันทึกไว้ที่ {out_path}", file=sys.stderr)
