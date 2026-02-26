export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  
  res.status(200).json({
    current: 'claude-opus-4-6-thinking',
    provider: 'google-antigravity',
    tokens: { in: 1250000, out: 89000 },
    cache: '99%',
    fallback: 'kimi-k2p5',
    timestamp: Date.now()
  })
}
