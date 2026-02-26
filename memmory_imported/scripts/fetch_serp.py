import requests
from bs4 import BeautifulSoup
import json

headers = {'User-Agent': 'Mozilla/5.0'}
keywords = ['ufax9','ufa888th']
output = {}
for kw in keywords:
    r = requests.post('https://html.duckduckgo.com/html/', data={'q': kw}, headers=headers, timeout=30)
    soup = BeautifulSoup(r.text, 'html.parser')
    results = []
    for res in soup.select('div.result'):
        title_el = res.select_one('a.result__a')
        snippet_el = res.select_one('.result__snippet')
        link = title_el['href'] if title_el and title_el.has_attr('href') else ''
        title = title_el.get_text(strip=True) if title_el else ''
        snippet = snippet_el.get_text(' ', strip=True) if snippet_el else ''
        if title and link:
            results.append({'title': title, 'url': link, 'snippet': snippet})
        if len(results) >= 5:
            break
    output[kw] = results
print(json.dumps(output, ensure_ascii=False, indent=2))
