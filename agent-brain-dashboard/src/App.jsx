import { useState, useEffect, useRef, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import './App.css';

const gData = {
  nodes: [
    { id: 'SUPERVISOR', group: 0, label: 'SUPERVISOR', desc: 'Master Orchestrator - Controls all agents', val: 60 },
    { id: 'MEMORY', group: 0, label: 'Vector Memory', desc: 'RAG System - Long-term context storage', val: 35 },
    { id: 'GATEWAY', group: 0, label: 'API Gateway', desc: 'External communications hub', val: 35 },
    { id: 'IDENTITY', group: 0, label: 'PAPACLAW Identity', desc: 'AI Executive Assistant persona', val: 30 },
    { id: 'APEX', group: 1, label: 'APEX (CEO)', desc: 'Chief Executive - Strategy & big picture decisions', val: 40 },
    { id: 'PULSE', group: 1, label: 'PULSE (CMO)', desc: 'Chief Marketing - Growth, viral, trends', val: 40 },
    { id: 'STAT', group: 1, label: 'STAT (CAO)', desc: 'Chief Analyst - Football & Analytics', val: 40 },
    { id: 'LEDGER', group: 1, label: 'LEDGER (CFO)', desc: 'Chief Financial - ROI & cashflow', val: 40 },
    { id: 'AURA', group: 1, label: 'AURA (CSO)', desc: 'Chief Customer Success - Retention & LTV', val: 40 },
    { id: 'NEXUS', group: 1, label: 'NEXUS (COO)', desc: 'Chief Operations - Automation & Scraping', val: 40 },
    { id: 'CIPHER', group: 1, label: 'CIPHER (CIO)', desc: 'Chief Intelligence - Competitor spy', val: 40 },
    { id: 'SYNC', group: 1, label: 'SYNC (CHRO)', desc: 'Chief HR - Team & KPI management', val: 40 },
    { id: 'claude-opus', group: 2, label: 'Claude 3 Opus', desc: 'Deep reasoning & strategy', val: 25 },
    { id: 'claude-sonnet', group: 2, label: 'Claude 3.5 Sonnet', desc: 'Coding & complex logic', val: 25 },
    { id: 'gemini-pro', group: 2, label: 'Gemini 3 Pro', desc: 'High context analysis', val: 25 },
    { id: 'gpt-4o', group: 2, label: 'GPT-4o', desc: 'Versatile execution', val: 25 },
    { id: 'gpt-4o-mini', group: 2, label: 'GPT-4o Mini', desc: 'Fast, cheap tasks', val: 20 },
    { id: 'o1-preview', group: 2, label: 'OpenAI o1', desc: 'Math & science reasoning', val: 25 },
    { id: 'o3-mini', group: 2, label: 'OpenAI o3-mini', desc: 'Quick reasoning', val: 20 },
    { id: 'kimi-k2', group: 2, label: 'Kimi K2.5', desc: 'Long context & coding', val: 22 },
    { id: 'minimax-m2', group: 2, label: 'MiniMax M2.5', desc: 'Multilingual tasks', val: 22 },
    { id: 'zai-glm4', group: 2, label: 'Zai GLM-4.7', desc: 'Chinese language tasks', val: 22 },
    { id: 'know-business', group: 3, label: 'Business Strategy', desc: 'Strategic planning & execution', val: 15 },
    { id: 'know-marketing', group: 3, label: 'Marketing & SEO', desc: 'Growth hacking & optimization', val: 15 },
    { id: 'know-finance', group: 3, label: 'Finance & ROI', desc: 'Cashflow & investment analysis', val: 15 },
    { id: 'know-tech', group: 3, label: 'Technology', desc: 'System architecture & code', val: 15 },
    { id: 'know-data', group: 3, label: 'Data Analytics', desc: 'Deep data analysis', val: 15 },
    { id: 'know-hr', group: 3, label: 'HR & Team Mgmt', desc: 'KPI, OKR, team structures', val: 15 },
    { id: 'know-risk', group: 3, label: 'Risk Assessment', desc: 'Opportunity & threat evaluation', val: 15 },
    { id: 'skill-read', group: 4, label: 'File Read', desc: 'Read files & documents', val: 12 },
    { id: 'skill-write', group: 4, label: 'File Write', desc: 'Create & edit files', val: 12 },
    { id: 'skill-edit', group: 4, label: 'File Edit', desc: 'Surgical text replacement', val: 12 },
    { id: 'skill-exec', group: 4, label: 'Shell Exec', desc: 'Run bash commands', val: 12 },
    { id: 'skill-web-search', group: 4, label: 'Web Search', desc: 'Brave Search API', val: 12 },
    { id: 'skill-web-fetch', group: 4, label: 'Web Fetch', desc: 'Extract webpage content', val: 12 },
    { id: 'skill-browser', group: 4, label: 'Browser Ctrl', desc: 'Puppeteer automation', val: 12 },
    { id: 'skill-canvas', group: 4, label: 'Canvas', desc: 'UI rendering & snapshots', val: 12 },
    { id: 'skill-telegram', group: 4, label: 'Telegram API', desc: 'Messaging & notifications', val: 12 },
    { id: 'skill-discord', group: 4, label: 'Discord', desc: 'Server management', val: 12 },
    { id: 'skill-slack', group: 4, label: 'Slack', desc: 'Workspace integration', val: 12 },
    { id: 'skill-imessage', group: 4, label: 'iMessage', desc: 'Apple messaging', val: 12 },
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
    { id: 'skill-tiktok-ads', group: 4, label: 'TikTok Ads', desc: 'Ad campaign API', val: 12 },
    { id: 'skill-meta-ads', group: 4, label: 'Meta Ads', desc: 'FB/IG campaigns', val: 12 },
    { id: 'skill-twitter', group: 4, label: 'Twitter/X API', desc: 'Social automation', val: 12 },
    { id: 'skill-viral', group: 4, label: 'Viral Analysis', desc: 'Trend detection', val: 12 },
    { id: 'skill-football', group: 4, label: 'Football Analyst', desc: 'Thai football analysis', val: 12 },
    { id: 'skill-ga4', group: 4, label: 'Google Analytics', desc: 'Traffic analysis', val: 12 },
    { id: 'skill-sheets', group: 4, label: 'Google Sheets', desc: 'Spreadsheet ops', val: 12 },
    { id: 'skill-stripe', group: 4, label: 'Stripe API', desc: 'Payment processing', val: 12 },
    { id: 'skill-openai-img', group: 4, label: 'OpenAI Image', desc: 'DALL-E generation', val: 12 },
    { id: 'skill-whisper', group: 4, label: 'Whisper', desc: 'Speech-to-text', val: 12 },
    { id: 'skill-fal', group: 4, label: 'FAL.ai', desc: 'Flux/SDXL images', val: 12 },
    { id: 'skill-deep-research', group: 4, label: 'Deep Research', desc: 'In-depth analysis', val: 12 },
    { id: 'skill-market-research', group: 4, label: 'Market Research', desc: 'Competitor analysis', val: 12 },
    { id: 'skill-parallel-research', group: 4, label: 'Parallel Research', desc: 'Concurrent data gathering', val: 12 },
    { id: 'skill-elite-memory', group: 4, label: 'Elite Memory', desc: 'Advanced context retention', val: 12 },
    { id: 'mem-core', group: 4, label: 'MEMORY.md', desc: 'Long-term curated memory', val: 15 },
    { id: 'mem-soul', group: 4, label: 'SOUL.md', desc: 'Agent identity & vibe', val: 15 },
    { id: 'mem-user', group: 4, label: 'USER.md', desc: 'Nathan preferences', val: 15 },
    { id: 'mem-agents', group: 4, label: 'AGENTS.md', desc: 'Executive team docs', val: 15 },
    { id: 'mem-tools', group: 4, label: 'TOOLS.md', desc: 'Tool configurations', val: 15 },
    { id: 'mem-daily', group: 4, label: 'Daily Logs', desc: 'YYYY-MM-DD history', val: 15 },
    { id: 'zoho-crm', group: 4, label: 'Zoho CRM', desc: 'Customer relationship', val: 12 },
    { id: 'hubspot', group: 4, label: 'HubSpot', desc: 'Marketing automation', val: 12 },
    { id: 'activecampaign', group: 4, label: 'ActiveCampaign', desc: 'Email automation', val: 12 },
    { id: 'todoist', group: 4, label: 'Todoist', desc: 'Task management', val: 12 },
    { id: 'gcal', group: 4, label: 'Google Calendar', desc: 'Schedule management', val: 12 },
    { id: 'football-api', group: 4, label: 'Football Data API', desc: 'Live scores & fixtures', val: 12 },
  ],
  links: [
    { source: 'SUPERVISOR', target: 'IDENTITY' },
    { source: 'SUPERVISOR', target: 'MEMORY' },
    { source: 'SUPERVISOR', target: 'GATEWAY' },
    { source: 'SUPERVISOR', target: 'APEX' },
    { source: 'SUPERVISOR', target: 'NEXUS' },
    { source: 'SUPERVISOR', target: 'CIPHER' },
    { source: 'APEX', target: 'PULSE' },
    { source: 'APEX', target: 'STAT' },
    { source: 'APEX', target: 'LEDGER' },
    { source: 'APEX', target: 'AURA' },
    { source: 'APEX', target: 'SYNC' },
    { source: 'APEX', target: 'claude-opus' },
    { source: 'NEXUS', target: 'claude-sonnet' },
    { source: 'STAT', target: 'gemini-pro' },
    { source: 'PULSE', target: 'gpt-4o' },
    { source: 'CIPHER', target: 'o1-preview' },
    { source: 'LEDGER', target: 'kimi-k2' },
    { source: 'AURA', target: 'minimax-m2' },
    { source: 'SUPERVISOR', target: 'zai-glm4' },
    { source: 'APEX', target: 'know-business' },
    { source: 'APEX', target: 'know-risk' },
    { source: 'PULSE', target: 'know-marketing' },
    { source: 'STAT', target: 'know-finance' },
    { source: 'STAT', target: 'know-data' },
    { source: 'NEXUS', target: 'know-tech' },
    { source: 'LEDGER', target: 'know-hr' },
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
    { source: 'GATEWAY', target: 'skill-imessage' },
    { source: 'NEXUS', target: 'skill-clawhub' },
    { source: 'NEXUS', target: 'skill-creator' },
    { source: 'NEXUS', target: 'skill-tmux' },
    { source: 'NEXUS', target: 'skill-github' },
    { source: 'NEXUS', target: 'skill-browser' },
    { source: 'NEXUS', target: 'skill-canvas' },
    { source: 'NEXUS', target: 'skill-cron' },
    { source: 'CIPHER', target: 'skill-healthcheck' },
    { source: 'PULSE', target: 'skill-tiktok-ads' },
    { source: 'PULSE', target: 'skill-meta-ads' },
    { source: 'PULSE', target: 'skill-twitter' },
    { source: 'PULSE', target: 'skill-viral' },
    { source: 'PULSE', target: 'skill-market-research' },
    { source: 'STAT', target: 'skill-ga4' },
    { source: 'STAT', target: 'skill-sheets' },
    { source: 'STAT', target: 'skill-stripe' },
    { source: 'STAT', target: 'skill-football' },
    { source: 'STAT', target: 'skill-parallel-research' },
    { source: 'AURA', target: 'skill-openai-img' },
    { source: 'AURA', target: 'skill-fal' },
    { source: 'AURA', target: 'zoho-crm' },
    { source: 'AURA', target: 'hubspot' },
    { source: 'AURA', target: 'activecampaign' },
    { source: 'SYNC', target: 'skill-tts' },
    { source: 'SYNC', target: 'todoist' },
    { source: 'SYNC', target: 'gcal' },
    { source: 'APEX', target: 'skill-deep-research' },
    { source: 'MEMORY', target: 'skill-elite-memory' },
    { source: 'MEMORY', target: 'mem-core' },
    { source: 'MEMORY', target: 'mem-soul' },
    { source: 'MEMORY', target: 'mem-user' },
    { source: 'MEMORY', target: 'mem-agents' },
    { source: 'MEMORY', target: 'mem-tools' },
    { source: 'MEMORY', target: 'mem-daily' },
    { source: 'STAT', target: 'football-api' },
  ]
};

const colors = {
  0: '#ffffff',
  1: '#ff0055',
  2: '#00ccff',
  3: '#aa66ff',
  4: '#66ffaa'
};

const ACTIVITIES = [
  "NEXUS: Running healthcheck...",
  "PULSE: Analyzing TikTok trends...",
  "MEMORY: Indexing daily logs...",
  "STAT: Polling Google Sheets...",
  "APEX: Generating report...",
  "CIPHER: Scraping competitor...",
  "SUPERVISOR: Re-allocating..."
];

export default function App() {
  const fgRef = useRef();
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [isRotating, setIsRotating] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [nodeSize, setNodeSize] = useState(1);
  const [linkOpacity, setLinkOpacity] = useState(0.2);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [currentActivity, setCurrentActivity] = useState(ACTIVITIES[0]);
  const [hoverNode, setHoverNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity(ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!fgRef.current) return;
    let angle = 0;
    const animate = () => {
      if (isRotating) {
        angle += 0.003 * rotationSpeed;
        fgRef.current.cameraPosition({
          x: 350 * Math.sin(angle),
          z: 350 * Math.cos(angle)
        });
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, [isRotating, rotationSpeed]);

  const handleNodeClick = useCallback(node => {
    setSelectedNode(node);
    const distRatio = 1 + 120/Math.hypot(node.x, node.y, node.z);
    if (fgRef.current) {
      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        2000
      );
      setIsRotating(false);
    }
  }, []);

  const graphData = activeFilter === 'ALL' ? gData : {
    nodes: gData.nodes.filter(n => n.group === activeFilter),
    links: gData.links.filter(l => {
      const s = typeof l.source === 'object' ? l.source.group : gData.nodes.find(n => n.id === l.source)?.group;
      const t = typeof l.target === 'object' ? l.target.group : gData.nodes.find(n => n.id === l.target)?.group;
      return s === activeFilter || t === activeFilter;
    })
  };

  const getQuotaPercent = (nodeId) => {
    if (nodeId === 'kimi-k2') return 85;
    if (nodeId === 'minimax-m2') return 5;
    if (nodeId === 'claude-sonnet') return 30;
    if (nodeId === 'gemini-pro') return 25;
    return Math.floor(Math.random() * 50 + 20);
  };

  const activeNode = hoverNode || selectedNode;

  return (
    <div className="app-container">
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeRelSize={4 * nodeSize}
        nodeColor={node => colors[node.group]}
        nodeVal={node => node.val * nodeSize}
        nodeResolution={16}
        nodeThreeObjectExtend={true}
        nodeThreeObject={node => {
          if (!showLabels) return null;
          const sprite = new SpriteText(node.label);
          sprite.color = 'rgba(255,255,255,0.9)';
          sprite.textHeight = 3 * nodeSize;
          sprite.position.y = 10 * nodeSize;
          return sprite;
        }}
        linkWidth={0.5}
        linkColor={() => `rgba(100,150,255,${linkOpacity})`}
        onNodeClick={handleNodeClick}
        onNodeHover={setHoverNode}
        backgroundColor="#050505"
      />

      {/* HUD */}
      <div className="hud-overlay">
        <div className="hud-header">
          <div className="hud-title">OpenClaw<span>//OS</span></div>
          <div className="hud-status">ONLINE • {graphData.nodes.length} MODULES</div>
        </div>

        {/* Compact Live Activity - Top Right */}
        <div style={{position:'absolute',top:'20px',right:'20px',background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',padding:'8px 12px',borderRadius:'20px',border:'1px solid rgba(0,255,100,0.4)',display:'flex',alignItems:'center',gap:'8px',color:'#fff',fontSize:'0.75rem',zIndex:100}}>
          <span style={{width:'8px',height:'8px',background:'#00ff66',borderRadius:'50%',animation:'pulse 2s infinite'}}></span>
          <span style={{color:'#0f0',fontWeight:'bold'}}>LIVE</span>
          <span style={{color:'#aaa',maxWidth:'150px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{currentActivity}</span>
        </div>

        <button className="panel-toggle-btn" onClick={() => setIsPanelOpen(!isPanelOpen)}>
          {isPanelOpen ? '✖ CLOSE' : '⚙ CONTROLS'}
        </button>

        {isPanelOpen && (
          <div className="hud-controls-advanced">
            <h3 style={{color:'#0f0',fontSize:'0.9rem',marginBottom:'10px'}}>CLUSTER FILTER</h3>
            <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'20px'}}>
              <button onClick={()=>setActiveFilter('ALL')} style={{background:activeFilter==='ALL'?'#333':'transparent',color:'#fff',border:'1px solid #555',padding:'5px 10px',borderRadius:'4px',fontSize:'0.75rem',cursor:'pointer'}}>ALL</button>
              <button onClick={()=>setActiveFilter(0)} style={{background:activeFilter===0?colors[0]:'transparent',color:activeFilter===0?'#000':colors[0],border:`1px solid ${colors[0]}`,padding:'5px 10px',borderRadius:'4px',fontSize:'0.75rem',cursor:'pointer'}}>CORE</button>
              <button onClick={()=>setActiveFilter(1)} style={{background:activeFilter===1?colors[1]:'transparent',color:activeFilter===1?'#000':colors[1],border:`1px solid ${colors[1]}`,padding:'5px 10px',borderRadius:'4px',fontSize:'0.75rem',cursor:'pointer'}}>AGENTS</button>
              <button onClick={()=>setActiveFilter(2)} style={{background:activeFilter===2?colors[2]:'transparent',color:activeFilter===2?'#000':colors[2],border:`1px solid ${colors[2]}`,padding:'5px 10px',borderRadius:'4px',fontSize:'0.75rem',cursor:'pointer'}}>MODELS</button>
              <button onClick={()=>setActiveFilter(3)} style={{background:activeFilter===3?colors[3]:'transparent',color:activeFilter===3?'#000':colors[3],border:`1px solid ${colors[3]}`,padding:'5px 10px',borderRadius:'4px',fontSize:'0.75rem',cursor:'pointer'}}>KNOWLEDGE</button>
              <button onClick={()=>setActiveFilter(4)} style={{background:activeFilter===4?colors[4]:'transparent',color:activeFilter===4?'#000':colors[4],border:`1px solid ${colors[4]}`,padding:'5px 10px',borderRadius:'4px',fontSize:'0.75rem',cursor:'pointer'}}>SKILLS</button>
            </div>

            <h4 style={{color:'#666',fontSize:'0.7rem',marginBottom:'8px'}}>CONTROLS</h4>
            <div style={{marginBottom:'10px'}}>
              <label style={{color:'#aaa',fontSize:'0.75rem'}}>Node Size: {nodeSize.toFixed(1)}</label>
              <input type="range" min="0.5" max="2" step="0.1" value={nodeSize} onChange={e=>setNodeSize(parseFloat(e.target.value))} style={{width:'100%'}}/>
            </div>
            <div style={{marginBottom:'10px'}}>
              <label style={{color:'#aaa',fontSize:'0.75rem'}}>Rotation: {rotationSpeed.toFixed(1)}</label>
              <input type="range" min="0" max="2" step="0.1" value={rotationSpeed} onChange={e=>setRotationSpeed(parseFloat(e.target.value))} style={{width:'100%'}}/>
            </div>
            <div style={{marginBottom:'10px'}}>
              <label style={{color:'#aaa',fontSize:'0.75rem'}}>Link Opacity: {linkOpacity.toFixed(1)}</label>
              <input type="range" min="0" max="1" step="0.1" value={linkOpacity} onChange={e=>setLinkOpacity(parseFloat(e.target.value))} style={{width:'100%'}}/>
            </div>
            <label style={{color:'#aaa',fontSize:'0.75rem',display:'flex',alignItems:'center',gap:'8px'}}>
              <input type="checkbox" checked={showLabels} onChange={e=>setShowLabels(e.target.checked)}/>Show Labels
            </label>
          </div>
        )}

        {/* Node Detail Panel */}
        {activeNode && (
          <div style={{position:'absolute',bottom:'20px',left:'20px',background:'rgba(10,10,15,0.9)',backdropFilter:'blur(10px)',padding:'20px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)',borderLeft:`3px solid ${colors[activeNode.group]}`,maxWidth:'300px',color:'#fff'}}>
            <div style={{color:colors[activeNode.group],fontSize:'0.7rem',letterSpacing:'2px',marginBottom:'5px'}}>
              {activeNode.group===0?'CORE SYSTEM':activeNode.group===1?'EXECUTIVE AGENT':activeNode.group===2?'AI MODEL':activeNode.group===3?'KNOWLEDGE DOMAIN':'SKILL/TOOL'}
            </div>
            <h2 style={{margin:'0 0 10px 0',fontSize:'1.3rem'}}>{activeNode.label}</h2>
            <p style={{color:'#aaa',fontSize:'0.9rem',marginBottom:'15px'}}>{activeNode.desc}</p>
            
            {activeNode.group===2 && (
              <>
                <div style={{fontSize:'0.65rem',color:'#888',marginBottom:'5px'}}>QUOTA STATUS</div>
                <div style={{width:'100%',height:'6px',background:'#222',borderRadius:'3px',overflow:'hidden',marginBottom:'15px'}}>
                  <div style={{height:'100%',width:`${getQuotaPercent(activeNode.id)}%`,background:getQuotaPercent(activeNode.id)>80?'#ef4444':getQuotaPercent(activeNode.id)>50?'#eab308':'#22c55e'}}/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',fontSize:'0.75rem'}}>
                  <div style={{background:'rgba(255,255,255,0.05)',padding:'8px',borderRadius:'4px'}}>
                    <div style={{color:'#888'}}>TOKENS</div>
                    <div>{Math.floor(Math.random()*500000+50000).toLocaleString()}</div>
                  </div>
                  <div style={{background:'rgba(255,255,255,0.05)',padding:'8px',borderRadius:'4px'}}>
                    <div style={{color:'#888'}}>COST</div>
                    <div>${(Math.random()*50+5).toFixed(2)}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
