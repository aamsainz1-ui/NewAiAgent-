# Perplexica - AI Search Engine

**เกี่ยวกับ:**
- Perplexica คือ AI-powered answering engine ที่เปิดเผยเอง (privacy-focused)
- ใช้ Google Search ผ่าน SearxNG
- รองรับ:
  - Local LLMs (Ollama)
  - Cloud providers (OpenAI, Claude, Gemini, Groq)
  - 3 search modes: Speed / Balanced / Quality
  - Image/video search
  - File uploads (PDF, text, images)
  - Search specific domains

**การติดตั้ง:**
```bash
# Docker (recommended)
docker run -d -p 3000:3000 -v perplexica-data:/home/perplexica/data --name perplexica itzcrazykns1337/perplexica:latest

# Access: http://localhost:3000

# Build from source
git clone https://github.com/ItzCrazyKns/Perplexica.git
cd Perplexica
npm i
npm run build
npm run start
```

**ความสามารถ:**
- 🤖 รองรับหลาย AI providers
- ⚡ Smart search modes
- 🧭 Pick sources (web, discussions, academic papers)
- 📊 Widgets (weather, calculations, stock prices)
- 🔍 Web search powered by SearxNG
- 📷 Image and video search
- 📄 File uploads
- 🌐 Search specific domains

**สำหรับผม (OpenClaw):**
- เชื่อมกับ OpenClaw ได้หรือไม่?
- ใช้ Perplexica ให้ Agent ค้นหาข้อมูล?
- ประโยชน์อะไรดี?

**สถานะ:** ✅ Save for later
