#!/usr/bin/env node
/**
 * UFAX9 Marketing Intelligence Collector
 * เก็บข้อมูลการตลาดเว็บพนัน 3 รอบ/วัน
 */

const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  competitors: [
    { name: 'ufabet', domain: 'ufabet.com', keywords: ['ufabet', 'ยูฟ่าเบท'] },
    { name: 'sbobet', domain: 'sbobet.com', keywords: ['sbobet', 'สโบเบ็ต'] },
    { name: 'lsm99', domain: 'lsm99.com', keywords: ['lsm99', 'แอลเอสเอ็ม'] },
    { name: 'gclub', domain: 'gclub.com', keywords: ['gclub', 'จีคลับ'] },
    { name: 'holiday', domain: 'holidaypalace.com', keywords: ['holiday palace'] }
  ],
  dataDir: './marketing-intel'
};

// Create date-based directory structure
async function ensureDirectories() {
  const today = new Date().toISOString().split('T')[0];
  const dirs = [
    path.join(CONFIG.dataDir, 'daily', today),
    path.join(CONFIG.dataDir, 'trends'),
    path.join(CONFIG.dataDir, 'competitors'),
    path.join(CONFIG.dataDir, 'reports')
  ];
  
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
  
  return today;
}

// Get current time for filename
function getTimeString() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
}

// Simulate competitor scan (replace with real web scraping)
async function scanCompetitors() {
  const results = [];
  
  for (const comp of CONFIG.competitors) {
    // In real implementation, this would fetch actual data
    results.push({
      name: comp.name,
      domain: comp.domain,
      lastSeen: new Date().toISOString(),
      promotions: [], // Would contain real promo data
      changes: [],    // Detected changes
      keywords: comp.keywords
    });
  }
  
  return results;
}

// Analyze trends
async function analyzeTrends() {
  return {
    timestamp: new Date().toISOString(),
    hotKeywords: [],
    trendingHashtags: [],
    adFormats: [],
    platforms: ['TikTok', 'Facebook', 'Google Ads'],
    notes: ''
  };
}

// Main collection function
async function collect(roundType) {
  const today = await ensureDirectories();
  const timeStr = getTimeString();
  
  console.log(`[${timeStr}] Starting ${roundType} collection...`);
  
  const data = {
    timestamp: new Date().toISOString(),
    round: roundType,
    competitors: await scanCompetitors(),
    trends: await analyzeTrends(),
    summary: {
      totalCompetitors: CONFIG.competitors.length,
      activePromos: 0,
      newCampaigns: [],
      alerts: []
    }
  };
  
  // Save to file
  const filename = `${timeStr}-${roundType}.json`;
  const filepath = path.join(CONFIG.dataDir, 'daily', today, filename);
  
  await fs.writeFile(filepath, JSON.stringify(data, null, 2));
  
  console.log(`[${timeStr}] Saved: ${filepath}`);
  
  // Create/update daily summary
  await updateDailySummary(today, data);
  
  return data;
}

// Update daily summary file
async function updateDailySummary(today, newData) {
  const summaryPath = path.join(CONFIG.dataDir, 'daily', today, 'daily-summary.md');
  
  let content = '';
  try {
    content = await fs.readFile(summaryPath, 'utf-8');
  } catch {
    // File doesn't exist yet
    content = `# Marketing Intel Summary - ${today}\n\n## UFAX9 Competitive Analysis\n\n`;
  }
  
  content += `\n### ${new Date().toLocaleTimeString('th-TH')} - ${newData.round.toUpperCase()}\n\n`;
  content += `- คู่แข่งที่ตรวจสอบ: ${newData.summary.totalCompetitors} เว็บ\n`;
  content += `- โปรโมชั่นใหม่: ${newData.summary.activePromos} รายการ\n`;
  content += `- ช่องทางที่ตรวจสอบ: ${newData.trends.platforms.join(', ')}\n`;
  
  if (newData.summary.alerts.length > 0) {
    content += `\n**⚠️ Alerts:**\n`;
    newData.summary.alerts.forEach(alert => {
      content += `- ${alert}\n`;
    });
  }
  
  await fs.writeFile(summaryPath, content);
}

// CLI
const roundType = process.argv[2] || 'morning';

collect(roundType)
  .then(() => {
    console.log('✅ Collection complete');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
