import urllib.request
import re
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

domains = ['ufax9.com', 'ufa365.com']
results = {}

for d in domains:
    try:
        req = urllib.request.Request(f'https://www.{d}', headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept-Language': 'th-TH,th;q=0.9,en;q=0.8',
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Charset': 'utf-8',
        })
        resp = urllib.request.urlopen(req, timeout=15, context=ctx)
        
        # Try to detect encoding
        content_type = resp.headers.get('Content-Type', '')
        raw = resp.read()
        
        # Try utf-8 first, then tis-620/windows-874
        for enc in ['utf-8', 'tis-620', 'windows-874', 'iso-8859-11', 'latin-1']:
            try:
                html = raw.decode(enc)
                # Check if Thai chars are readable
                if re.search(r'[\u0e00-\u0e7f]', html):
                    break
            except:
                continue
        else:
            html = raw.decode('utf-8', errors='replace')
        
        title = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
        title_text = title.group(1).strip() if title else 'N/A'
        
        desc = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']', html, re.IGNORECASE)
        if not desc:
            desc = re.search(r'<meta[^>]*content=["\'](.*?)["\'][^>]*name=["\']description["\']', html, re.IGNORECASE)
        desc_text = desc.group(1).strip() if desc else 'N/A'
        
        kw = re.search(r'<meta[^>]*name=["\']keywords["\'][^>]*content=["\'](.*?)["\']', html, re.IGNORECASE)
        if not kw:
            kw = re.search(r'<meta[^>]*content=["\'](.*?)["\'][^>]*name=["\']keywords["\']', html, re.IGNORECASE)
        kw_text = kw.group(1).strip() if kw else 'N/A'
        
        h1s = re.findall(r'<h1[^>]*>(.*?)</h1>', html, re.IGNORECASE | re.DOTALL)
        h2s = re.findall(r'<h2[^>]*>(.*?)</h2>', html, re.IGNORECASE | re.DOTALL)
        h3s = re.findall(r'<h3[^>]*>(.*?)</h3>', html, re.IGNORECASE | re.DOTALL)
        
        canonical = re.search(r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\'](.*?)["\']', html, re.IGNORECASE)
        canonical_text = canonical.group(1) if canonical else 'N/A'
        
        all_links = len(re.findall(r'<a[^>]*href=', html, re.IGNORECASE))
        
        schemas = re.findall(r'"@type"\s*:\s*"(\w+)"', html)
        
        page_size = len(raw)
        word_count = len(re.sub(r'<[^>]+>', ' ', html).split())
        
        # Clean HTML tags from h1/h2
        clean = lambda t: re.sub(r'<[^>]+>', '', t).strip()
        
        results[d] = {
            'title': title_text[:150],
            'description': desc_text[:250],
            'keywords': kw_text[:250],
            'h1_count': len(h1s),
            'h1_texts': [clean(h)[:100] for h in h1s[:5]],
            'h2_count': len(h2s),
            'h2_texts': [clean(h)[:100] for h in h2s[:15]],
            'h3_count': len(h3s),
            'canonical': canonical_text,
            'total_links': all_links,
            'schemas': schemas[:15],
            'page_size_kb': round(page_size / 1024, 1),
            'word_count': word_count,
        }
        
        print(f"=== {d} ===")
        for k, v in results[d].items():
            print(f"  {k}: {v}")
        print()
        
    except Exception as e:
        print(f"=== {d} === ERROR: {e}")
        import traceback
        traceback.print_exc()
        print()

with open('seo_compare_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print("Done!")
