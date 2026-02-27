import './App.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import './App.css';

// --- Data Definition ---
const gData = {
  nodes: [
    // --- LAYER 0: CORE SYSTEM ---
    { id: 'CORE', group: 0, label: 'OpenClaw OS', desc: 'Central Kernel & Orchestrator', val: 50 },
    { id: 'MEMORY', group: 0, label: 'Vector Memory', desc: 'Long-term Context (RAG)', val: 30 },
    { id: 'GATEWAY', group: 0, label: 'API Gateway', desc: 'External Comms Hub', val: 30 },

    // --- LAYER 1: AGENT EXECUTIVES ---
    { id: 'APEX', group: 1, label: 'APEX (CEO)', desc: 'Strategy & Decision', val: 30 },
    { id: 'PULSE', group: 1, label: 'PULSE (CMO)', desc: 'Growth & Trends', val: 30 },
    { id: 'STAT', group: 1, label: 'STAT (CFO)', desc: 'Finance & Analytics', val: 30 },
    { id: 'LEDGER', group: 1, label: 'LEDGER (COO)', desc: 'Ops & Workflow', val: 30 },
    { id: 'AURA', group: 1, label: 'AURA (Design)', desc: 'Creative Director', val: 30 },
    { id: 'NEXUS', group: 1, label: 'NEXUS (CTO)', desc: 'Engineering Lead', val: 30 },
    { id: 'CIPHER', group: 1, label: 'CIPHER (CISO)', desc: 'Security Lead', val: 30 },
    { id: 'SYNC', group: 1, label: 'SYNC (Brand)', desc: 'Voice & Identity', val: 30 },

    // --- LAYER 2: AI MODELS (BRAINS) ---
    { id: 'claude-3-5-sonnet', group: 2, label: 'Claude 3.5 Sonnet', desc: 'Coding & Reasoning', val: 20 },
    { id: 'claude-3-opus', group: 2, label: 'Claude 3 Opus', desc: 'Complex Strategy', val: 20 },
    { id: 'gemini-1-5-pro', group: 2, label: 'Gemini 1.5 Pro', desc: 'High Context Analysis', val: 20 },
    { id: 'gpt-4o', group: 2, label: 'GPT-4o', desc: 'General Purpose', val: 20 },
    { id: 'o1-preview', group: 2, label: 'OpenAI o1', desc: 'Deep Reasoning', val: 20 },
    { id: 'flux-schnell', group: 2, label: 'Flux Schnell', desc: 'Fast Image Gen', val: 20 },

    // --- LAYER 3: SKILLS & TOOLS ---
    // Social & Ads
    { id: 'tiktok-ads', group: 3, label: 'TikTok Ads API', desc: 'Campaign Mgmt', val: 10 },
    { id: 'meta-ads', group: 3, label: 'Meta Ads Manager', desc: 'FB/IG Campaigns', val: 10 },
    { id: 'twitter-api', group: 3, label: 'X/Twitter API', desc: 'Social Listening', val: 10 },
    { id: 'auto-poster', group: 3, label: 'Content Scheduler', desc: 'Multi-platform Post', val: 10 },
    
    // Dev & Ops
    { id: 'browser-auto', group: 3, label: 'Browser Automation', desc: 'Puppeteer/Playwright', val: 10 },
    { id: 'web-search', group: 3, label: 'Brave Search', desc: 'Real-time Info', val: 10 },
    { id: 'terminal', group: 3, label: 'Terminal Exec', desc: 'Shell Commands', val: 10 },
    { id: 'file-sys', group: 3, label: 'File System', desc: 'Read/Write Access', val: 10 },
    { id: 'git-ops', group: 3, label: 'Git Ops', desc: 'Version Control', val: 10 },
    
    // Data & Finance
    { id: 'stripe-api', group: 3, label: 'Stripe', desc: 'Payments', val: 10 },
    { id: 'ga4', group: 3, label: 'Google Analytics', desc: 'Traffic Data', val: 10 },
    { id: 'sheets', group: 3, label: 'Google Sheets', desc: 'Report Gen', val: 10 },
  ],
  links: [
    // Core Links
    { source: 'CORE', target: 'MEMORY' },
    { source: 'CORE', target: 'GATEWAY' },
    { source: 'CORE', target: 'APEX' },
    { source: 'CORE', target: 'NEXUS' },
    { source: 'CORE', target: 'CIPHER' },

    // Executive Hierarchy
    { source: 'APEX', target: 'PULSE' },
    { source: 'APEX', target: 'STAT' },
    { source: 'APEX', target: 'LEDGER' },
    { source: 'APEX', target: 'AURA' },
    { source: 'APEX', target: 'SYNC' },

    // Model Usage (Who uses what mostly)
    { source: 'NEXUS', target: 'claude-3-5-sonnet' },
    { source: 'APEX', target: 'claude-3-opus' },
    { source: 'PULSE', target: 'gpt-4o' },
    { source: 'STAT', target: 'gemini-1-5-pro' }, // For big data
    { source: 'AURA', target: 'flux-schnell' },

    // Skill Assignments
    { source: 'PULSE', target: 'tiktok-ads' },
    { source: 'PULSE', target: 'meta-ads' },
    { source: 'PULSE', target: 'auto-poster' },
    { source: 'PULSE', target: 'twitter-api' },
    
    { source: 'NEXUS', target: 'browser-auto' },
    { source: 'NEXUS', target: 'terminal' },
    { source: 'NEXUS', target: 'git-ops' },
    
    { source: 'STAT', target: 'stripe-api' },
    { source: 'STAT', target: 'ga4' },
    { source: 'STAT', target: 'sheets' },
    
    { source: 'CIPHER', target: 'file-sys' }, // Auditing
    { source: 'CORE', target: 'web-search' },
  ]
};

