# MEMORY.md - Long-Term Memory

## About Nathan
- **Telegram:** @nathansainz (id: 1174974164)
- **Language:** ใช้ภาษาไทยเป็นหลัก
- **Timezone:** Asia/Bangkok

## Preferences — กฎเหล็ก (ใช้ทุก model ทุก session)
- ชอบให้ทำเลย ไม่ต้องถามเยอะ
- ห้ามแสดงขั้นตอนการทำงาน — ทำเงียบๆ ส่งแค่ผลลัพธ์
- ตอบสั้น เข้าใจง่าย ประหยัด token
- ปิด process/dev server ที่ไม่ใช้ทุกครั้งหลังทำงานเสร็จ
- สลับ model แล้วต้องยึดกฎเดิมทุกข้อ ห้ามลืม

## Installed Skills
- pkm (Personal Knowledge Base)
- openclaw-mem (Memory Management)
- expert-finder (Expert Finder)
- clawhub, healthcheck, skill-creator
- competitor-analysis, content-creator, keyword-research
- on-page-seo-auditor, performance-reporter, seo-content-writer
- technical-seo-checker, memory-management, website
- **Football (1):** football-daily-analyst (วิเคราะห์บอลไทย, ตารางแข่ง, ดาวซัลโว, สเต็ป)
- **Browser (10):** agent-browser, fast-browser-use, browser-automation, clawbrowser, playwright-scraper-skill, agent-browser-stagehand, gemini-computer-use, firecrawl-search, linkedin, browser-cash
- **Business (18):** hubspot, zoho-crm, sales, activecampaign, invoice-generator, invoice-chaser, agentledger, freshbooks-cli, todoist, mission-control, taskmaster, proactive-tasks, google-calendar, calendly-api, outlook, google-analytics, data-analyst, business-model-canvas
- **Investment (3):** stock-evaluator, day-trading-skill, equity-analyst
- **Marketing (4):** marketing-mode, x-post-automation, social-media-scheduler, real-estate-skill
- **Pending (2):** linkedin-lead-generation, research-company

## DEC-2026-02-17-04
type: decision
area: config

memory_search เปลี่ยนจาก OpenAI → Gemini embeddings
- เหตุผล: OpenAI embeddings quota หมด (429)
- config: agents.defaults.memorySearch.provider = "gemini"
- ใช้ Google API key ที่มีอยู่ (ฟรี)

## DEC-2026-02-17-05
type: decision
area: tools

Ollama ติดตั้งไม่สำเร็จ (winget code 1 — อาจต้อง elevated/admin)
- รอ Nathan ลงเองหรือลองใหม่ภายหลัง
- ใช้ Gemini embeddings แทนได้แล้ว

## FACT-2026-02-15-01
type: fact
area: models

Models ที่เปิดใช้ใน config (9 ตัว):
- google-antigravity/claude-opus-4-6-thinking (primary)
- openai/gpt-5.1-codex (alias: GPT)
- google/gemini-3-pro-preview (alias: gemini)
- openai/gpt-4o + gpt-4o-2024-08-06 (alias: gpt4o)
- openai/gpt-4.1-mini (alias: gpt4mini)
- openai/gpt-4o-mini (alias: gpt4omini)
- zhipu/glm-5 (alias: glm5)
- openrouter/moonshotai/kimi-k2 (alias: kimi)

## FACT-2026-02-15-02
type: fact
area: dashboard

Agent Skill Dashboard:
- Stack: React + Vite + TailwindCSS + react-three-fiber + Recharts
- URL: https://agent-dashboard-blond.vercel.app
- Layout: Orbital — PAPACLAW (0,0,0) ศูนย์กลาง, Models r=4, Skills r=8-11, Memory r=14-16
- สี: Golden angle unique per node (137.5°) + unique per edge (offset 68°)
- OrbitalGroup: ทุกอย่างหมุนรอบ PAPACLAW (speed 0.04)
- Category labels: 16 หมวด + emoji ลอยเหนือกลุ่มตลอด
- Background: Stars 8000 + Nebula sparkles 3 ชั้น (ไม่มี CoreGlow)
- Controls: nodeScale, autoRotate, speed, spread (0.8-3.0x), showEdges, labelMode, focusOnSelect
- Camera: FOV 65°, z=28, maxDistance=80
- Label: "always" แสดงครบ, click/hover → เฉพาะ selected + connected
- Nodes: 135 (2 agent, 9 model, 99 skill, 25 memory) | Edges: 237
- Edge types: agent-model, model-skill, intra-category, cross-category, agent-memory, memory-chain
- Auto-generate: `node scripts/generate-data.js` → deploy `npx vercel --prod --yes`
- ใช้ตำแหน่งจาก data file (generatePositions) ไม่ใช้ createGalaxyLayout

## DEC-2026-02-15-01
type: decision
area: operations

