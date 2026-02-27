import './App.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';

// --- Data Definition ---
const gData = {
  nodes: [
    // Core
    { id: 'CORE', group: 0, label: 'OpenClaw Framework', desc: 'Central orchestrator & Brain', stats: { cpu: '12%', ram: '4.2GB', uptime: '99.9%', tasks: '1.2M' }, val: 40 },
    
    // Agents (Executive)
    { id: 'APEX', group: 1, label: 'APEX (CEO)', desc: 'Strategic planning & Decision', stats: { cpu: '8%', ram: '1.5GB', uptime: '98%', tasks: '12K' }, val: 25 },
    { id: 'PULSE', group: 1, label: 'PULSE (CMO)', desc: 'Marketing & Trend Analysis', stats: { cpu: '15%', ram: '2.1GB', uptime: '97%', tasks: '45K' }, val: 25 },
    { id: 'STAT', group: 1, label: 'STAT (CFO)', desc: 'Financial & Data Analytics', stats: { cpu: '22%', ram: '3.5GB', uptime: '99%', tasks: '8.5K' }, val: 25 },
    { id: 'LEDGER', group: 1, label: 'LEDGER (COO)', desc: 'Operations & Workflow', stats: { cpu: '10%', ram: '1.2GB', uptime: '99%', tasks: '32K' }, val: 25 },
    { id: 'AURA', group: 1, label: 'AURA (Creative)', desc: 'Design & UX/UI Generation', stats: { cpu: '45%', ram: '8.0GB', uptime: '95%', tasks: '4.2K' }, val: 25 },
    { id: 'NEXUS', group: 1, label: 'NEXUS (CTO)', desc: 'Infrastructure & Code', stats: { cpu: '18%', ram: '4.2GB', uptime: '99.9%', tasks: '150K' }, val: 25 },
    { id: 'CIPHER', group: 1, label: 'CIPHER (Security)', desc: 'Security & Audit', stats: { cpu: '5%', ram: '0.8GB', uptime: '100%', tasks: '24/7' }, val: 25 },
    { id: 'SYNC', group: 1, label: 'SYNC (Brand)', desc: 'Brand Voice & Consistency', stats: { cpu: '3%', ram: '0.5GB', uptime: '98%', tasks: '1.5K' }, val: 25 },

    // Roles (Operational)
    { id: 'Marketing', group: 2, label: 'Marketing Dept', desc: 'Campaign Execution', stats: { active: 'High', pending: 12 }, val: 15 },
    { id: 'Finance', group: 2, label: 'Finance Dept', desc: 'Ledger & Accounts', stats: { active: 'Medium', pending: 3 }, val: 15 },
    { id: 'Tech', group: 2, label: 'DevOps & Eng', desc: 'System Maintenance', stats: { active: 'Low', pending: 0 }, val: 15 },
    { id: 'Ops', group: 2, label: 'Operations', desc: 'Task Routing', stats: { active: 'High', pending: 45 }, val: 15 },
    { id: 'Security', group: 2, label: 'SecOps', desc: 'Threat Monitoring', stats: { active: 'Monitor', threats: 0 }, val: 15 },

    // Skills (Tools/Integrations)
    { id: 'tiktok-ads', group: 3, label: 'TikTok Ads API', desc: 'Ad Campaign Manager', stats: { calls: '1.2K/day', latency: '120ms' }, val: 8 },
    { id: 'tiktok-viral', group: 3, label: 'TikTok Trend Gen', desc: 'Viral Content Algo', stats: { calls: '500/day', latency: '400ms' }, val: 8 },
    { id: 'meta-ads', group: 3, label: 'Meta Ads Manager', desc: 'FB/IG Ad Buying', stats: { calls: '800/day', latency: '150ms' }, val: 8 },
    { id: 'upload-post', group: 3, label: 'Auto Poster', desc: 'Multi-platform Publish', stats: { posted: 450, failed: 2 }, val: 8 },
    { id: 'fal-generate', group: 3, label: 'FAL Image Gen', desc: 'Flux/SDXL Generation', stats: { gen: 120, cost: '$4.20' }, val: 8 },
    
    { id: 'ga4', group: 3, label: 'Google Analytics 4', desc: 'Traffic Analysis', stats: { events: '50K', users: '12K' }, val: 8 },
    { id: 'stripe', group: 3, label: 'Stripe API', desc: 'Payment Gateway', stats: { tx: 150, vol: '$4.5K' }, val: 8 },
    { id: 'xlsx', group: 3, label: 'Excel Processor', desc: 'Data Import/Export', stats: { files: 12, rows: '45K' }, val: 8 },

    { id: 'team-orchestration', group: 3, label: 'Orchestrator', desc: 'Agent Messaging Bus', stats: { msgs: '15K', latency: '10ms' }, val: 8 },
    { id: 'team-manager', group: 3, label: 'Task Manager', desc: 'Delegation Logic', stats: { tasks: 45, queued: 2 }, val: 8 },

    { id: 'webapp-testing', group: 3, label: 'E2E Testing', desc: 'Playwright/Selenium', stats: { tests: 140, pass: '100%' }, val: 8 },
    { id: 'mcp-builder', group: 3, label: 'MCP Builder', desc: 'Context Injection', stats: { ctx: '12MB', tokens: '4M' }, val: 8 },
    { id: 'cipher-sec', group: 3, label: 'Vuln Scanner', desc: 'Auto-Audit', stats: { scans: 4, found: 0 }, val: 8 },
  ],
  links: [
    // Core to Agents
    { source: 'CORE', target: 'APEX' },
    { source: 'CORE', target: 'PULSE' },
    { source: 'CORE', target: 'STAT' },
    { source: 'CORE', target: 'LEDGER' },
    { source: 'CORE', target: 'AURA' },
    { source: 'CORE', target: 'NEXUS' },
    { source: 'CORE', target: 'CIPHER' },
    { source: 'CORE', target: 'SYNC' },

    // Agents to Roles
    { source: 'APEX', target: 'Marketing' },
    { source: 'APEX', target: 'Finance' },
    { source: 'APEX', target: 'Ops' },
    { source: 'PULSE', target: 'Marketing' },
    { source: 'STAT', target: 'Finance' },
    { source: 'LEDGER', target: 'Ops' },
    { source: 'NEXUS', target: 'Tech' },
    { source: 'AURA', target: 'Tech' },
    { source: 'AURA', target: 'Marketing' },
    { source: 'CIPHER', target: 'Security' },
    { source: 'SYNC', target: 'Marketing' },

    // Agents to Skills
    { source: 'PULSE', target: 'tiktok-ads' },
    { source: 'PULSE', target: 'tiktok-viral' },
    { source: 'PULSE', target: 'meta-ads' },
    { source: 'PULSE', target: 'upload-post' },
    { source: 'PULSE', target: 'fal-generate' },
    
    { source: 'STAT', target: 'ga4' },
    { source: 'STAT', target: 'stripe' },
    { source: 'STAT', target: 'xlsx' },

    { source: 'LEDGER', target: 'team-orchestration' },
    { source: 'LEDGER', target: 'team-manager' },

    { source: 'NEXUS', target: 'webapp-testing' },
    { source: 'AURA', target: 'mcp-builder' },
    { source: 'CIPHER', target: 'cipher-sec' },
  ]
};

