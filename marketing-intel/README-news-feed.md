# UFAX9 News Feed Monitor

## ระบบสายข่าวสารอัตโนมัติ

### วัตถุประสงค์
ติดตามข่าวสารการตลาด คู่แข่ง เทรนด์ ที่เกี่ยวข้องกับ UFAX9

### แหล่งข่าวที่ติดตาม

#### RSS Feeds
- Thai PBS Sports - ข่าวกีฬาไทย
- Siam Sport - ข่าวกีฬา
- Goal.com Thailand - ข่าวฟุตบอล

#### Google Alerts Keywords
- ufabet, sbobet, lsm99, gclub
- แทงบอลออนไลน์, คาสิโนออนไลน์, เว็บพนัน
- บาคาร่า, สล็อต, หวยออนไลน์
- โปรโมชั่นแทงบอล, สมัครเว็บพนัน

#### Social Media Keywords
- #แทงบอล, #คาสิโน, #ufabet, #sbobet
- #เว็บพนัน, #บาคาร่า, #สล็อต, #หวยออนไลน์

### คู่แข่งที่ติดตาม
1. **ufabet** - ufabet.com, ufabet.co
2. **sbobet** - sbobet.com, sbobetmobile.com
3. **lsm99** - lsm99.com, lsm99.net
4. **gclub** - gclub.com, gclub168.com

### ตารางทำงาน
| รอบ | เวลา | รายละเอียด |
|-----|------|------------|
| Daily Digest | 08:00 | สรุปข่าวประจำวัน |
| Check | ทุก 30 นาที | ตรวจสอบข่าวใหม่ |

### ไฟล์ที่สำคัญ
- `marketing-intel/news-monitor.js` - หลัก
- `marketing-intel/config/news-feeds.json` - config
- `marketing-intel/news-feeds/digest/` - daily digest
- `marketing-intel/news-feeds/daily/` - ข้อมูลดิบ

### การใช้งาน
```bash
# รัน manual
node marketing-intel/news-monitor.js

# ดู digest ล่าสุด
cat marketing-intel/news-feeds/digest/$(date +%Y-%m-%d)-digest.md
```

### Cron Job
- ID: d5215012-11f6-4e67-a244-a6e08d2180bc
- เวลา: 08:00 ทุกวัน
- ส่งรายงานทาง Telegram
