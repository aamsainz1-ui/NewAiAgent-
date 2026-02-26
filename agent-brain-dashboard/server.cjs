const express = require('express');
const { WebSocket } = require('ws');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// OpenClay Gateway WebSocket
const GATEWAY_URL = 'ws://127.0.0.1:18789';
const GATEWAY_TOKEN = process.env.GATEWAY_TOKEN || '';

// Cache for real-time data
let cachedData = {
  agents: [],
  sessions: [],
  models: {},
  timestamp: Date.now()
};

// Connect to OpenClaw Gateway
function connectToGateway() {
  const ws = new WebSocket(GATEWAY_URL, {
    headers: { 'Authorization': `Bearer ${GATEWAY_TOKEN}` }
  });
  
  ws.on('open', () => {
    console.log('Connected to OpenClaw Gateway');
    // Subscribe to events
    ws.send(JSON.stringify({ type: 'subscribe', channels: ['sessions', 'agents', 'models'] }));
  });
  
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      if (msg.type === 'sessions') cachedData.sessions = msg.data;
      if (msg.type === 'agents') cachedData.agents = msg.data;
      if (msg.type === 'models') cachedData.models = msg.data;
      cachedData.timestamp = Date.now();
    } catch (e) {
      console.error('Parse error:', e);
    }
  });
  
  ws.on('error', (err) => console.error('WebSocket error:', err.message));
  ws.on('close', () => {
    console.log('Disconnected, reconnecting...');
    setTimeout(connectToGateway, 5000);
  });
}

// API Routes

// Get real-time agent data
app.get('/api/agents', async (req, res) => {
  try {
    // Mock for now - will be replaced with real OpenClaw data
    const agents = [
      { name: 'APEX', role: 'CEO', color: '#00f0ff', active: true, status: 'processing', type: 'star', task: 'Analyzing business data' },
      { name: 'PULSE', role: 'CMO', color: '#ff00aa', active: true, status: 'working', type: 'planet', task: 'Creating SEO content' },
      { name: 'AURA', role: 'CSO', color: '#00ff88', active: false, status: 'idle', task: null, type: 'moon' },
      { name: 'STAT', role: 'CAO', color: '#ffaa00', active: true, status: 'analyzing', type: 'planet', task: 'Football prediction' },
      { name: 'LEDGER', role: 'CFO', color: '#aa00ff', active: false, status: 'idle', task: null, type: 'moon' },
      { name: 'NEXUS', role: 'COO', color: '#00ffaa', active: true, status: 'deploying', type: 'planet', task: 'Deploying dashboard' },
      { name: 'CIPHER', role: 'CIO', color: '#ff6600', active: true, status: 'scraping', type: 'planet', task: 'Competitor analysis' },
      { name: 'SYNC', role: 'CHRO', color: '#ff00ff', active: false, status: 'idle', task: null, type: 'moon' }
    ];
    res.json({ agents, timestamp: Date.now() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get session data
app.get('/api/sessions', async (req, res) => {
  try {
    // Will integrate with real OpenClaw sessions
    res.json({ 
      sessions: cachedData.sessions,
      active: 5,
      timestamp: Date.now()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get model usage
app.get('/api/models', async (req, res) => {
  try {
    res.json({
      current: 'claude-opus-4-6',
      provider: 'google-antigravity',
      tokens: { in: 67000, out: 8300 },
      cache: '84%',
      timestamp: Date.now()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get live activity
app.get('/api/activity', async (req, res) => {
  try {
    const activities = [
      { agent: 'APEX', action: 'Processing data', time: new Date().toISOString() },
      { agent: 'PULSE', action: 'Creating content', time: new Date().toISOString() },
      { agent: 'CIPHER', action: 'Scraping data', time: new Date().toISOString() },
      { agent: 'STAT', action: 'Analyzing stats', time: new Date().toISOString() }
    ];
    res.json({ activities, timestamp: Date.now() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all data
app.get('/api/all', async (req, res) => {
  try {
    const [agentsRes, activityRes, modelsRes] = await Promise.all([
      fetch('http://localhost:3001/api/agents').then(r => r.json()),
      fetch('http://localhost:3001/api/activity').then(r => r.json()),
      fetch('http://localhost:3001/api/models').then(r => r.json())
    ]);
    
    res.json({
      agents: agentsRes.agents,
      activity: activityRes.activities,
      models: modelsRes,
      timestamp: Date.now()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve React app - must be last
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // connectToGateway(); // Uncomment when ready
});
