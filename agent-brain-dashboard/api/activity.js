export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  const activities = [
    { agent: 'APEX', action: 'Processing business data', time: new Date().toISOString() },
    { agent: 'PULSE', action: 'Creating SEO content', time: new Date(Date.now() - 60000).toISOString() },
    { agent: 'CIPHER', action: 'Scraping competitor data', time: new Date(Date.now() - 120000).toISOString() },
    { agent: 'NEXUS', action: 'Deploying updates', time: new Date(Date.now() - 180000).toISOString() },
    { agent: 'STAT', action: 'Analyzing metrics', time: new Date(Date.now() - 240000).toISOString() }
  ];
  
  res.status(200).json({ 
    activities: activities.sort(() => 0.5 - Math.random()).slice(0, 3),
    timestamp: Date.now()
  });
}
