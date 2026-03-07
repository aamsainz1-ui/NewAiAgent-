# CLI Tools Installation Summary - 2026-03-03

## ✅ Completed

### 1. Session Transcripts Cleanup
```bash
openclaw sessions cleanup --store "/root/.openclaw/agents/main/sessions/sessions.json" --enforce --fix-missing
```
**Result:** Applied maintenance. Current entries: 9
**Status:** ✅ Done

### 2. CLI Tools Installation Attempt
**Goal:** Install CLI tools to enable more skills

**Attempted:**
- ❌ `blogwatcher` - Not found on npm (no public package)
- ⚠️  `1password` - Requires manual download

**Available CLI Tools to Install:**
1. **1password (op CLI)**
   - Download: https://1password.com/downloads/command-line
   - Install: `sudo dpkg -i op_linux_amd64.deb`
   - Auth: `op login <your-account>`

2. **discord**
   - Requires: Discord OAuth2 setup
   - Config: Connect Discord bot to OpenClaw

3. **slack**
   - Requires: Slack workspace connection
   - Config: Install Slack app and configure OAuth

4. **telegram**
   - Requires: Telegram bot setup
   - Config: Get bot token and chat_id

### 3. Skills Status
- **Total:** 52 skills
- **Ready:** 16 (unchanged)
- **Missing:** 37 (unchanged)
- **Reason:** Most missing skills require:
  - macOS-specific tools (apple-notes, bear-notes, things-mac)
  - External services (1password, Discord, Slack, Telegram)
  - Manual CLI installations

---

## ⏭️ Next Steps

### For Users Who Want More Skills:

**Option 1: Manual CLI Installations**
```bash
# 1password
cd /tmp
wget https://1password.com/downloads/command-line/op_linux_amd64.deb
sudo dpkg -i op_linux_amd64.deb
op login <account>

# Restart OpenClaw
openclaw restart
```

**Option 2: Use Available Skills (16 ready)**
- clawhub, gemini, healthcheck, skill-creator
- acp-router, prose, model-usage, canvas
- coding-agent, discord, slack, telegram
- etc.

**Option 3: Configure External Services**
- Connect Discord bot
- Connect Slack app
- Setup Telegram bot

---

## 📊 Current Skill Distribution

### Cross-Platform (Ready to Use)
- ✅ clawhub, gemini, healthcheck, skill-creator
- ✅ acp-router, prose, model-usage, canvas
- ✅ coding-agent, discord, slack, telegram
- ✅ gmop, github, greplaces, golog, goge, gog, goge

### macOS Only (Cannot Install on Linux)
- ❌ apple-notes, bear-notes, things-mac
- ❌ apple-reminders

### External Services Required
- ⚠️  1password (requires CLI)
- ⚠️  bluebubbles (requires server)
- ⚠️  imsg (requires API access)
- ⚠️  wacli (requires WhatsApp Business)

---

## 🎯 Recommendation

**ถ้าอยากให้มีเยอะขึ้น:**
1. Install 1password CLI (manual)
2. Configure Discord, Slack, Telegram
3. ใช้ skills ที่มีอยู่ (16 ตัว) พอใช้แล้ว

**ทางเลือกอื่น:**
- Install skills แบบ web-based (ไม่ต้อง CLI)
- Use MCP servers (mcporter)

---

## Notes

- Session lock already removed
- Session transcripts cleaned up
- Ready skills: 16/52 (31%)

**Date:** 2026-03-03
**Time:** 11:50 AM UTC
