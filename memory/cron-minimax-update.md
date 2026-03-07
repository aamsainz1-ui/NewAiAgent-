# Cron Jobs Model Update - Minimax M2.5

## วันที่
2026-02-26

## การเปลี่ยนแปลง
ปรับ **ทุก Cron Jobs** จาก `gpt-4.1-mini` → `minimax-portal/MiniMax-M2.5`

## เหตุผล
- 🆓 **ฟรี 100%** - Minimax M2.5 ไม่มีค่าใช้จ่าย
- 📊 **งานเหมาะสม** - Collect + Report ข้อมูล ไม่ต้องคิดวิเคราะห์ลึก
- 💰 **ประหยัดมาก** - 3 รอบ/วัน × 30 วัน = 90 ครั้ง/เดือน
- ⚡ **เร็วพอ** - สำหรับงาน data collection

## Jobs ที่อัพเดท

### 1.  Intel - Morning (08:00)
- **ID:** 9cb5f072-fdd7-4701-9dee-cf2242a044dc
- **Model:** minimax-portal/MiniMax-M2.5 ✅
- **Task:** สแกน 12 ช่องทางการตลาด

### 2.  Intel - Afternoon (14:00)
- **ID:** bdcc54b4-7388-4643-af77-4b2b0c1f64ab
- **Model:** minimax-portal/MiniMax-M2.5 ✅
- **Task:** วิเคราะห์ trends, social, forums

### 3.  Intel - Evening (20:00)
- **ID:** 27018d77-3d78-4c30-860a-ff1489ae21a7
- **Model:** minimax-portal/MiniMax-M2.5 ✅
- **Task:** สรุปวัน + คาดการณ์

## ผลลัพธ์
| รายการ | ก่อน | หลัง | ประหยัด |
|--------|------|------|----------|
| **Cost per run** | ~$0.01-0.05 | $0 | 100% |
| **Monthly runs** | 90 | 90 | - |
| **Monthly cost** | ~$1-5 | $0 | $1-5 |

## หมายเหตุ
- เก็บโควต้าแพง (Claude Opus, GPT-4) ไว้ใช้งานวิเคราะห์เชิงลึกจริงๆ
- Minimax M2.5 ทำงาน collect data + report ได้ดีพอ
- ถ้าต้องการวิเคราะห์ลึกๆ ค่อยใช้ model แพง

## ไฟล์ที่เกี่ยวข้อง
- `memory/quota-minimax-config.md` - config /quota command
- `tools/quota-monitor.js` - ตรวจสอบ quota
