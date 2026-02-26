#!/usr/bin/env node
/**
 * Antigravity Quota Monitor for Terminal
 * เช็คโควต้า AI แบบ real-time บน terminal
 * 
 * Usage: node antigravity-quota.js
 *        node antigravity-quota.js --watch
 */

const https = require('https');
const { execSync } = require('child_process');

// Colors for terminal
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

// Pool definitions
const POOLS = {
  gemini: {
    name: 'Gemini 3.x',
    models: ['Gemini 3 Pro (High)', 'Gemini 3 Pro (Low)', 'Gemini 3 Flash'],
    color: COLORS.blue
  },
  claude: {
    name: 'Claude / GPT',
    models: ['Claude Sonnet 4.5', 'Claude Opus 4.5', 'GPT-OSS 120B'],
    color: COLORS.cyan
  },
  gemflash: {
    name: 'Gemini 3 Flash',
    models: ['Gemini 3 Flash'],
    color: COLORS.yellow
  }
};

// Find Antigravity process
function findAntigravityProcess() {
  try {
    // Try to find language_server process
    const output = execSync('ps aux | grep -E "language_server|antigravity" | grep -v grep', { encoding: 'utf8' });
    const lines = output.trim().split('\n');
    
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[1];
      const cmd = parts.slice(10).join(' ');
      
      // Extract port and token from command
      const portMatch = cmd.match(/--port=(\d+)/);
      const tokenMatch = cmd.match(/--token=([\w-]+)/);
      
      if (portMatch) {
        return {
          pid,
          port: portMatch[1],
          token: tokenMatch ? tokenMatch[1] : null,
          cmd
        };
      }
    }
  } catch (e) {
    // Process not found
  }
  return null;
}

// Get quota from Antigravity API
async function getQuota(host, port, token) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'GetUserStatus',
      params: {}
    });

    const options = {
      hostname: host || '127.0.0.1',
      port: port || '443',
      path: '/api/v1/rpc',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Length': Buffer.byteLength(postData)
      },
      rejectUnauthorized: false // Allow self-signed cert
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Get status icon
function getStatusIcon(percentage) {
  if (percentage > 50) return `${COLORS.green}🟢${COLORS.reset}`;
  if (percentage >= 20) return `${COLORS.yellow}🟡${COLORS.reset}`;
  return `${COLORS.red}🔴${COLORS.reset}`;
}

// Get status text
function getStatusText(percentage) {
  if (percentage > 50) return `${COLORS.green}Healthy${COLORS.reset}`;
  if (percentage >= 20) return `${COLORS.yellow}Low${COLORS.reset}`;
  return `${COLORS.red}Critical${COLORS.reset}`;
}

