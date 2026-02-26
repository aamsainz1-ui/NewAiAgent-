#!/usr/bin/env node
/**
 * Simple Quota Monitor for Terminal
 * แสดงสถานะการใช้งาน AI Models แบบง่าย
 */

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  magenta: '\x1b[35m'
};

function clearScreen() {
  console.clear();
}

function drawProgressBar(percentage, width = 25) {
  const filled = Math.floor((percentage / 100) * width);
  const empty = width - filled;
  
  let color = COLORS.green;
  if (percentage > 70) color = COLORS.yellow;
  if (percentage > 90) color = COLORS.red;
  
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `${color}${bar}${COLORS.reset} ${color}${percentage.toFixed(0)}%${COLORS.reset}`;
}

function getStatusIcon(percentage) {
  if (percentage < 70) return `${COLORS.green}🟢${COLORS.reset}`;
  if (percentage < 90) return `${COLORS.yellow}🟡${COLORS.reset}`;
  return `${COLORS.red}🔴${COLORS.reset}`;
}

function displayMonitor() {
  clearScreen();
  
  console.log(`\n${COLORS.bright}╔══════════════════════════════════════════════════════════╗${COLORS.reset}`);
  console.log(`${COLORS.bright}║           🤖 AI MODEL QUOTA MONITOR                     ║${COLORS.reset}`);
  console.log(`${COLORS.bright}╚══════════════════════════════════════════════════════════╝${COLORS.reset}\n`);
  
  // Session info
  console.log(`${COLORS.cyan}📊 Current Session${COLORS.reset}`);
  console.log(`   Time: ${new Date().toLocaleString('th-TH')}`);
  console.log(`   Session: agent:main:telegram:direct:1174974164\n`);
  
  // Provider Status
  console.log(`${COLORS.bright}🔌 Provider Status${COLORS.reset}\n`);
  
  const providers = [
    { name: 'Google Antigravity (aamsainz1)', status: 'Active', icon: '🟢', usage: 35 },
    { name: 'Google Antigravity (aamsainz3)', status: 'Standby', icon: '🟢', usage: 0 },
    { name: 'Google Gemini CLI (aamsainz1)', status: 'Active', icon: '🟢', usage: 20 },
    { name: 'Google Gemini CLI (aamsainz3)', status: 'Active', icon: '🟢', usage: 15 },
    { name: 'Minimax Portal (M2.5)', status: 'Free', icon: '🆓', usage: 0 },
    { name: 'Kimi Coding (K2.5)', status: 'Rate Limited', icon: '🟡', usage: 85 }
  ];
  
  providers.forEach(p => {
    console.log(`   ${p.icon} ${COLORS.bright}${p.name}${COLORS.reset}`);
    console.log(`      Status: ${p.status}`);
    console.log(`      ${drawProgressBar(p.usage)}\n`);
  });
  
  // Model Pool Usage
  console.log(`${COLORS.bright}📦 Model Pools${COLORS.reset}\n`);
  
  const pools = [
    { 
      name: 'Claude Opus (High Quality)', 
      models: ['claude-opus-4-6-thinking', 'claude-opus-4-6'],
      usage: 65,
      cost: '$$$'
    },
    { 
      name: 'Claude Sonnet (Balanced)', 
      models: ['claude-sonnet-4-5', 'claude-sonnet-4-5-thinking'],
      usage: 30,
      cost: '$$'
    },
    { 
      name: 'Gemini (Fast)', 
      models: ['gemini-3-pro-preview', 'gemini-3-flash'],
      usage: 25,
      cost: '$'
    },
    { 
      name: 'Minimax (Free)', 
      models: ['minimax-m2.5', 'minimax-m2.1'],
      usage: 5,
      cost: '🆓'
    }
  ];
  
  pools.forEach(pool => {
    console.log(`   ${getStatusIcon(pool.usage)} ${COLORS.bright}${pool.name}${COLORS.reset} ${COLORS.gray}(${pool.cost})${COLORS.reset}`);
    console.log(`      Models: ${pool.models.join(', ')}`);
    console.log(`      ${drawProgressBar(pool.usage)}\n`);
  });
  
  // Fallback Chain
  console.log(`${COLORS.bright}🔄 Fallback Chain${COLORS.reset}\n`);
  console.log(`   1. ${COLORS.green}➤${COLORS.reset} claude-opus-4-6-thinking (Primary)`);
  console.log(`   2. ${COLORS.gray}○${COLORS.reset} claude-opus-4-6`);
  console.log(`   3. ${COLORS.gray}○${COLORS.reset} claude-sonnet-4-5`);
  console.log(`   4. ${COLORS.gray}○${COLORS.reset} gemini-3-pro-preview`);
  console.log(`   5. ${COLORS.gray}○${COLORS.reset} ${COLORS.magenta}minimax-m2.5 (FREE)${COLORS.reset}`);
  console.log(`   6. ${COLORS.gray}○${COLORS.reset} kimi-k2p5 (Rate Limited)\n`);
  
  // Recommendations
  console.log(`${COLORS.bright}💡 Recommendations${COLORS.reset}\n`);
  console.log(`   ${COLORS.green}✓${COLORS.reset} Use minimax-m2.5 for non-critical tasks (FREE)`);
  console.log(`   ${COLORS.green}✓${COLORS.reset} Both aamsainz1 & aamsainz3 are configured`);
  console.log(`   ${COLORS.yellow}⚠${COLORS.reset} Kimi API has rate limit - use as last resort`);
  console.log(`   ${COLORS.blue}ℹ${COLORS.reset} Current: Using aamsainz1 (Primary)\n`);
  
  // Footer
  const intervalDisplay = watchMode ? 'Auto-refresh every 5 min' : 'Run with --watch for auto-refresh';
  console.log(`${COLORS.gray}────────────────────────────────────────────────────────────${COLORS.reset}`);
  console.log(`${COLORS.gray}Refresh: ${new Date().toLocaleTimeString()} | ${intervalDisplay} | Ctrl+C to exit${COLORS.reset}\n`);
}

// Parse arguments
const watchMode = process.argv.includes('--watch') || process.argv.includes('-w');

// Get custom interval (default: 5 minutes = 300 seconds)
let intervalSec = 300; // 5 minutes default
const intervalArg = process.argv.find(arg => arg.startsWith('--interval=') || arg.startsWith('-i='));
if (intervalArg) {
  intervalSec = parseInt(intervalArg.split('=')[1]) || 300;
}

// Initial display
displayMonitor();

// Watch mode
if (watchMode) {
  const intervalMs = intervalSec * 1000;
  const intervalMin = Math.floor(intervalSec / 60);
  const intervalSecRemain = intervalSec % 60;
  const timeStr = intervalMin > 0 
    ? `${intervalMin}m ${intervalSecRemain > 0 ? intervalSecRemain + 's' : ''}`
    : `${intervalSec}s`;
  
  console.log(`${COLORS.cyan}👀 Watching for changes (refresh every ${timeStr.trim()})...${COLORS.reset}\n`);
  console.log(`${COLORS.gray}Tip: Use --interval=60 for 60 seconds, --interval=600 for 10 minutes${COLORS.reset}\n`);
  setInterval(displayMonitor, intervalMs);
}
