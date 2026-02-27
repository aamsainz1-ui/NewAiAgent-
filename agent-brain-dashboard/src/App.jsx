import { useState, useEffect, useRef, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import './App.css';

// --- Data Definition ---
const gData = {
  nodes: [
    // === LAYER 0: SUPERVISOR & CORE ===
    { id: 'SUPERVISOR', group: 0, label: 'SUPERVISOR', desc: 'Master Orchestrator - Controls all agents', val: 60 },
    { id: 'MEMORY', group: 0, label: 'Vector Memory', desc: 'RAG System - Long-term context storage', val: 35 },
    { id: 'GATEWAY', group: 0, label: 'API Gateway', desc: 'External communications hub', val: 35 },
    { id: 'IDENTITY', group: 0, label: 'PAPACLAW Identity', desc: 'AI Executive Assistant persona', val: 30 },

    // === LAYER 1: EXECUTIVE AGENTS (from AGENTS.md) ===
    { id: 'APEX', group: 1, label: 'APEX (CEO)', desc: 'Chief Executive - Strategy & big picture decisions', val: 40 },
    { id: 'PULSE', group: 1, label: 'PULSE (CMO)', desc: 'Chief Marketing - Growth, viral, trends', val: 40 },
    { id: 'STAT', group: 1, label: 'STAT (CFO)', desc: 'Chief Financial - Analytics, ROI, cashflow', val: 40 },
    { id: 'LEDGER', group: 1, label: 'LEDGER (COO)', desc: 'Chief Operations - Team orchestration', val: 40 },
    { id: 'AURA', group: 1, label: 'AURA (Design)', desc: 'Creative Director - UI/UX, visuals', val: 40 },
    { id: 'NEXUS', group: 1, label: 'NEXUS (CTO)', desc: 'Chief Technology - Code, architecture', val: 40 },
    { id: 'CIPHER', group: 1, label: 'CIPHER (Security)', desc: 'Chief Security - Audits, hardening', val: 40 },
    { id: 'SYNC', group: 1, label: 'SYNC (Brand)', desc: 'Brand Guardian - Voice & consistency', val: 40 },

    // === LAYER 2: AI MODELS (BRAINS) ===
    { id: 'claude-opus', group: 2, label: 'Claude 3 Opus', desc: 'Deep reasoning & strategy (CEO tasks)', val: 25 },
    { id: 'claude-sonnet', group: 2, label: 'Claude 3.5 Sonnet', desc: 'Coding & complex logic (CTO tasks)', val: 25 },
    { id: 'gemini-pro', group: 2, label: 'Gemini 3 Pro', desc: 'High context analysis (CFO tasks)', val: 25 },
    { id: 'gpt-4o', group: 2, label: 'GPT-4o', desc: 'Versatile execution (CMO tasks)', val: 25 },
    { id: 'gpt-4o-mini', group: 2, label: 'GPT-4o Mini', desc: 'Fast, cheap tasks', val: 20 },
    { id: 'o1-preview', group: 2, label: 'OpenAI o1', desc: 'Math & science reasoning', val: 25 },
    { id: 'o3-mini', group: 2, label: 'OpenAI o3-mini', desc: 'Quick reasoning tasks', val: 20 },
    { id: 'kimi-k2', group: 2, label: 'Kimi K2.5', desc: 'Long context & coding', val: 22 },
    { id: 'minimax-m2', group: 2, label: 'MiniMax M2.5', desc: 'Multilingual tasks', val: 22 },

    // === LAYER 3: KNOWLEDGE DOMAINS (from SOUL.md) ===
    { id: 'know-business', group: 3, label: 'Business Strategy', desc: 'Strategic planning & execution', val: 15 },
    { id: 'know-marketing', group: 3, label: 'Marketing & SEO', desc: 'Growth hacking & optimization', val: 15 },
    { id: 'know-finance', group: 3, label: 'Finance & ROI', desc: 'Cashflow & investment analysis', val: 15 },
    { id: 'know-tech', group: 3, label: 'Technology', desc: 'System architecture & code', val: 15 },
    { id: 'know-data', group: 3, label: 'Data Analytics', desc: 'Deep data analysis & insights', val: 15 },
    { id: 'know-hr', group: 3, label: 'HR & Team Mgmt', desc: 'KPI, OKR, team structures', val: 15 },
    { id: 'know-risk', group: 3, label: 'Risk Assessment', desc: 'Opportunity & threat evaluation', val: 15 },

    // === LAYER 4: SKILLS & TOOLS ===
    // Core Functions
    { id: 'skill-read', group: 4, label: 'File Read', desc: 'Read files & documents', val: 12 },
    { id: 'skill-write', group: 4, label: 'File Write', desc: 'Create & edit files', val: 12 },
    { id: 'skill-edit', group: 4, label: 'File Edit', desc: 'Surgical text replacement', val: 12 },
    { id: 'skill-exec', group: 4, label: 'Shell Exec', desc: 'Run bash commands', val: 12 },
    { id: 'skill-web-search', group: 4, label: 'Web Search', desc: 'Brave Search API', val: 12 },
    { id: 'skill-web-fetch', group: 4, label: 'Web Fetch', desc: 'Extract webpage content', val: 12 },
    { id: 'skill-browser', group: 4, label: 'Browser Ctrl', desc: 'Puppeteer automation', val: 12 },
    { id: 'skill-canvas', group: 4, label: 'Canvas', desc: 'UI rendering & snapshots', val: 12 },
    
    // Communication
    { id: 'skill-telegram', group: 4, label: 'Telegram API', desc: 'Messaging & notifications', val: 12 },
    { id: 'skill-discord', group: 4, label: 'Discord', desc: 'Server management', val: 12 },
    { id: 'skill-slack', group: 4, label: 'Slack', desc: 'Workspace integration', val: 12 },
    { id: 'skill-imessage', group: 4, label: 'iMessage', desc: 'Apple messaging', val: 12 },
    
    // Skills from /skills directory
    { id: 'skill-clawhub', group: 4, label: 'ClawHub', desc: 'Skill marketplace', val: 12 },
    { id: 'skill-healthcheck', group: 4, label: 'Healthcheck', desc: 'System security audit', val: 12 },
    { id: 'skill-gemini', group: 4, label: 'Gemini CLI', desc: 'One-shot Q&A', val: 12 },
    { id: 'skill-creator', group: 4, label: 'Skill Creator', desc: 'Build new skills', val: 12 },
    { id: 'skill-tmux', group: 4, label: 'Tmux Control', desc: 'Terminal sessions', val: 12 },
    { id: 'skill-weather', group: 4, label: 'Weather', desc: 'Forecast data', val: 12 },
    { id: 'skill-github', group: 4, label: 'GitHub', desc: 'Repo management', val: 12 },
    { id: 'skill-cron', group: 4, label: 'Cron Jobs', desc: 'Scheduled tasks', val: 12 },
    { id: 'skill-memory-search', group: 4, label: 'Memory Search', desc: 'Semantic recall', val: 12 },
    { id: 'skill-subagents', group: 4, label: 'Sub-Agents', desc: 'Spawn isolated sessions', val: 12 },
    { id: 'skill-tts', group: 4, label: 'TTS', desc: 'Text-to-speech', val: 12 },
    { id: 'skill-canvas-render', group: 4, label: 'Canvas Render', desc: 'Visual output', val: 12 },
    { id: 'skill-spotify', group: 4, label: 'Spotify', desc: 'Music control', val: 12 },
    { id: 'skill-notion', group: 4, label: 'Notion', desc: 'Notes & docs', val: 12 },
    { id: 'skill-obsidian', group: 4, label: 'Obsidian', desc: 'Knowledge base', val: 12 },
    
    // Marketing Skills
    { id: 'skill-tiktok-ads', group: 4, label: 'TikTok Ads', desc: 'Ad campaign API', val: 12 },
    { id: 'skill-meta-ads', group: 4, label: 'Meta Ads', desc: 'FB/IG campaigns', val: 12 },
    { id: 'skill-twitter', group: 4, label: 'Twitter/X API', desc: 'Social automation', val: 12 },
    { id: 'skill-viral', group: 4, label: 'Viral Analysis', desc: 'Trend detection', val: 12 },
    
    // Memory Files
    { id: 'mem-core', group: 4, label: 'MEMORY.md', desc: 'Long-term curated memory', val: 15 },
    { id: 'mem-soul', group: 4, label: 'SOUL.md', desc: 'Agent identity & vibe', val: 15 },
    { id: 'mem-user', group: 4, label: 'USER.md', desc: 'Nathan preferences', val: 15 },
    { id: 'mem-agents', group: 4, label: 'AGENTS.md', desc: 'Executive team docs', val: 15 },
    { id: 'mem-tools', group: 4, label: 'TOOLS.md', desc: 'Tool configurations', val: 15 },
    { id: 'mem-daily', group: 4, label: 'Daily Logs', desc: 'YYYY-MM-DD history', val: 15 },
    
    // Analytics
    { id: 'skill-ga4', group: 4, label: 'Google Analytics', desc: 'Traffic analysis', val: 12 },
    { id: 'skill-sheets', group: 4, label: 'Google Sheets', desc: 'Spreadsheet ops', val: 12 },
    { id: 'skill-stripe', group: 4, label: 'Stripe API', desc: 'Payment processing', val: 12 },
    
    // AI/ML Tools
    { id: 'skill-openai-img', group: 4, label: 'OpenAI Image', desc: 'DALL-E generation', val: 12 },
    { id: 'skill-whisper', group: 4, label: 'Whisper', desc: 'Speech-to-text', val: 12 },
    { id: 'skill-fal', group: 4, label: 'FAL.ai', desc: 'Flux/SDXL images', val: 12 },
  ],
  links: [
    // Supervisor Core
    { source: 'SUPERVISOR', target: 'IDENTITY' },
    { source: 'SUPERVISOR', target: 'MEMORY' },
    { source: 'SUPERVISOR', target: 'GATEWAY' },
    { source: 'SUPERVISOR', target: 'APEX' },
    { source: 'SUPERVISOR', target: 'NEXUS' },
    { source: 'SUPERVISOR', target: 'CIPHER' },
    
    // CEO hierarchy
    { source: 'APEX', target: 'PULSE' },
    { source: 'APEX', target: 'STAT' },
    { source: 'APEX', target: 'LEDGER' },
    { source: 'APEX', target: 'AURA' },
    { source: 'APEX', target: 'SYNC' },
    
    // Model assignments
    { source: 'APEX', target: 'claude-opus' },
    { source: 'NEXUS', target: 'claude-sonnet' },
    { source: 'STAT', target: 'gemini-pro' },
    { source: 'PULSE', target: 'gpt-4o' },
    { source: 'CIPHER', target: 'o1-preview' },
    { source: 'LEDGER', target: 'kimi-k2' },
    { source: 'AURA', target: 'minimax-m2' },
    
    // Knowledge domains
    { source: 'APEX', target: 'know-business' },
    { source: 'APEX', target: 'know-risk' },
    { source: 'PULSE', target: 'know-marketing' },
    { source: 'STAT', target: 'know-finance' },
    { source: 'STAT', target: 'know-data' },
    { source: 'NEXUS', target: 'know-tech' },
    { source: 'LEDGER', target: 'know-hr' },
    
    // Core functions
    { source: 'SUPERVISOR', target: 'skill-read' },
    { source: 'SUPERVISOR', target: 'skill-write' },
    { source: 'SUPERVISOR', target: 'skill-edit' },
    { source: 'SUPERVISOR', target: 'skill-exec' },
    { source: 'SUPERVISOR', target: 'skill-web-search' },
    { source: 'SUPERVISOR', target: 'skill-web-fetch' },
    { source: 'SUPERVISOR', target: 'skill-memory-search' },
    { source: 'GATEWAY', target: 'skill-telegram' },
    { source: 'GATEWAY', target: 'skill-discord' },
    { source: 'GATEWAY', target: 'skill-slack' },
    
    // Agent skills
    { source: 'NEXUS', target: 'skill-clawhub' },
    { source: 'NEXUS', target: 'skill-creator' },
    { source: 'NEXUS', target: 'skill-tmux' },
    { source: 'CIPHER', target: 'skill-healthcheck' },
    { source: 'PULSE', target: 'skill-tiktok-ads' },
    { source: 'PULSE', target: 'skill-meta-ads' },
    { source: 'PULSE', target: 'skill-twitter' },
    { source: 'PULSE', target: 'skill-viral' },
    { source: 'STAT', target: 'skill-ga4' },
    { source: 'STAT', target: 'skill-sheets' },
    { source: 'STAT', target: 'skill-stripe' },
    { source: 'AURA', target: 'skill-openai-img' },
    { source: 'AURA', target: 'skill-fal' },
    { source: 'LEDGER', target: 'skill-cron' },
    { source: 'NEXUS', target: 'skill-github' },
    { source: 'NEXUS', target: 'skill-browser' },
    { source: 'NEXUS', target: 'skill-canvas' },
    { source: 'SYNC', target: 'skill-tts' },
    
    // Memory links
    { source: 'MEMORY', target: 'mem-core' },
    { source: 'MEMORY', target: 'mem-soul' },
    { source: 'MEMORY', target: 'mem-user' },
    { source: 'MEMORY', target: 'mem-agents' },
    { source: 'MEMORY', target: 'mem-tools' },
    { source: 'MEMORY', target: 'mem-daily' },
  ]
};

const colors = {
  0: '#ffffff', // Core
  1: '#ff0055', // Agents
  2: '#00ccff', // Models
  3: '#aa66ff', // Knowledge
  4: '#66ffaa'  // Skills
};

// Helper: Convert Hex to RGBA
const hexToRgba = (hex, alpha) => {
  let r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function App() {
  const fgRef = useRef();
  
  // States for Advanced Controls
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [isRotating, setIsRotating] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [showLinks, setShowLinks] = useState(true);
  const [nodeSize, setNodeSize] = useState(0.8);
  const [linkWidth, setLinkWidth] = useState(0.5);
  const [linkOpacity, setLinkOpacity] = useState(0.15);
  const [linkColor, setLinkColor] = useState('#4a80ff'); // More subtle default
  const [particleSpeed, setParticleSpeed] = useState(0.005);
  const [particleDensity, setParticleDensity] = useState(0);
  const [isSphereMode, setIsSphereMode] = useState(true); // Added Sphere Mode toggle
  const [breathingEffect, setBreathingEffect] = useState(0.05); // Added Breathing Effect
  const [showLightning, setShowLightning] = useState(true); // Added Lightning Effect

  const [hoverNode, setHoverNode] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(window.innerWidth > 768);

  // Resize handler
  useEffect(() => {
    const handleResize = () => setIsPanelOpen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Breathing effect reference
  const timeRef = useRef(0);

  // Auto-rotation & Breathing logic
  useEffect(() => {
    if (!fgRef.current) return;
    let frameId;
    let angle = 0;
    
    const animate = () => {
      timeRef.current += 0.016; // Approx 60fps
      
      // Breathing effect calculation
      const breathingScale = 1 + Math.sin(timeRef.current * 2) * breathingEffect;

      if (isRotating) {
        angle += (0.003 * rotationSpeed);
        // Base distance, modified by breathing if sphere mode is on
        const baseDistance = isSphereMode ? 350 : 250;
        const currentDistance = baseDistance * breathingScale;

        fgRef.current.cameraPosition({
          x: currentDistance * Math.sin(angle),
          z: currentDistance * Math.cos(angle)
        });
      }
      frameId = requestAnimationFrame(animate);
    };
    if (isRotating || breathingEffect > 0) animate();
    return () => cancelAnimationFrame(frameId);
  }, [isRotating, rotationSpeed, isSphereMode, breathingEffect]);

  const handleNodeClick = useCallback(node => {
    const distance = 120;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
    if (fgRef.current) {
      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        2000
      );
      setIsRotating(false); 
    }
  }, [fgRef]);

  return (
    <div className="app-container">
      <ForceGraph3D
        ref={fgRef}
        graphData={gData}
        
        // Node config
        nodeRelSize={4 * nodeSize}
        nodeColor={node => colors[node.group]}
        nodeVal={node => node.val * nodeSize}
        nodeResolution={16}
        
        // Custom Node Label rendering (always visible if enabled)
        nodeThreeObjectExtend={true}
        nodeThreeObject={node => {
          if (!showLabels) return null;
          const sprite = new SpriteText(node.label);
          sprite.color = 'rgba(255, 255, 255, 0.9)';
          sprite.textHeight = 3 * nodeSize;
          sprite.position.y = 10 * nodeSize; // Position above node
          sprite.backgroundColor = 'rgba(0, 0, 0, 0.4)';
          sprite.padding = 1;
          sprite.borderRadius = 2;
          return sprite;
        }}

        // Link config
        linkVisibility={showLinks}
        linkWidth={linkWidth}
        linkColor={() => hexToRgba(linkColor, linkOpacity)}
        linkDirectionalParticles={particleDensity}
        linkDirectionalParticleSpeed={particleSpeed}
        linkDirectionalParticleWidth={1.5 * linkWidth}
        
        // Interaction
        onNodeClick={handleNodeClick}
        onNodeHover={setHoverNode}
        backgroundColor="#050505"
      />

      {/* --- HUD OVERLAY --- */}
      <div className="hud-overlay">
        
        {/* Top Bar */}
        <div className="hud-header">
          <div className="hud-title">OpenClaw<span>//OS</span></div>
          <div className="hud-status">ONLINE • {gData.nodes.length} MODULES</div>
        </div>

        {/* Toggle Panel Button (Mobile) */}
        <button className="panel-toggle-btn" onClick={() => setIsPanelOpen(!isPanelOpen)}>
          {isPanelOpen ? '✖ CLOSE CONTROLS' : '⚙ CONTROLS'}
        </button>

        {/* Advanced Controls (Right Panel) */}
        {isPanelOpen && (
          <div className="hud-controls-advanced">
            <h3>Controls</h3>
            
            <div className="control-section">
              <label>
                <input type="checkbox" checked={isSphereMode} onChange={e => setIsSphereMode(e.target.checked)} />
                Sphere Mode
              </label>
            </div>

            <div className="control-section">
              <span className="slider-label">Distance: {Math.floor(isSphereMode ? 8 : 4)}</span>
              <input type="range" min="2" max="15" step="1" value={isSphereMode ? 8 : 4} disabled />
            </div>

            <div className="control-section">
              <span className="slider-label">Node Size: {nodeSize.toFixed(2)}</span>
              <input type="range" min="0.01" max="0.5" step="0.01" value={nodeSize} onChange={e => setNodeSize(parseFloat(e.target.value))} />
            </div>

            <div className="control-section">
              <span className="slider-label">Rotation: {rotationSpeed.toFixed(3)}</span>
              <input type="range" min="0" max="0.1" step="0.001" value={rotationSpeed} onChange={e => setRotationSpeed(parseFloat(e.target.value))} />
            </div>

            <div className="control-section">
              <span className="slider-label">Breathing: {breathingEffect.toFixed(2)}</span>
              <input type="range" min="0" max="0.2" step="0.01" value={breathingEffect} onChange={e => setBreathingEffect(parseFloat(e.target.value))} />
            </div>

            <h4 style={{fontSize: '0.7rem', color: '#666', marginTop: 15, marginBottom: 5, letterSpacing: 2}}>LINKS</h4>

            <div className="control-section">
              <label>
                <input type="checkbox" checked={showLinks} onChange={e => setShowLinks(e.target.checked)} />
                Show All Links
              </label>
            </div>

            <div className="control-section">
              <span className="slider-label">Opacity: {linkOpacity.toFixed(2)}</span>
              <input type="range" min="0" max="1" step="0.01" value={linkOpacity} onChange={e => setLinkOpacity(parseFloat(e.target.value))} />
            </div>

            <h4 style={{fontSize: '0.7rem', color: '#666', marginTop: 15, marginBottom: 5, letterSpacing: 2}}>EFFECTS</h4>

            <div className="control-section">
              <label>
                <input type="checkbox" checked={showLightning} onChange={e => setShowLightning(e.target.checked)} />
                ⚡ Lightning
              </label>
            </div>
            
            <div className="control-section">
              <label>
                <input type="checkbox" checked={showLabels} onChange={e => setShowLabels(e.target.checked)} />
                Show Labels
              </label>
            </div>

          </div>
        )}

        {/* Node Detail (Bottom Left) */}
        {(hoverNode && hoverNode.group === 2) && (
          <div className="hud-detail-panel">
            <div className="detail-header" style={{ color: colors[hoverNode.group] }}>
              AI MODEL
            </div>
            <h1>{hoverNode.label}</h1>
            <p>{hoverNode.desc}</p>
            
            <div className="detail-stat-grid">
              <div className="stat-box">
                <span className="label">TOKENS</span>
                <span className="val">{Math.floor(Math.random() * 500000 + 50000).toLocaleString()}</span>
              </div>
              <div className="stat-box">
                <span className="label">COST</span>
                <span className="val">${(Math.random() * 50 + 5).toFixed(2)}</span>
              </div>
              <div className="stat-box">
                <span className="label">CALLS</span>
                <span className="val">{Math.floor(Math.random() * 1000 + 100)}</span>
              </div>
              <div className="stat-box">
                <span className="label">AVG TIME</span>
                <span className="val">{(Math.random() * 3 + 0.5).toFixed(1)}s</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}