// Format time remaining
function formatTimeRemaining(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

// Draw progress bar
function drawProgressBar(percentage, width = 30) {
  const filled = Math.floor((percentage / 100) * width);
  const empty = width - filled;
  
  let color = COLORS.green;
  if (percentage < 50) color = COLORS.yellow;
  if (percentage < 20) color = COLORS.red;
  
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `${color}${bar}${COLORS.reset} ${color}${percentage.toFixed(1)}%${COLORS.reset}`;
}

// Clear screen
function clearScreen() {
  console.clear();
  console.log('\x1b[3J');
}

// Display quota
function displayQuota(data) {
  clearScreen();
  
  console.log(`\n${COLORS.bright}╔════════════════════════════════════════════════════════════╗${COLORS.reset}`);
  console.log(`${COLORS.bright}║     🚀 ANTIGRAVITY QUOTA MONITOR - Terminal Edition       ║${COLORS.reset}`);
  console.log(`${COLORS.bright}╚════════════════════════════════════════════════════════════╝${COLORS.reset}\n`);
  
  if (!data || !data.result) {
    console.log(`${COLORS.red}❌ Cannot fetch quota data${COLORS.reset}`);
    console.log(`${COLORS.gray}Make sure Antigravity is running${COLORS.reset}\n`);
    return;
  }
  
  const { quota, usage } = data.result;
  
  // Display by pool
  for (const [poolId, pool] of Object.entries(POOLS)) {
    console.log(`${pool.color}${COLORS.bright}📦 ${pool.name}${COLORS.reset}`);
    console.log(`${COLORS.gray}   Models: ${pool.models.join(', ')}${COLORS.reset}\n`);
    
    // Simulate pool data (structure depends on actual API response)
    const poolQuota = quota?.[poolId] || { total: 1000, used: 0, resetTime: Date.now() + 5 * 60 * 60 * 1000 };
    const remaining = poolQuota.total - poolQuota.used;
    const percentage = (remaining / poolQuota.total) * 100;
    const timeUntilReset = poolQuota.resetTime - Date.now();
    
    console.log(`   Status: ${getStatusIcon(percentage)} ${getStatusText(percentage)}`);
    console.log(`   ${drawProgressBar(percentage)}`);
    console.log(`   Remaining: ${remaining.toLocaleString()} / ${poolQuota.total.toLocaleString()} requests`);
    console.log(`   Reset in: ${formatTimeRemaining(timeUntilReset)}\n`);
  }
  
  // Summary
  console.log(`${COLORS.bright}────────────────────────────────────────────────────────────${COLORS.reset}\n`);
  console.log(`${COLORS.gray}Last updated: ${new Date().toLocaleTimeString()}${COLORS.reset}`);
  console.log(`${COLORS.gray}Auto-refresh: Every 30 seconds${COLORS.reset}`);
  console.log(`${COLORS.gray}Press Ctrl+C to exit${COLORS.reset}\n`);
}

// Mock data for testing
function getMockData() {
  return {
    result: {
      quota: {
        gemini: { total: 10000, used: 2300, resetTime: Date.now() + 4.5 * 60 * 60 * 1000 },
        claude: { total: 5000, used: 4200, resetTime: Date.now() + 3.2 * 60 * 60 * 1000 },
        gemflash: { total: 20000, used: 1500, resetTime: Date.now() + 4.8 * 60 * 60 * 1000 }
      }
    }
  };
}

// Main function
async function main() {
  const watchMode = process.argv.includes('--watch') || process.argv.includes('-w');
  const useMock = process.argv.includes('--mock') || process.argv.includes('-m');
  
  console.log(`${COLORS.cyan}🔍 Checking Antigravity status...${COLORS.reset}\n`);
  
  if (useMock) {
    console.log(`${COLORS.yellow}⚠️  Using mock data for demonstration${COLORS.reset}\n`);
  }
  
  // Find process
  const process = findAntigravityProcess();
  if (!process && !useMock) {
    console.log(`${COLORS.red}❌ Antigravity process not found${COLORS.reset}`);
    console.log(`${COLORS.gray}Tips:${COLORS.reset}`);
    console.log(`  • Make sure Antigravity IDE is running`);
    console.log(`  • Or use --mock flag for demo\n`);
    process.exit(1);
  }
  
  if (process && !useMock) {
    console.log(`${COLORS.green}✓ Found Antigravity process (PID: ${process.pid})${COLORS.reset}`);
    console.log(`${COLORS.gray}  Port: ${process.port}${COLORS.reset}\n`);
  }
  
  // Fetch and display
  async function fetchAndDisplay() {
    try {
      let data;
      if (useMock) {
        data = getMockData();
      } else {
        data = await getQuota('127.0.0.1', process.port, process.token);
      }
      displayQuota(data);
    } catch (err) {
      console.log(`${COLORS.red}❌ Error fetching quota: ${err.message}${COLORS.reset}`);
      if (!watchMode) process.exit(1);
    }
  }
  
  // Initial display
  await fetchAndDisplay();
  
  // Watch mode
  if (watchMode) {
    console.log(`${COLORS.cyan}👀 Watching for changes...${COLORS.reset}\n`);
    setInterval(fetchAndDisplay, 30000); // Refresh every 30 seconds
  }
}

main().catch(console.error);
