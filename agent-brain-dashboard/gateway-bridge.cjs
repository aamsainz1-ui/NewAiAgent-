const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const GATEWAY_URL = 'ws://127.0.0.1:18789';
const GATEWAY_TOKEN = process.env.GATEWAY_TOKEN || '';

let gatewayData = {
  sessions: [],
  agents: [],
  status: 'connecting',
  lastUpdate: Date.now()
};

// Connect to OpenClaw Gateway
function connectGateway() {
  console.log('Connecting to OpenClaw Gateway...');
  
  const ws = new WebSocket(GATEWAY_URL, {
    headers: {
      'Authorization': `Bearer ${GATEWAY_TOKEN}`
    }
  });
  
  ws.on('open', () => {
    console.log('✅ Connected to OpenClaw Gateway');
    gatewayData.status = 'connected';
    
    // Query for sessions
    ws.send(JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'sessions/list',
      params: { limit: 10 }
    }));
    
    // Query for status
    ws.send(JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'status'
    }));
  });
  
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      console.log('Gateway message:', msg.method || msg.id);
      
      if (msg.result?.sessions) {
        gatewayData.sessions = msg.result.sessions;
        gatewayData.lastUpdate = Date.now();
      }
      
      if (msg.result?.status) {
        gatewayData.status = msg.result.status;
      }
    } catch (e) {
      console.log('Raw message:', data.toString().slice(0, 100));
    }
  });
  
  ws.on('error', (err) => {
    console.error('❌ Gateway error:', err.message);
    gatewayData.status = 'error';
  });
  
  ws.on('close', () => {
    console.log('🔌 Gateway disconnected, retrying...');
    gatewayData.status = 'reconnecting';
    setTimeout(connectGateway, 5000);
  });
}

// API Routes
app.get('/api/gateway/status', (req, res) => {
  res.json({
    status: gatewayData.status,
    lastUpdate: gatewayData.lastUpdate,
    sessions: gatewayData.sessions.length
  });
});

app.get('/api/agents', (req, res) => {
  // Map OpenClaw data to agent format
  const activeSessions = gatewayData.sessions.filter(s => s.active).length;
  
  const agents = [
    { name: 'APEX', role: 'CEO', color: '#00f0ff', active: true, type: 'star', status: 'processing', task: 'Business analysis', sessions: activeSessions },
    { name: 'PULSE', role: 'CMO', color: '#ff00aa', active: true, type: 'planet', status: 'working', task: 'Marketing', sessions: Math.floor(activeSessions * 0.8) },
    { name: 'AURA', role: 'CSO', color: '#00ff88', active: activeSessions > 3, type: 'moon', status: activeSessions > 3 ? 'active' : 'idle', task: activeSessions > 3 ? 'Customer support' : null },
    { name: 'STAT', role: 'CAO', color: '#ffaa00', active: true, type: 'planet', status: 'analyzing', task: 'Data analysis', sessions: Math.floor(activeSessions * 0.6) },
    { name: 'LEDGER', role: 'CFO', color: '#aa00ff', active: gatewayData.sessions.length > 5, type: 'moon', status: gatewayData.sessions.length > 5 ? 'active' : 'idle', task: gatewayData.sessions.length > 5 ? 'Financial review' : null },
    { name: 'NEXUS', role: 'COO', color: '#00ffaa', active: true, type: 'planet', status: 'deploying', task: 'System operations', sessions: Math.floor(activeSessions * 0.9) },
    { name: 'CIPHER', role: 'CIO', color: '#ff6600', active: true, type: 'planet', status: 'scraping', task: 'Intelligence gathering', sessions: Math.floor(activeSessions * 0.7) },
    { name: 'SYNC', role: 'CHRO', color: '#ff00ff', active: gatewayData.sessions.length > 8, type: 'moon', status: gatewayData.sessions.length > 8 ? 'active' : 'idle', task: gatewayData.sessions.length > 8 ? 'Team sync' : null }
  ];
  
  res.json({ 
    agents, 
    gatewayStatus: gatewayData.status,
    timestamp: Date.now() 
  });
});

app.get('/api/activity', (req, res) => {
  const activities = gatewayData.sessions.slice(0, 5).map((s, i) => ({
    agent: ['APEX', 'PULSE', 'CIPHER', 'STAT', 'NEXUS'][i % 5],
    action: s.lastMessage?.slice(0, 30) || 'Processing',
    time: new Date(s.lastActive).toLocaleTimeString(),
    session: s.id?.slice(0, 8)
  }));
  
  res.json({ 
    activities: activities.length > 0 ? activities : [
      { agent: 'APEX', action: 'Monitoring gateway', time: 'now' },
      { agent: 'NEXUS', action: 'System ready', time: 'now' }
    ],
    timestamp: Date.now()
  });
});

app.get('/api/models', (req, res) => {
  res.json({
    current: 'claude-opus-4-6',
    provider: 'google-antigravity',
    gatewayStatus: gatewayData.status,
    sessions: gatewayData.sessions.length,
    timestamp: Date.now()
  });
});

app.get('/api/sessions', (req, res) => {
  res.json({
    sessions: gatewayData.sessions,
    count: gatewayData.sessions.length,
    timestamp: Date.now()
  });
});

// Static files
app.use(express.static(path.join(__dirname, 'dist')));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Bridge server on port ${PORT}`);
  connectGateway();
});
