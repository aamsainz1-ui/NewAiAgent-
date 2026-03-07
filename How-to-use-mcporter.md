# mcporter - วิธีใช้งานกับ OpenClaw

## สถานการณ์ปัจจุบัน
- OpenClaw Agent ใช้โมเดล GPT-5.3
- ต้องการเรียกใช้ Gemini tools (prompt / summarize / vision / pdf)

## วิธีที่ 1: เรียกใช้ mcporter เอง (ใน terminal)

### 1. Authen กับ Gemini
```bash
mcporter auth gemini
```

### 2. เรียก tools โดยตรง
```bash
# Summarize text
mcporter call gemini.summarize text:"บทความนี้อธิบายเรื่อง AI..."

# Analyze PDF
mcporter call gemini.analyze_pdf path:"/path/to/file.pdf"

# Vision (เช็ครูปภาพ)
mcporter call gemini.vision url:"https://example.com/image.jpg"

# Get response (ยืดยาว)
mcporter call gemini.response prompt:"อธิบายสิ่งนี้ให้หน่อย"
```

## วิธีที่ 2: ใช้ใน OpenClaw Agent

### Step 1: ตั้งค่า .mcp/gemini.json
```json
{
  "type": "gemini",
  "apiKey": "YOUR_GOOGLE_API_KEY"
}
```

### Step 2: ใน Agent
เมื่อ Agent ต้องการเรียก Gemini tools:
```javascript
// เช็คถ้า Gemini tools พร้อม
const hasGeminiTools = await exec('mcporter list gemini');

// เรียก summarize
const result = await exec('mcporter call gemini.summarize text:"..."');

// เรียก vision
const imageResult = await exec('mcporter call gemini.vision url:"..."');
```

### Step 3: Error handling
```javascript
try {
  const result = await exec('mcporter call gemini.summarize text:"..."');
  return result.output;
} catch (error) {
  console.error('เรียก Gemini tools ไม่สำเร็จ, ใช้ GPT-5.3 แทน');
  return "Sorry, I cannot use Gemini right now.";
}
```

## วิธีที่ 3: เปิด Daemon mode
```bash
# เปิด background daemon
mcporter daemon start

# ตอนนี้สามารถเรียก tools โดยตรงได้ตลอดเวลา
mcporter call gemini.summarize text:"..."
```

## ประโยชน์
1. **แยกความรับผิดชอบ:** OpenClaw เป็น "Coordinator", mcporter เป็น "Service"
2. **เชื่อมต่อหลาย API:** เรียก Gemini หรือ API อื่นๆ ผ่าน MCP
3. **ควบคุมอยู่:** สามารถเปิด/ปิด Daemon, เพิ่ม server ได้

## ขั้นตอนถัดไป
1. Authen กับ Gemini ด้วยคำสั่ง: `mcporter auth gemini`
2. ลองเรียก tools: `mcporter call gemini.summarize text:"Hello"`
3. ถ้าทำงานได้ จะใช้ใน OpenClaw Agent ได้ทันที

มีคำถามอะไรไหม? 🤔