// Formal / Corporate Color Palette
const colors = {
  0: '#E0E0E0', // Core - Silver/White
  1: '#2979FF', // Agents - Royal Blue
  2: '#00BFA5', // Roles - Teal
  3: '#7C4DFF'  // Skills - Deep Purple
};

const typeNames = {
  0: 'SYSTEM CORE',
  1: 'EXECUTIVE AGENT',
  2: 'OPERATIONAL ROLE',
  3: 'SKILL / MODULE'
};

export default function App() {
  const fgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(window.innerWidth > 768); // Default open on desktop, closed on mobile

  useEffect(() => {
    const handleResize = () => setIsPanelOpen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let angle = 0;
    let interval;
    if (isAutoRotating && fgRef.current) {
      interval = setInterval(() => {
        if (!selectedNode) {
          fgRef.current.cameraPosition({
            x: 250 * Math.sin(angle),
            z: 250 * Math.cos(angle)
          });
          angle += Math.PI / 600;
        }
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isAutoRotating, selectedNode]);

  const handleNodeClick = useCallback(node => {
    setSelectedNode(node);
    const distance = 100;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
    
    if (fgRef.current) {
      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        2000
      );
    }
  }, [fgRef]);

  const handleFitScreen = () => {
    if (fgRef.current) {
      fgRef.current.zoomToFit(1000);
      setSelectedNode(null);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0f0f11', overflow: 'hidden' }}>
      <ForceGraph3D
        ref={fgRef}
        graphData={gData}
        nodeLabel="label"
        nodeColor={node => colors[node.group]}
        nodeVal="val"
        linkWidth={1.5}
        linkColor={() => 'rgba(255,255,255,0.2)'}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={d => 0.005}
        onNodeClick={handleNodeClick}
        onBackgroundClick={() => setSelectedNode(null)}
        backgroundColor="#0f0f11"
      />

      <button 
        className="panel-toggle-btn"
        onClick={() => setIsPanelOpen(!isPanelOpen)}
      >
        {isPanelOpen ? '❌ Close Menu' : '☰ Open Menu'}
      </button>

      {isPanelOpen && (
        <div className="panel-top-right">
          <h2 style={{ marginTop: 0, borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 10 }}>
            OpenClaw Agents Graph
          </h2>
          
          <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: 15 }}>
            {gData.nodes.length} Nodes | {gData.links.length} Links
          </div>
          
          <div style={{ marginBottom: 20 }}>
            {Object.keys(colors).map(key => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, fontSize: '0.9rem' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: colors[key], marginRight: 10 }}></div>
                {typeNames[key]}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="floating-controls">
        <button 
          className="floating-btn"
          onClick={() => setIsAutoRotating(!isAutoRotating)}
        >
          {isAutoRotating ? '⏸ Stop Rotation' : '▶ Start Rotation'}
        </button>
        <button 
          className="floating-btn"
          onClick={handleFitScreen}
        >
          🎯 Fit to Screen
        </button>
      </div>

      {selectedNode && (
        <div className="panel-bottom-left">
          <div style={{ 
            display: 'inline-block', 
            padding: '3px 8px', 
            borderRadius: 4, 
            fontSize: '0.8rem', 
            fontWeight: 'bold', 
            marginBottom: 10,
            textTransform: 'uppercase',
            backgroundColor: colors[selectedNode.group],
            color: selectedNode.group === 0 || selectedNode.group === 2 ? '#000' : '#fff'
          }}>
            {typeNames[selectedNode.group]}
          </div>
          
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: 5 }}>{selectedNode.label}</div>
          <div style={{ fontSize: '0.95rem', color: '#ccc', marginBottom: 15 }}>{selectedNode.desc}</div>
          
          {selectedNode.stats && (
            <div style={{ 
              marginTop: 15, 
              paddingTop: 15, 
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10
            }}>
              {Object.entries(selectedNode.stats).map(([key, value]) => (
                <div key={key} style={{ background: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: 6 }}>
                  <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>{key}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#fff' }}>{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}