"""Scrape Thai football analysis from popular sites"""
import re, json, sys
from urllib.request import Request, urlopen
from urllib.parse import quote

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

def fetch(url):
    req = Request(url, headers=HEADERS)
    with urlopen(req, timeout=15) as resp:
        return resp.read().decode('utf-8', errors='replace')

def clean_html(text):
    text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.DOTALL)
    text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# Try Thai football analysis sites
sites = [
    ("https://www.thairath.co.th/sport/football", "thairath"),
    ("https://www.smmsport.com/football", "smmsport"),
    ("https://www.siamsport.co.th/football", "siamsport"),
]

for url, name in sites:
    print(f"\n{'='*40}")
    print(f"Source: {name} ({url})")
    print('='*40)
    try:
        html = fetch(url)
        text = clean_html(html)
        # Find Thai football analysis keywords
        patterns = [
            r'(วิเคราะห์.{20,200})',
            r'(ทีมเหย้า.{10,100})',
            r'(ราคาบอล.{10,100})',
            r'(เต็ง.{10,80})',
            r'(ค่าน้ำ.{10,80})',
            r'(ต่อ.{5,50}ลูก.{5,50})',
            r'(สูง.{3,30}ต่ำ.{3,30})',
            r'(ฟอร์ม.{10,100})',
            r'(กิโรน.{10,200})',
            r'(บาร์.{5,200})',
        ]
        found = set()
        for pat in patterns:
            matches = re.findall(pat, text)
            for m in matches[:2]:
                if len(m) > 15 and m not in found:
                    found.add(m)
                    print(f"  >> {m[:200]}")
        if not found:
            # Just print first 500 chars
            print(f"  [No patterns] First 500 chars: {text[:500]}")
    except Exception as e:
        print(f"  Error: {e}")

# Also try specific analysis page
print(f"\n{'='*40}")
print("Trying ballzaa.com")
print('='*40)
try:
    html = fetch("https://www.ballzaa.com/")
    text = clean_html(html)
    for pat in [r'(วิเคราะห์.{20,300})', r'(กิโรน.{10,200})', r'(บาร์ซ.{10,200})']:
        for m in re.findall(pat, text)[:3]:
            print(f"  >> {m[:200]}")
except Exception as e:
    print(f"  Error: {e}")