const colors = {
  0: '#ffffff', // Core - White
  1: '#ff0055', // Agents - Neon Red/Pink
  2: '#00ccff', // Models - Neon Cyan
  3: '#ccff00'  // Skills - Neon Lime
};

export default function App() {
  const fgRef = useRef();
  const [rotationSpeed, setRotationSpeed] = useState(0.5); // 0 to 2
  const [isRotating, setIsRotating] = useState(true);
  const [hoverNode, setHoverNode] = useState(null);
  
  // Auto-rotation logic
  useEffect(() => {
    if (!fgRef.current) return;
    
    let frameId;
    let angle = 0;
    
    const animate = () => {
      if (isRotating) {
        angle += (0.003 * rotationSpeed);
        const distance = 300;
        fgRef.current.cameraPosition({
          x: distance * Math.sin(angle),
          z: distance * Math.cos(angle)
        });
      }
      frameId = requestAnimationFrame(animate);
    };
    
    if (isRotating) animate();
    
    return () => cancelAnimationFrame(frameId);
  }, [isRotating, rotationSpeed]);

  const handleNodeClick = useCallback(node => {
    const distance = 120;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
    
    if (fgRef.current) {
      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        2000
      );
      // Pause rotation when focusing
      setIsRotating(false); 
    }
  }, [fgRef]);

  return (
    <div className="app-container">
      <ForceGraph3D
        ref={fgRef}
        graphData={gData}
        nodeLabel="label"
        nodeColor={node => colors[node.group]}
        nodeVal="val"
        nodeResolution={16}
        linkWidth={1}
        linkColor={() => 'rgba(100, 200, 255, 0.2)'}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        onNodeClick={handleNodeClick}
        onNodeHover={setHoverNode}
        backgroundColor="#050505"
      />

      {/* --- HUD OVERLAY --- */}
      <div className="hud-overlay">
        
        {/* Top Bar */}
        <div className="hud-header">
          <div className="hud-title">OpenClaw<span>//OS</span></div>
          <div className="hud-status">ONLINE • {gData.nodes.length} MODULES ACTIVE</div>
        </div>

        {/* Controls (Bottom Right) */}
        <div className="hud-controls">
          <div className="control-group">
            <label>ROTATION SPEED</label>
            <input 
              type="range" 
              min="0" 
              max="2" 
              step="0.1" 
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
            />
          </div>
          <button 
            className={`hud-btn ${isRotating ? 'active' : ''}`}
            onClick={() => setIsRotating(!isRotating)}
          >
            {isRotating ? '⏸ PAUSE' : '▶ PLAY'}
          </button>
        </div>

        {/* Node Detail (Bottom Left) */}
        {(hoverNode) && (
          <div className="hud-detail-panel">
            <div className="detail-header" style={{ color: colors[hoverNode.group] }}>
              {hoverNode.group === 0 ? 'CORE SYSTEM' : 
               hoverNode.group === 1 ? 'AGENT UNIT' : 
               hoverNode.group === 2 ? 'AI MODEL' : 'SKILL MODULE'}
            </div>
            <h1>{hoverNode.label}</h1>
            <p>{hoverNode.desc}</p>
            <div className="detail-stat-grid">
              <div className="stat-box">
                <span className="label">LOAD</span>
                <span className="val">{Math.floor(Math.random() * 30) + 10}%</span>
              </div>
              <div className="stat-box">
                <span className="label">MEMORY</span>
                <span className="val">{Math.floor(Math.random() * 500) + 120}MB</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}