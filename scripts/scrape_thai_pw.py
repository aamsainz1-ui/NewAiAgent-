"""Scrape Thai football analysis using Playwright"""
import asyncio
from playwright.async_api import async_playwright

async def scrape_analysis():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        page.set_default_timeout(15000)
        
        results = {}
        
        # 1) Try smmsport search
        print("=== Searching smmsport.com ===")
        try:
            await page.goto("https://www.google.com/search?q=site:smmsport.com+%E0%B8%A7%E0%B8%B4%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B2%E0%B8%B0%E0%B8%AB%E0%B9%8C+%E0%B8%81%E0%B8%B4%E0%B9%82%E0%B8%A3%E0%B8%99%E0%B9%88%E0%B8%B2+%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%8B%E0%B9%82%E0%B8%A5%E0%B8%99%E0%B9%88%E0%B8%B2&hl=th", wait_until="domcontentloaded")
            await asyncio.sleep(2)
            # Get first result link
            links = await page.query_selector_all("a[href*='smmsport.com']")
            for link in links[:2]:
                href = await link.get_attribute("href")
                if href and "smmsport.com" in href and "/football" in href:
                    print(f"  Found: {href}")
                    break
        except Exception as e:
            print(f"  Error: {e}")
        
        # 2) Try 7msport / 7mth
        print("\n=== Trying 7msport.com ===")
        try:
            await page.goto("https://www.7msport.com/", wait_until="domcontentloaded")
            await asyncio.sleep(2)
            content = await page.content()
            # Look for analysis links
            import re
            matches = re.findall(r'วิเคราะห์.{10,200}', content)
            for m in matches[:5]:
                clean = re.sub(r'<[^>]+>', '', m)
                print(f"  >> {clean[:200]}")
        except Exception as e:
            print(f"  Error: {e}")
        
        # 3) Try tdedball
        print("\n=== Trying tdedball ===")
        try:
            await page.goto("https://www.tdedball.com/", wait_until="domcontentloaded")
            await asyncio.sleep(3)
            content = await page.text_content("body") or ""
            # Find analysis patterns
            import re
            for pat in [r'วิเคราะห์.{20,300}', r'กิโรน.{10,200}', r'Girona.{10,200}', r'Barcelona.{10,200}', r'บาร์ซ.{10,200}']:
                for m in re.findall(pat, content)[:3]:
                    print(f"  >> {m[:250]}")
        except Exception as e:
            print(f"  Error: {e}")
        
        # 4) Try tdedballtoday
        print("\n=== Trying tdedballtoday.com ===")
        try:
            await page.goto("https://www.tdedballtoday.com/", wait_until="domcontentloaded")
            await asyncio.sleep(3)
            content = await page.text_content("body") or ""
            import re
            for pat in [r'วิเคราะห์.{20,300}', r'กิโรน.{10,200}', r'บาร์ซ.{10,200}', r'Girona.{10,200}', r'Coventry.{10,200}']:
                for m in re.findall(pat, content)[:3]:
                    print(f"  >> {m[:250]}")
        except Exception as e:
            print(f"  Error: {e}")

        # 5) Try tded7 
        print("\n=== Trying tded7.com ===")
        try:
            await page.goto("https://www.tded7.com/", wait_until="domcontentloaded")
            await asyncio.sleep(3)
            content = await page.text_content("body") or ""
            import re
            for pat in [r'วิเคราะห์.{20,300}', r'กิโรน.{10,200}', r'บาร์ซ.{10,200}']:
                for m in re.findall(pat, content)[:3]:
                    print(f"  >> {m[:250]}")
        except Exception as e:
            print(f"  Error: {e}")
        
        await browser.close()

asyncio.run(scrape_analysis())
