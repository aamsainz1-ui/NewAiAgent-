#!/usr/bin/env node
/**
 * UFAX9 Marketing Intelligence Analyzer
 * วิเคราะห์ข้อมูลการตลาดที่เก็บไว้
 */

const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = './marketing-intel';

// Analyze daily data
async function analyzeDay(date) {
  const dayDir = path.join(DATA_DIR, 'daily', date);
  
  try {
    const files = await fs.readdir(dayDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const allData = [];
    for (const file of jsonFiles) {
      const content = await fs.readFile(path.join(dayDir, file), 'utf-8');
      allData.push(JSON.parse(content));
    }
    
    // Aggregate insights
    const insights = {
      date,
      rounds: allData.length,
      competitorsTracked: 5,
      keyFindings: [],
      recommendations: []
    };
    
    // Check for promotions
    allData.forEach(round => {
      round.competitors.forEach(comp => {
        if (comp.promotions.length > 0) {
          insights.keyFindings.push({
            type: 'promotion',
            competitor: comp.name,
            promotions: comp.promotions,
            time: round.timestamp
          });
        }
      });
    });
    
    // Generate recommendations
    if (insights.keyFindings.length > 0) {
      insights.recommendations.push('ตรวจพบโปรโมชั่นใหม่จากคู่แข่ง ควรพิจารณาทำโปรโมชั่นตอบโต้');
    }
    
    insights.recommendations.push('ติดตามผลการตลาดอย่างต่อเนื่อง');
    
    return insights;
  } catch (err) {
    console.error(`Error analyzing ${date}:`, err.message);
    return null;
  }
}

// Generate weekly report
async function generateWeeklyReport() {
  const today = new Date();
  const weekStart = new Date(today - 7 * 24 * 60 * 60 * 1000);
  
  const insights = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayInsight = await analyzeDay(dateStr);
    if (dayInsight) {
      insights.push(dayInsight);
    }
  }
  
  // Generate report
  let report = `# UFAX9 Weekly Marketing Intelligence Report\n\n`;
  report += `**รายงานวันที่:** ${today.toLocaleDateString('th-TH')}\n\n`;
  report += `## 📊 สรุปสัปดาห์\n\n`;
  report += `- วันที่ติดตาม: ${insights.length} วัน\n`;
 report += `- ข้อมูลที่เก็บ: ${insights.reduce((sum, d) => sum + d.rounds, 0)} รอบ\n`;
  report += `- คู่แข่งที่ตรวจสอบ: 5 เว็บ\n\n`;
  
  if (insights.some(i => i.keyFindings.length > 0)) {
    report += `## 🎯 คู่แข่งเด่น\n\n`;
    insights.forEach(day => {
      day.keyFindings.forEach(finding => {
        report += `- **${finding.competitor}** (${finding.time}): ${finding.promotions.join(', ')}\n`;
      });
    });
  }
  
  report += `\n## 💡 คำแนะนำ\n\n`;
  const allRecs = insights.flatMap(i => i.recommendations);
  const uniqueRecs = [...new Set(allRecs)];
  uniqueRecs.forEach((rec, idx) => {
    report += `${idx + 1}. ${rec}\n`;
  });
  
  // Save report
  const reportPath = path.join(DATA_DIR, 'reports', `weekly-${today.toISOString().split('T')[0]}.md`);
  await fs.writeFile(reportPath, report);
  
  return report;
}

// CLI
const command = process.argv[2];

if (command === 'daily') {
  const date = process.argv[3] || new Date().toISOString().split('T')[0];
  analyzeDay(date).then(result => {
    console.log(JSON.stringify(result, null, 2));
  });
} else if (command === 'weekly') {
  generateWeeklyReport().then(report => {
    console.log(report);
  });
} else {
  console.log('Usage: node analyze.js [daily|weekly] [date]');
}
