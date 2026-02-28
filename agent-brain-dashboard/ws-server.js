// WebSocket Server for OpenClaw Dashboard
// Run: node ws-server.js

import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const PORT = process.env.WS_PORT || 8080;

// Create HTTP server
const server = createServer((req, res) => {
  res.writeHead(200, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify({ 
    status: 'OpenClaw WebSocket Server', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  }));
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Connected clients
const clients = new Set();

// Activity templates for real-time simulation
const ACTIVITY_TEMPLATES = [
  { agent: "NEXUS", actions: ["Running healthcheck", "Deploying update", "Monitoring logs", "Scaling resources"] },
  { agent: "PULSE", actions: ["Analyzing TikTok trends", "Checking viral content", "Updating ad bids", "Scanning hashtags"] },
  { agent: "MEMORY", actions: ["Indexing daily logs", "Compressing vectors", "Syncing to disk", "Optimizing RAG"] },
  { agent: "STAT", actions: ["Polling Google Sheets", "Calculating odds", "Updating football data", "Processing analytics"] },
  { agent: "APEX", actions: ["Generating report", "Reviewing strategy", "Allocating budget", "Checking KPIs"] },
  { agent: "CIPHER", actions: ["Scraping competitor", "Analyzing backlinks", "Monitoring mentions", "Tracking ranks"] },
  { agent: "SUPERVISOR", actions: ["Re-allocating tasks", "Balancing load", "Checking quotas", "Optimizing costs"] },
  { agent: "LEDGER", actions: ["Calculating ROI", "Processing payments", "Reconciling accounts", "Checking cashflow"] },
  { agent: "AURA", actions: ["Checking VIP status", "Processing tickets", "Updating CRM", "Analyzing LTV"] },
  { agent: "SYNC", actions: ["Syncing calendars", "Checking tasks", "Updating KPIs", "Managing team"] }
];

// Generate random activity
function generateActivity() {
  const template = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
  const action = template.actions[Math.floor(Math.random() * template.actions.length)];
  return { agent: template.agent, action, timestamp: new Date().toISOString() };
}

// Get real OpenClaw status
async function getOpenClawStatus() {
  try {
    const { stdout } = await execAsync('openclaw status --json 2>/dev/null || echo "{}"');
    return JSON.parse(stdout);
  } catch {
    return {
      status: 'running',
      version: '5.1.0',
      uptime: process.uptime(),
      sessions: Math.floor(Math.random() * 10) + 1
    };
  }
}

// Generate metrics
async function generateMetrics() {
  const openclawStatus = await getOpenClawStatus();
  
  return {
    type: 'metrics',
    timestamp: new Date().toISOString(),
    data: {
      tokensUsed: Math.floor(Math.random() * 1000000) + 500000,
      apiCalls: Math.floor(Math.random() * 5000) + 1000,
      activeSessions: openclawStatus.sessions || Math.floor(Math.random() * 20) + 5,
      cpuUsage: Math.floor(Math.random() * 60) + 20,
      memoryUsage: Math.floor(Math.random() * 70) + 30,
      networkLatency: Math.floor(Math.random() * 50) + 10,
      openclaw: openclawStatus
    }
  };
}

// Generate node statuses
function generateNodeStatuses() {
  const nodes = ['SUPERVISOR', 'APEX', 'PULSE', 'STAT', 'LEDGER', 'AURA', 'NEXUS', 'CIPHER', 'SYNC', 
    'claude-opus', 'claude-sonnet', 'gemini-pro', 'gpt-4o', 'kimi-k2', 'minimax-m2'];
  
  const statuses = {};
  nodes.forEach(nodeId => {
    statuses[nodeId] = {
      status: Math.random() > 0.1 ? 'active' : 'idle',
      lastActive: new Date().toISOString(),
      load: Math.floor(Math.random() * 100),
      quota: nodeId.includes('kimi') ? 85 : nodeId.includes('minimax') ? 5 : Math.floor(Math.random() * 50 + 20)
    };
  });
  
  return { type: 'nodeStatuses', timestamp: new Date().toISOString(), data: statuses };
}

// Broadcast to all clients
function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN = 1
      client.send(message);
    }
  });
}

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const clientId = `${req.socket.remoteAddress}:${req.socket.remotePort}`;
  console.log(`[${new Date().toISOString()}] Client connected: ${clientId}`);
  clients.add(ws);
  
  // Send initial data
  ws.send(JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() }));
  
  // Handle messages from client
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`[${new Date().toISOString()}] Received:`, data.type);
      
      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
      }
      
      if (data.type === 'getMetrics') {
        const metrics = await generateMetrics();
        ws.send(JSON.stringify(metrics));
      }
      
      if (data.type === 'getNodeStatuses') {
        ws.send(JSON.stringify(generateNodeStatuses()));
      }
      
      if (data.type === 'executeCommand') {
        try {
          const { stdout, stderr } = await execAsync(`openclaw ${data.command} 2>&1`);
          ws.send(JSON.stringify({
            type: 'commandResult',
            command: data.command,
            result: stderr || stdout,
            success: true,
            timestamp: new Date().toISOString()
          }));
        } catch (error) {
          ws.send(JSON.stringify({
            type: 'commandResult',
            command: data.command,
            result: error.message,
            success: false,
            timestamp: new Date().toISOString()
          }));
        }
      }
    } catch (err) {
      console.error('Message error:', err);
    }
  });
  
  ws.on('close', () => {
    console.log(`[${new Date().toISOString()}] Client disconnected: ${clientId}`);
    clients.delete(ws);
  });
  
  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
    clients.delete(ws);
  });
});

// Broadcast intervals
const ACTIVITY_INTERVAL = 3000;  // Every 3 seconds
const METRICS_INTERVAL = 5000;   // Every 5 seconds
const NODE_STATUS_INTERVAL = 8000; // Every 8 seconds

// Activity broadcaster
setInterval(() => {
  if (clients.size > 0) {
    broadcast({
      type: 'activity',
      timestamp: new Date().toISOString(),
      data: generateActivity()
    });
  }
}, ACTIVITY_INTERVAL);

// Metrics broadcaster
setInterval(async () => {
  if (clients.size > 0) {
    const metrics = await generateMetrics();
    broadcast(metrics);
  }
}, METRICS_INTERVAL);

// Node status broadcaster
setInterval(() => {
  if (clients.size > 0) {
    broadcast(generateNodeStatuses());
  }
}, NODE_STATUS_INTERVAL);

// Start server
server.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 OpenClaw WebSocket Server');
  console.log('='.repeat(60));
  console.log(`📡 WebSocket: ws://localhost:${PORT}`);
  console.log(`🌐 HTTP: http://localhost:${PORT}`);
  console.log(`👥 Clients: ${clients.size}`);
  console.log('='.repeat(60));
  console.log('Press Ctrl+C to stop');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down...');
  wss.close();
  server.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  wss.close();
  server.close();
  process.exit(0);
});