หลังทำงานเสร็จ (build/deploy) ต้องปิด process ที่เปิดค้างทุกครั้ง ไม่ปล่อยให้เครื่องทำงานหนักเปล่าๆ

## Session Log
- 2026-02-14: First conversation, bootstrap session
- 2026-02-15: Dashboard updates (แยกสีโหนด, pulse animation, graph controls), เพิ่ม GPT-4o ใน config, สนใจหา skill เพิ่ม (browser control)
- 2026-02-16: ติดตั้ง browser skills 10 + business skills 18 ตัว, Dashboard overhaul + auto-generate script (112 nodes), Telegram group migration, Google Sheets live pull, UFAX9 business/team analysis, marketing plan, cron job update
- 2026-02-17: verboseDefault off, cron fix (model+utf8), ลบ quick-summary, Dashboard orbital overhaul (PAPACLAW center, golden angle colors, category labels, orbital rotation, spread/edge controls)

## FACT-2026-02-16-01
type: fact
area: business

ธุรกิจ: UFAX9 (ufax9.com) — เว็บพนันออนไลน์ (บอล, คาสิโน, สล็อต, หวย)
Backend: bigx9.net | ช่องทาง: Line + Telegram
Telegram Group "Wo": -1003869825051 (6 คน)
Google Sheet: 19q5n7m_mQtBL-ia3J-_GVL7NRmqiixEx7UPnb3IQufY

## FACT-2026-02-16-02
type: fact
area: team

ทีม MKT (7 คน, 3 ทีม):
- takeng: เก่ง (฿20K), พิม (฿15K)
- bank: แบงค์ (฿16.75K), ลัน (฿15K), โอ๊ต (฿16.75K)
- lunny: บอม (฿16K)
- ไม่มีทีม: เม่า (฿16.75K)
เงินเดือนรวม ฿116,250 | ค่าข้าว ฿7,500 | เบิก ฿35,500

## DEC-2026-02-16-01
type: decision
area: marketing

แบ่งงานการตลาด UFAX9:
- TikTok Ads + Organic: เก่ง + พิม (ทีม takeng) → ยิง Ads TikTok, ถ่ายคลิป, โพสต์ organic
- คลิป AI → Ads TikTok + FB: แบงค์ + เม่า → สร้างคลิป AI, ยิง Ads ทั้ง 2 แพลตฟอร์ม
- กลุ่มนำเล่น + SMS: ลัน + โอ๊ต + บอม → ดูแลกลุ่มนำเล่น LINE/Telegram, ส่ง SMS, แบ่ง segment, ติดตามผล

เป้าหมาย: 8K ยูสฝาก/เดือน | งบ ฿2M | CPA ≤ ฿250

## DEC-2026-02-17-01
type: decision
area: config

verboseDefault: "off" — ปิด tool notification ถาวร (📖 Read / 🛠️ Exec ไม่แสดงใน Telegram อีก)
ไม่กระทบ token — เป็นแค่ UI notification ของ OpenClaw gateway

## DEC-2026-02-17-02
type: decision
area: dashboard

Dashboard layout เปลี่ยนจาก category zones → orbital system
- PAPACLAW = จุดศูนย์กลาง (0,0,0)
- ทุกอย่างหมุนรอบ PAPACLAW ใน OrbitalGroup เดียวกัน
- ใช้ตำแหน่งจาก data file เท่านั้น (ไม่ใช้ random ตอน render)
- สีไม่ซ้ำทั้งโหนดและเส้น (golden angle)
- เพิ่ม: tooltip hover, collapsible legend, detail panel, model usage link, mobile responsive

## DEC-2026-02-17-03
type: decision
area: model-routing

Auto Model Routing — PAPACLAW เลือก model เองตามลักษณะงาน:
- คิดกลยุทธ์/วิเคราะห์ซับซ้อน → Claude Opus
- เขียน/แก้ code → GPT-5.1 Codex
- ข้อมูลยาว/สรุป → Gemini 3 Pro
- เขียน copy/content/งานซ้ำ → GPT-4.1 Mini
- ไม่ต้องถาม Nathan — วิเคราะห์แล้วเลือกเอง
- กฎบันทึกใน SOUL.md

## FACT-2026-02-16-03
type: fact
area: football

Football Daily Analyst Skill:
- Path: skills/football-daily-analyst/
- Script: scripts/thai_analysis_gen.py (argparse CLI)
- Features: วิเคราะห์บอล, ตารางแข่ง, ตารางคะแนน, ผลบอล, ดาวซัลโว, สเต็ป, ★ ความมั่นใจ
- API: football-data.org (key: FOOTBALLDATA_KEY)
- Output: Thai language, UFAX9 branding, emoji, paragraph style
- Glossary: references/thai-football-glossary.md (100+ terms)
- Next: การ์ดทีเด็ด (image), win rate tracking, SEO บทความ, สคริปต์คลิป TikTok
- Cron: ยังไม่ตั้ง (รอ thinking.signature fix)
