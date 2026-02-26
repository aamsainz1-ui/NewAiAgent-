export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  const agents = [
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
  
  res.status(200).json({ 
    agents, 
    gatewayStatus: 'connected',
    timestamp: Date.now() 
  });
}
