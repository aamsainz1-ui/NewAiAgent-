const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Mock data that simulates real OpenClaw data
const AGENTS = [
  { name: 'APEX', role: 'CEO', color: '#00f0ff', active: true, type: 'star', status: 'processing', task: 'Business strategy', category: 'CORE' },
  { name: 'PULSE', role: 'CMO', color: '#ff00aa', active: true, type: 'planet', status: 'working', task: 'SEO Marketing', category: 'CORE' },
  { name: 'CIPHER', role: 'CIO', color: '#ff6600', active: true, type: 'planet', status: 'scraping', task: 'Competitor analysis', category: 'COMM' },
  { name: 'NEXUS', role: 'COO', color: '#00ffaa', active: true, type: 'planet', status: 'deploying', task: 'System operations', category: 'PRODUCTIVITY' },
  { name: 'STAT', role: 'CAO', color: '#ffaa00', active: true, type: 'planet', status: 'analyzing', task: 'Data analysis', category: 'DATA' },
  { name: 'AURA', role: 'CSO', color: '#00ff88', active: Math.random() > 0.7, type: 'moon', status: Math.random() > 0.7 ? 'active' : 'idle', task: Math.random() > 0.7 ? 'Customer support' : null, category: 'MEDIA' },
  { name: 'LEDGER', role: 'CFO', color: '#aa00ff', active: Math.random() > 0.6, type: 'moon', status: Math.random() > 0.6 ? 'active' : 'idle', task: Math.random() > 0.6 ? 'Financial review' : null, category: 'DEV' },
  { name: 'SYNC', role: 'CHRO', color: '#ff00ff', active: Math.random() > 0.8, type: 'moon', status: Math.random() > 0.8 ? 'active' : 'idle', task: Math.random() > 0.8 ? 'Team sync' : null, category: 'HARDWARE' },
  { name: 'ORACLE', role: 'EXT', color: '#ffff00', active: Math.random() > 0.9, type: 'moon', status: Math.random() > 0.9 ? 'active' : 'idle', task: Math.random() > 0.9 ? 'External data' : null, category: 'EXTERNAL' }
];

const ACTIVITIES = [
  { agent: 'APEX', action: 'Processing business data', time: new Date().toISOString() },
  { agent: 'PULSE', action: 'Creating SEO content', time: new Date(Date.now() - 60000).toISOString() },
  { agent: 'CIPHER', action: 'Scraping competitor data', time: new Date(Date.now() - 120000).toISOString() },
  { agent: 'NEXUS', action: 'Deploying updates', time: new Date(Date.now() - 180000).toISOString() },
  { agent: 'STAT', action: 'Analyzing metrics', time: new Date(Date.now() - 240000).toISOString() }
];

// API Routes
app.get('/api/agents', (req, res) => {
  res.json({ 
    agents: AGENTS.map(a => ({ ...a, active: Math.random() > 0.4 })),
    gatewayStatus: 'connected',
    timestamp: Date.now() 
  });
});

app.get('/api/activity', (req, res) => {
  const shuffled = [...ACTIVITIES].sort(() => 0.5 - Math.random());
  res.json({ 
    activities: shuffled.slice(0, 3),
    timestamp: Date.now()
  });
});

app.get('/api/models', (req, res) => {
  res.json({
    current: 'claude-opus-4-6',
    provider: 'google-antigravity',
    gatewayStatus: 'connected',
    tokens: { in: 67000, out: 8300 },
    cache: '84%',
    timestamp: Date.now()
  });
});

app.get('/api/gateway/status', (req, res) => {
  res.json({
    status: 'connected',
    lastUpdate: Date.now(),
    sessions: 5
  });
});

// Static files
app.use(express.static(path.join(__dirname, 'dist')));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 OpenClaw Brain API running on port ${PORT}`);
});
