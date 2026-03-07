import pandas as pd
from pathlib import Path
import requests
import io

SHEET_ID = '19q5n7m_mQtBL-ia3J-_GVL7NRmqiixEx7UPnb3IQufY'
EXPORT_URL = f'https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=xlsx'

print('Downloading from Google Sheets...')
resp = requests.get(EXPORT_URL, timeout=30)
resp.raise_for_status()
wb = pd.ExcelFile(io.BytesIO(resp.content))
Path('sheet.xlsx').write_bytes(resp.content)
print('Downloaded OK')
summary = {}
def detect_numeric_column(df, keyword):
    candidates = [col for col in df.columns if isinstance(col, str) and keyword in col.lower()]
    for col in candidates:
        series = pd.to_numeric(df[col], errors='coerce').dropna()
        if not series.empty:
            return col, series
    return None, None

# Card result (handle dual accounts)
card_df = pd.read_excel(wb, sheet_name='card result', header=1)
card_header = pd.read_excel('sheet.xlsx', sheet_name='card result', header=0, nrows=1)
card_accounts = [('value', 'balance', card_header.columns[2].strip()),
                 ('value.1', 'balance.1', card_header.columns[9].strip())]
card_stats = []
for value_col, balance_col, label in card_accounts:
    values = pd.to_numeric(card_df.get(value_col), errors='coerce').dropna()
    balances = pd.to_numeric(card_df.get(balance_col), errors='coerce').dropna()
    if values.empty and balances.empty:
        continue
    inflow = float(values[values > 0].sum()) if not values.empty else 0.0
    outflow = float(values[values < 0].sum()) if not values.empty else 0.0
    last_balance = float(balances.iloc[-1]) if not balances.empty else None
    card_stats.append({
        'label': label,
        'inflow': inflow,
        'outflow': outflow,
        'last_balance': last_balance
    })
summary['card result'] = card_stats

for sheet in ['T.TAKENG', 'T.BANK', 'T.LUNNY']:
    df = pd.read_excel(wb, sheet_name=sheet, header=1)
    value_col, values = detect_numeric_column(df, 'value')
    balance_col, balances = detect_numeric_column(df, 'balance')
    inflow = float(values[values > 0].sum()) if values is not None else 0.0
    outflow = float(values[values < 0].sum()) if values is not None else 0.0
    last_balance = float(balances.iloc[-1]) if balances is not None else None
    summary[sheet] = {
        'inflow': inflow,
        'outflow': outflow,
        'last_balance': last_balance
    }

mkt = pd.read_excel(wb, sheet_name='MKT List', header=0)
mkt_totals = {}
for col in ['เงินเดือน', 'ค่าข้าว', 'เบิกล่วงหน้า', 'คงเหลือ']:
    nums = pd.to_numeric(mkt[col], errors='coerce').dropna()
    mkt_totals[col] = float(nums.sum())
summary['MKT List'] = mkt_totals

import json
Path('sheet_summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(summary, ensure_ascii=False, indent=2))

