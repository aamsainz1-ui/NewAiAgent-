import json
from datetime import datetime
import pytz

summary = json.loads(open('sheet_summary.json', encoding='utf-8').read())
th_tz = pytz.timezone('Asia/Bangkok')
now = datetime.now(th_tz)
month_names = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']
date_str = f"{now.day} {month_names[now.month-1]} {now.year}"

def fmt(num):
    if num is None:
        return '-'
    return f"฿{num:,.2f}"

lines = [f"📊 สรุปรายงานการเงินประจำวัน ({date_str})"]
card_entries = summary.get('card result', [])
if card_entries:
    lines.append("\n💳 Card Result")
    for entry in card_entries:
        inflow = fmt(entry['inflow'])
        outflow = fmt(abs(entry['outflow']))
        balance = fmt(entry['last_balance'])
        lines.append(f"• {entry['label']}: คงเหลือ {balance} | รับ {inflow} | จ่าย {outflow}")
for sheet in ['T.TAKENG','T.BANK','T.LUNNY']:
    data = summary.get(sheet)
    if not data:
        continue
    inflow = fmt(data['inflow'])
    outflow = fmt(abs(data['outflow']))
    balance = fmt(data['last_balance'])
    lines.append(f"\n👤 {sheet}")
    lines.append(f"• คงเหลือ {balance} (รับ {inflow} / จ่าย {outflow})")

mkt = summary.get('MKT List')
if mkt:
    lines.append("\n👥 MKT List (พนักงาน)")
    lines.append(f"• เงินเดือนรวม {fmt(mkt['เงินเดือน'])}")
    lines.append(f"• ค่าข้าวรวม {fmt(mkt['ค่าข้าว'])}")
    lines.append(f"• เบิกล่วงหน้ารวม {fmt(mkt['เบิกล่วงหน้า'])}")
    lines.append(f"• 💰 คงเหลือสุทธิ {fmt(mkt['คงเหลือ'])}")

text = '\n'.join(lines)
open('sheet_summary.txt','w',encoding='utf-8').write(text)
print(text)
