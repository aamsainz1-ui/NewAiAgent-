#!/usr/bin/env node
/**
 * UFAX9 News Feed Monitor
 * ติดตามข่าวสารการตลาด คู่แข่ง เทรนด์ อัตโนมัติ
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const DATA_DIR = './marketing-intel/news-feeds';

// แหล่งข่าวที่ติดตาม
const NEWS_SOURCES = {
  // RSS Feeds
  rss: [
    { name: 'Thai PBS Sports', url: 'https://news.thaipbs.or.th/rss/sport.xml', category: 'sports' },
    { name: 'Siam Sport', url: 'https://www.siamsport.co.th/rss/feed.xml', category: 'sports' },
    { name: 'Goal.com Thailand', url: 'https://www.goal.com/th/feeds/news', category: 'football' },
  ],
  
  // Google Alerts (keywords)
  googleAlerts: [
    'ufabet',
    'sbobet', 
    'lsm99',
    'gclub',
    'แทงบอลออนไลน์',
    'คาสิโนออนไลน์',
    'เว็บพนัน',
    'บาคาร่า',
    'สล็อต',
    'หวยออนไลน์'
  ],
  
  // Social Media Keywords
  socialKeywords: [
    '#แทงบอล',
    '#คาสิโน',
    '#ufabet',
    '#sbobet',
    '#เว็บพนัน',
    '#บาคาร่า',
    '#สล็อต'
  ]
};

// คู่แข่งที่ติดตาม
const COMPETITORS = [
  { name: 'ufabet', domains: ['ufabet.com', 'ufabet.co'], social: ['@ufabetofficial'] },
  { name: 'sbobet', domains: ['sbobet.com'], social: ['@sbobet'] },
  { name: 'lsm99', domains: ['lsm99.com'], social: ['@lsm99official'] },
  { name: 'gclub', domains: ['gclub.com'], social: ['@gclubcasino'] }
];

async function ensureDirectories() {
  const today = new Date().toISOString().split('T')[0];
  const dirs = [
    path.join(DATA_DIR, 'daily', today),
    path.join(DATA_DIR, 'alerts'),
    path.join(DATA_DIR, 'competitors'),
    path.join(DATA_DIR, 'trends'),
    path.join(DATA_DIR, 'digest')
  ];
  
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
  return today;
}

// เก็บข่าวที่ดึงมา
async function collectNews(today) {
  const news = {
    timestamp: new Date().toISOString(),
    date: today,
    sources: [],
    alerts: [],
    competitorMentions: [],
    trends: []
  };
  
  // เก็บ RSS feeds
  for (const source of NEWS_SOURCES.rss) {
    news.sources.push({
      type: 'rss',
      name: source.name,
      url: source.url,
      category: source.category,
      lastChecked: new Date().toISOString(),
      items: [] // จะเติมจากการ scrape
    });
  }
  
  // เก็บ Google Alerts keywords
  news.alerts = NEWS_SOURCES.googleAlerts.map(kw => ({
    keyword: kw,
    googleAlertUrl: `https://www.google.com/alerts/feeds?keyword=${encodeURIComponent(kw)}`,
    lastChecked: new Date().toISOString()
  }));
  
  // เก็บ competitor mentions
  for (const comp of COMPETITORS) {
    news.competitorMentions.push({
      competitor: comp.name,
      domains: comp.domains,
      social: comp.social,
      mentions: [],
      lastChecked: new Date().toISOString()
    });
  }
  
  return news;
}

// สร้าง Daily Digest
async function createDailyDigest(today, news) {
  let digest = `# 📰 UFAX9 Daily News Digest - ${today}\n\n`;
  digest += `**เวลา:** ${new Date().toLocaleTimeString('th-TH')}\n`;
  digest += `**แหล่งข่าว:** ${news.sources.length} แหล่ง\n`;
  digest += `**Keywords ที่ติดตาม:** ${news.alerts.length} คำ\n\n`;
  
  digest += `## 🔥 ข่าวสำคัญวันนี้\n\n`;
  digest += `_ยังไม่มีข้อมูล ระบบกำลังเก็บข้อมูล..._\n\n`;
  
  digest += `## 🏆 คู่แข่งที่ติดตาม\n\n`;
  for (const comp of news.competitorMentions) {
    digest += `- **${comp.competitor}**: ${comp.domains.join(', ')}\n`;
  }
  
  digest += `\n## 📊 Keywords ที่ติดตาม\n\n`;
  for (const alert of news.alerts.slice(0, 10)) {
    digest += `- ${alert.keyword}\n`;
  }
  
  if (news.alerts.length > 10) {
    digest += `- ...และอีก ${news.alerts.length - 10} คำ\n`;
  }
  
  digest += `\n## 💡 แนวโน้มที่ควรรู้\n\n`;
  digest += `- ติดตามข่าวกีฬาไทย สำหรับ content marketing\n`;
  digest += `- ติดตามโปรโมชั่นคู่แข่ง ปรับกลยุทธ์การตลาด\n`;
  digest += `- ติดตามเทรนด์การพนันออนไลน์\n`;
  
  digest += `\n---\n`;
  digest += `*รายงานโดย UFAX9 News Feed Monitor*\n`;
  
  return digest;
}

// Main
async function main() {
  console.log('📰 UFAX9 News Feed Monitor');
  console.log('═══════════════════════════════════════\n');
  
  const today = await ensureDirectories();
  console.log(`📅 วันที่: ${today}`);
  
  // Collect news
  console.log('\n🔍 กำลังเก็บข้อมูลข่าว...');
  const news = await collectNews(today);
  
  // Save raw data
  const rawPath = path.join(DATA_DIR, 'daily', today, 'news-raw.json');
  await fs.writeFile(rawPath, JSON.stringify(news, null, 2));
  console.log(`✅ บันทึกข้อมูลดิบ: ${rawPath}`);
  
  // Create digest
  console.log('\n📝 กำลังสร้าง Daily Digest...');
  const digest = await createDailyDigest(today, news);
  const digestPath = path.join(DATA_DIR, 'digest', `${today}-digest.md`);
  await fs.writeFile(digestPath, digest);
  console.log(`✅ บันทึก Digest: ${digestPath}`);
  
  // Display summary
  console.log('\n📊 สรุป:');
  console.log(`   - แหล่งข่าว: ${news.sources.length}`);
  console.log(`   - Keywords: ${news.alerts.length}`);
  console.log(`   - คู่แข่ง: ${news.competitorMentions.length}`);
  
  console.log('\n📁 ไฟล์ที่สร้าง:');
  console.log(`   - ${rawPath}`);
  console.log(`   - ${digestPath}`);
  
  console.log('\n✅ เสร็จสิ้น!');
}

main().catch(console.error);
