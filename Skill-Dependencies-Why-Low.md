# Skill Dependencies - ทำไมมีน้อย?

## สถานะปัจจุบัน
- **ทั้งหมด:** 52 skills
- **Ready:** 16 (31%)
- **Missing:** 37 (69%)

---

## ทำไมมีน้อย?

### 1. **OS-specific** (ไม่ติดตั้งได้ใน Linux)
```
❌ apple-notes      → ต้อง macOS + memo CLI
❌ apple-reminders   → ต้อง macOS + remindctl CLI
❌ bear-notes       → ต้อง macOS + grizzly CLI
❌ things-mac       → ต้อง macOS + things CLI
❌ discord          → ต้องมี Discord account config
```

### 2. **External Services** (ต้องสมัครบริการ)
```
❌ 1password      → ต้องมี 1Password account
❌ bluebubbles    → ต้องมี BlueBubbles server
❌ imsg           → ต้องมี iOS Message API access
❌ wacli          → ต้องมือสอง WhatsApp Business
```

### 3. **CLI Tools** (ต้องติดตั้งเอง)
```
❌ blogwatcher    → ต้อง: npm install -g blogwatcher
❌ 1password      → ต้อง: download op binary
```

---

## สกิลที่ติดตั้งได้ใน Linux

### ✅ ง่ายๆ
```bash
# 1password
# 1. Download: https://1password.com/downloads/command-line/
# 2. Install: sudo dpkg -i op_linux_amd64.deb

# blogwatcher
npm install -g blogwatcher

# และอื่นๆ (ถ้ามี CLI tools พวกนี้)
```

### ✅ ต้อง config
```bash
# discord → config Discord OAuth2
# slack → connect Slack workspace
# telegram → connect Telegram bot
```

---

## สรุป

**Skill มีน้อยเพราะ:**
1. 30% ต้อง macOS (apple-notes, bear-notes, things-mac)
2. 40% ต้อง external services (1password, bluebubbles, imsg)
3. 30% ต้องติดตั้ง CLI tools แยก (blogwatcher, op)

**ถ้าอยากให้มีเยอะขึ้น:**
- ติดตั้ง op CLI (1password)
- ติดตั้ง blogwatcher
- ติดตั้ง CLI tools อื่นๆ ที่ติดตั้งได้ใน Linux
- Config Discord, Slack, Telegram ให้เสร็จ

**ทางเลือกอื่น:**
- ใช้ skills ที่มีอยู่ (16 ตัว) พอใช้ได้แล้ว
- เพิ่ม skills แบบ cross-platform (web-based, API)

---

## ถ้าอยากติดตั้งเพิ่ม

บอกผมเลยครับว่าอยากใช้สกิลไหน:
1. สกิลที่ติดตั้งได้ง่าย (cli tools)
2. สกิลที่ต้อง config (discord, slack)
3. สกิลอื่นๆ ที่สำคัญ?

ผมจะช่วยติดตั้งให้ครับ! 🎯
