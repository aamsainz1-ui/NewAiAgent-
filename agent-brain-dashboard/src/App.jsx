import './App.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';

// --- Data Definition ---
const gData = {
  nodes: [
    // Core
    { id: 'CORE', group: 0, label: 'OpenClaw Framework', desc: 'Central orchestrator for all AI Agents', val: 30 },
    
    // Agents
    { id: 'APEX', group: 1, label: 'APEX (CEO)', desc: 'Strategic planning, decision making, big picture', val: 20 },
    { id: 'PULSE', group: 1, label: 'PULSE (CMO)', desc: 'Marketing, content, social media, ads', val: 20 },
    { id: 'STAT', group: 1, label: 'STAT (CFO)', desc: 'Finance, analytics, data processing', val: 20 },
    { id: 'LEDGER', group: 1, label: 'LEDGER (COO)', desc: 'Operations, team orchestration, workflows', val: 20 },
    { id: 'AURA', group: 1, label: 'AURA (Designer)', desc: 'UI/UX, web design, creative', val: 20 },
    { id: 'NEXUS', group: 1, label: 'NEXUS (CTO)', desc: 'Code architecture, deployment, infrastructure', val: 20 },
    { id: 'CIPHER', group: 1, label: 'CIPHER (CISO)', desc: 'Security, audits, hardening', val: 20 },
    { id: 'SYNC', group: 1, label: 'SYNC (Brand)', desc: 'Brand guidelines, consistency, tone', val: 20 },

    // Roles
    { id: 'Marketing', group: 2, label: 'Marketing', desc: 'Campaigns, virality, audience reach', val: 10 },
    { id: 'Finance', group: 2, label: 'Finance', desc: 'Accounting, revenue tracking', val: 10 },
    { id: 'Tech', group: 2, label: 'Technology', desc: 'Code, databases, servers', val: 10 },
    { id: 'Ops', group: 2, label: 'Operations', desc: 'Day-to-day tasks, automation', val: 10 },
    { id: 'Security', group: 2, label: 'Security', desc: 'Risk management, firewalls', val: 10 },

    // Skills (Tools)
    { id: 'tiktok-ads', group: 3, label: 'TikTok Ads API', desc: 'Manage and create TikTok ad campaigns', val: 5 },
    { id: 'tiktok-viral', group: 3, label: 'TikTok Viral', desc: 'Algorithm analysis for virality', val: 5 },
    { id: 'meta-ads', group: 3, label: 'Meta Ads Manager', desc: 'FB/IG Ads automation', val: 5 },
    { id: 'upload-post', group: 3, label: 'Auto Poster', desc: 'Cross-platform social media poster', val: 5 },
    { id: 'fal-generate', group: 3, label: 'FAL Image Gen', desc: 'AI Image generation', val: 5 },
    
    { id: 'ga4', group: 3, label: 'Google Analytics 4', desc: 'Web traffic analysis', val: 5 },
    { id: 'stripe', group: 3, label: 'Stripe API', desc: 'Payment processing', val: 5 },
    { id: 'xlsx', group: 3, label: 'Excel/XLSX', desc: 'Spreadsheet manipulation', val: 5 },

    { id: 'team-orchestration', group: 3, label: 'Team Orchestration', desc: 'Agent-to-agent communication', val: 5 },
    { id: 'team-manager', group: 3, label: 'Team Manager', desc: 'Task delegation', val: 5 },

    { id: 'webapp-testing', group: 3, label: 'Web Testing', desc: 'Automated E2E testing', val: 5 },
    { id: 'mcp-builder', group: 3, label: 'MCP Builder', desc: 'Context provider building', val: 5 },
    { id: 'cipher-sec', group: 3, label: 'Security Audit', desc: 'Vulnerability scanning', val: 5 },
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

const colors = {
  0: '#ffffff',
  1: '#ff5555',
  2: '#55ff55',
  3: '#5555ff'
};

const typeNames = {
  0: 'SYSTEM',
  1: 'AI AGENT',
  2: 'ROLE',
  3: 'SKILL / TOOL'
};

export default function App() {
  const fgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button 
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            style={{ background: '#4a4a6a', color: 'white', border: 'none', padding: '8px 15px', borderRadius: 6, cursor: 'pointer' }}
          >
            {isAutoRotating ? 'Stop Auto-Rotate' : 'Start Auto-Rotate'}
          </button>
          <button 
            onClick={handleFitScreen}
            style={{ background: '#4a4a6a', color: 'white', border: 'none', padding: '8px 15px', borderRadius: 6, cursor: 'pointer' }}
          >
            Fit to Screen
          </button>
        </div>
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
          <div style={{ fontSize: '0.95rem', color: '#ccc' }}>{selectedNode.desc}</div>
        </div>
      )}
    </div>
  );
}