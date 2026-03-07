import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';

const SAFE_TOP = 'env(safe-area-inset-top, 0px)';
const SAFE_RIGHT = 'env(safe-area-inset-right, 0px)';
const SAFE_BOTTOM = 'env(safe-area-inset-bottom, 0px)';
const SAFE_LEFT = 'env(safe-area-inset-left, 0px)';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

const MC_API = 'http://76.13.190.65:4000';
const LIVE_API = window.location.hostname === 'localhost' ? 'http://76.13.190.65:4001' : '';

// Status → color mapping for Mission Control agents
const STATUS_COLORS = {
  active: '#00ff88',
  working: '#ffcc00',
  standby: '#8899aa',
  idle: '#556677',
  error: '#ff3333',
  offline: '#333333',
};

// Task status → color
const TASK_STATUS_COLORS = {
  done: '#2ecc71',
  in_progress: '#f39c12',
  todo: '#3498db',
  review: '#9b59b6',
  testing: '#e67e22',
  blocked: '#e74c3c',
};

const NODES = [
  // CORE
  { id: 'MaybeAGI', type: 'core', radius: 0, size: 8.0, speed: 0, color: '#ffcc00', tiltX: 0, tiltZ: 0 },

  // SYSTEMS
  { id: 'Gateway', type: 'system', radius: 105, size: 3.2, speed: 0.1, color: '#ffffff', startAngle: 0, tiltX: 30, tiltZ: 5 },
  { id: 'Memory Store', type: 'system', radius: 112, size: 3.0, speed: 0.09, color: '#eeeeee', startAngle: Math.PI*1.5, tiltX: -25, tiltZ: -25 },
  { id: 'ACP Router', type: 'system', radius: 119, size: 2.8, speed: 0.11, color: '#dddddd', startAngle: Math.PI*0.5, tiltX: -30, tiltZ: 25 },
  { id: 'Cron Scheduler', type: 'system', radius: 126, size: 2.5, speed: 0.08, color: '#bbbbbb', startAngle: Math.PI, tiltX: 25, tiltZ: -30 },

  // TOOLS
  { id: 'exec', type: 'tool', radius: 245, size: 2.5, speed: 0.05, color: '#ff33bb', startAngle: 0, tiltX: -40, tiltZ: -20 },
  { id: 'read', type: 'tool', radius: 251, size: 2.3, speed: 0.052, color: '#ffbb33', startAngle: Math.PI*0.1, tiltX: 35, tiltZ: 15 },
  { id: 'write', type: 'tool', radius: 257, size: 2.2, speed: 0.054, color: '#33ffbb', startAngle: Math.PI*0.2, tiltX: -35, tiltZ: 20 },
  { id: 'browser', type: 'tool', radius: 263, size: 2.0, speed: 0.045, color: '#ff7733', startAngle: Math.PI*0.3, tiltX: 42, tiltZ: -30 },
  { id: 'message', type: 'tool', radius: 269, size: 1.8, speed: 0.048, color: '#3377ff', startAngle: Math.PI*0.4, tiltX: 48, tiltZ: 25 },
  { id: 'edit', type: 'tool', radius: 275, size: 1.5, speed: 0.06, color: '#bb33ff', startAngle: Math.PI*0.5, tiltX: 30, tiltZ: -35 },
  { id: 'process', type: 'tool', radius: 281, size: 1.5, speed: 0.062, color: '#33bbff', startAngle: Math.PI*0.6, tiltX: 40, tiltZ: 30 },
  { id: 'web_fetch', type: 'tool', radius: 287, size: 1.4, speed: 0.064, color: '#bbff33', startAngle: Math.PI*0.7, tiltX: -38, tiltZ: 35 },
  { id: 'cron_tool', type: 'tool', radius: 293, size: 1.4, speed: 0.066, color: '#ff3377', startAngle: Math.PI*0.8, tiltX: -42, tiltZ: 40 },
  { id: 'canvas', type: 'tool', radius: 299, size: 1.2, speed: 0.068, color: '#33ff77', startAngle: Math.PI*0.9, tiltX: -45, tiltZ: 10 },
  { id: 'gateway_tool', type: 'tool', radius: 305, size: 1.2, speed: 0.07, color: '#77ff33', startAngle: Math.PI*1.0, tiltX: -48, tiltZ: -45 },
  { id: 'nodes_tool', type: 'tool', radius: 311, size: 1.0, speed: 0.072, color: '#7733ff', startAngle: Math.PI*1.1, tiltX: 45, tiltZ: -40 },
  { id: 'sessions', type: 'tool', radius: 317, size: 1.3, speed: 0.074, color: '#ff3355', startAngle: Math.PI*1.2, tiltX: 50, tiltZ: 20 },
  { id: 'subagents', type: 'tool', radius: 323, size: 1.2, speed: 0.076, color: '#33ff55', startAngle: Math.PI*1.3, tiltX: -50, tiltZ: -20 },
  { id: 'memory', type: 'tool', radius: 329, size: 1.4, speed: 0.078, color: '#5533ff', startAngle: Math.PI*1.4, tiltX: 55, tiltZ: 30 },
  { id: 'image/pdf', type: 'tool', radius: 335, size: 1.2, speed: 0.08, color: '#ffff33', startAngle: Math.PI*1.5, tiltX: -55, tiltZ: -30 },
  { id: 'tts', type: 'tool', radius: 341, size: 1.0, speed: 0.082, color: '#ff88ff', startAngle: Math.PI*1.6, tiltX: 60, tiltZ: 15 },
  { id: 'diffs', type: 'tool', radius: 347, size: 1.1, speed: 0.084, color: '#88ffff', startAngle: Math.PI*1.7, tiltX: -60, tiltZ: -15 },
];

const EDGES = [
  // Core → Systems
  { source: 'MaybeAGI', target: 'Gateway' }, { source: 'MaybeAGI', target: 'Memory Store' },
  { source: 'MaybeAGI', target: 'ACP Router' }, { source: 'MaybeAGI', target: 'Cron Scheduler' },
  // Systems → Tools
  { source: 'Gateway', target: 'gateway_tool' }, { source: 'Gateway', target: 'nodes_tool' },
  { source: 'Cron Scheduler', target: 'cron_tool' }, { source: 'ACP Router', target: 'exec' },
  { source: 'Memory Store', target: 'memory' }, { source: 'memory', target: 'sessions' },
];

const CameraController = ({ selectedNode, nodeRefMap }) => {
  const { camera, controls } = useThree();
  const vec = new THREE.Vector3();
  const target = new THREE.Vector3();
  const hasReachedTarget = useRef(false);
  const lastSelectedNode = useRef(null);

  useFrame(() => {
    if (selectedNode && nodeRefMap.current[selectedNode]) {
      // Reset when selecting a different node
      if (lastSelectedNode.current !== selectedNode) {
        hasReachedTarget.current = false;
        lastSelectedNode.current = selectedNode;
      }
      
      const nodePos = nodeRefMap.current[selectedNode];
      
      // Always track the node so it stays centered even if it orbits
      target.copy(nodePos);
      if (controls) controls.target.lerp(target, 0.08);

      if (!hasReachedTarget.current) {
        vec.set(nodePos.x, nodePos.y + 15, nodePos.z + 50);
        camera.position.lerp(vec, 0.08);
        if (camera.position.distanceTo(vec) < 2) {
          hasReachedTarget.current = true;
        }
      }
    } else {
      target.set(0, 0, 0);
      if (controls) controls.target.lerp(target, 0.05);
      hasReachedTarget.current = false;
      lastSelectedNode.current = null;
    }
  });
  return null;
};

const DataFlowParticles = ({ positions, color }) => {
  const meshRef = useRef();
  const [progress, setProgress] = useState(Math.random());
  
  useFrame(() => {
    setProgress((p) => (p + 0.015) % 1);
    if (meshRef.current && positions && positions.length === 6) {
      const p1 = new THREE.Vector3(positions[0], positions[1], positions[2]);
      const p2 = new THREE.Vector3(positions[3], positions[4], positions[5]);
      meshRef.current.position.lerpVectors(p1, p2, progress);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.8, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
};

const DynamicConnections = ({ nodeRefMap, selectedNode, relatedNodesMap, edges = EDGES, allNodes = [], lineOpacity = 1 }) => {
  const lineRef = useRef();
  const [activeEdges, setActiveEdges] = useState([]);

  useFrame(() => {
    if (!lineRef.current) return;
    const positions = [];
    const colors = [];
    const newActiveEdges = [];
    
    // Show connections ONLY when a node is selected
    if (!selectedNode) {
      lineRef.current.visible = false;
      if (activeEdges.length) setActiveEdges([]);
      return;
    }

    let edgesToDraw = [];
    let firstDegree = new Set();

    edges.forEach(edge => {
      if (edge.source === selectedNode || edge.target === selectedNode) {
        edgesToDraw.push(edge);
        firstDegree.add(edge.source);
        firstDegree.add(edge.target);
      }
    });

    // Include 2-hop edges for context
    edges.forEach(edge => {
      if (firstDegree.has(edge.source) && edge.source !== 'MaybeAGI' && !edgesToDraw.includes(edge)) {
        edgesToDraw.push(edge);
      }
    });

    edgesToDraw.forEach(edge => {
      const p1 = nodeRefMap.current[edge.source];
      const p2 = nodeRefMap.current[edge.target];

      if (p1 && p2) {
        const coords = [p1.x, p1.y, p1.z, p2.x, p2.y, p2.z];
        positions.push(...coords);

        // Color by edge kind (task=orange, model=cyan, skill=magenta)
        const edgeKindColors = {
          task_assigned: '#ffaa00',
          agent_model: '#00ffaa',
          skill_used: '#ff55ff',
          knowledge_access: '#ff9933',
        };
        const kindColor = edgeKindColors[edge.kind] || '#ffffff';
        const colorObj = new THREE.Color(kindColor);
        
        const isDirect = edge.source === selectedNode || edge.target === selectedNode;
        const edgeWeight = edge.weight || 0.5;
        const opacity = (isDirect ? 1 : 0.3 + edgeWeight * 0.4) * (lineOpacity || 1);

        colors.push(colorObj.r * opacity, colorObj.g * opacity, colorObj.b * opacity);
        colors.push(colorObj.r * opacity, colorObj.g * opacity, colorObj.b * opacity);

        if (isDirect) {
          newActiveEdges.push({ id: `${edge.source}-${edge.target}`, positions: coords, color: colorObj.getStyle() });
        }
      }
    });

    if (positions.length > 0) {
      lineRef.current.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      lineRef.current.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      lineRef.current.geometry.computeBoundingSphere();
      lineRef.current.visible = true;
      setActiveEdges(newActiveEdges);
    } else {
      lineRef.current.visible = false;
      setActiveEdges([]);
    }
  });

  return (
    <>
      <lineSegments ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial vertexColors transparent opacity={0.8} linewidth={2} />
      </lineSegments>
      {activeEdges.map(edge => (
        <DataFlowParticles key={edge.id} positions={edge.positions} color={edge.color} />
      ))}
    </>
  );
};

// LIVE DATA HOOK FETCHING FROM REAL OPENCLAW BACKEND
const useLiveStats = (nodeData) => {
  const [stats, setStats] = useState(null);
  const [realSystemData, setRealSystemData] = useState(null);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        // Fetch from the local node server running on port 3001
        // Make sure to configure CORS or use IP if testing from Vercel. 
        // We fallback to localhost if direct IP fails.
        const ip = '76.13.190.65'; // Your server IP
        const res = await fetch(`http://${ip}:3001/api/claw-status`).catch(() => 
            fetch('http://localhost:3001/api/claw-status')
        );
        const data = await res.json();
        setRealSystemData(data);
      } catch (err) {
        console.error("Fetch stats error:", err);
      }
    };
    
    fetchRealData();
    const int = setInterval(fetchRealData, 5000); 
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    if (!nodeData) { setStats(null); return; }

    const generateStats = () => {
      if (nodeData.type === 'core') {
        return { 
          calls: (2400000 + Math.floor(Math.random() * 5000)).toLocaleString(), 
          uptime: realSystemData?.system?.uptime || '99.99%', 
          active_agents: realSystemData?.openclaw?.active_agents || Math.floor(Math.random() * 8) + 24,
          ram_usage: (realSystemData?.system?.ram_usage_percent || (4.2 + Math.random() * 0.5).toFixed(2)) + '%',
          health: realSystemData?.openclaw?.status || 'Optimal' 
        };
      }
      
      if (nodeData.id === 'Gateway') {
         return {
             status: realSystemData?.openclaw?.status || 'Online',
             processes: realSystemData?.system?.active_processes || 5,
             ram: (realSystemData?.system?.ram_usage_percent || '45') + '%',
             uptime: realSystemData?.system?.uptime || 'Active'
         };
      }
      
      if (nodeData.type === 'model') {
        const base = {
          'Claude Opus': { calls: 342150, cost: 45.20 }, 'Claude Sonnet 4.5': { calls: 180420, cost: 12.50 },
          'GPT-5.4': { calls: 125300, cost: 22.10 }, 'GPT-5.4 Pro': { calls: 84300, cost: 42.10 },
          'GPT-5.3': { calls: 52300, cost: 12.10 }, 'GPT-5.2': { calls: 42300, cost: 8.10 },
          'GPT-4o': { calls: 95400, cost: 8.40 },
          'Gemini 3.1 Pro': { calls: 210880, cost: 0.00 }, 'Gemini 3.1 Flash': { calls: 310880, cost: 0.00 },
          'GPT-4.1 Mini': { calls: 290110, cost: 5.10 },
          'Minimax M2.5': { calls: 178990, cost: 0.00 }, 'Zhipu GLM-4.7': { calls: 45200, cost: 1.20 },
          'Kimi K2.5': { calls: 32100, cost: 0.80 }, 'Qwen 2.5 3B': { calls: 54100, cost: 0.00 }
        }[nodeData.id] || { calls: 10000, cost: 1.0 };
        return { 
          invocations: (base.calls + Math.floor(Math.random() * 100)).toLocaleString(), 
          latency: (Math.random() * 1.5 + 0.5).toFixed(2) + 's', 
          cost_usd: '$' + (base.cost + Math.random() * 0.1).toFixed(2),
          tokens_gen: Math.floor(Math.random() * 5000) + ' tk/s'
        };
      }
      
      if (nodeData.type === 'agent' || nodeData.type === 'subagent') {
        return { tasks_completed: Math.floor(Math.random() * 800) + 250, active_jobs: Math.floor(Math.random() * 5), success_rate: (94 + Math.random() * 5).toFixed(1) + '%', status: 'Online' };
      }
      if (nodeData.type === 'tool') {
        return { total_execs: (Math.floor(Math.random() * 80000) + 20000).toLocaleString(), errors_24h: Math.floor(Math.random() * 3), avg_duration: (Math.random() * 1.2 + 0.1).toFixed(2) + 's' };
      }
      if (nodeData.type === 'skill') {
        return { reliability: (97 + Math.random() * 3).toFixed(1) + '%', last_called: Math.floor(Math.random() * 60) + 'm ago', deps_ok: 'Yes' };
      }
      return { status: 'Online' };
    };

    setStats(generateStats());
    const int = setInterval(() => setStats(generateStats()), 2000);
    return () => clearInterval(int);
  }, [nodeData, realSystemData]);

  return stats;
};

const Node = ({ nodeData, nodeRefMap, selectedNode, hoveredNode, setHoveredNode, onSelect, globalScale, orbitSpeed, labelMode, relatedNodesMap, isVisible }) => {
  const groupRef = useRef();
  const meshRef = useRef();
  const orbitGroupRef = useRef();
  const isHovered = hoveredNode === nodeData.id;
  
  useMemo(() => {
    if (nodeData.type !== 'core' && orbitGroupRef.current) {
      orbitGroupRef.current.rotation.x = nodeData.tiltX * (Math.PI / 180);
      orbitGroupRef.current.rotation.z = nodeData.tiltZ * (Math.PI / 180);
    }
  }, [nodeData]);

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return;
    if (nodeData.type === 'core') {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x += 0.002;
    } else {
      const t = state.clock.elapsedTime * nodeData.speed * (orbitSpeed || 1) + nodeData.startAngle;
      const x = Math.cos(t) * nodeData.radius;
      const z = Math.sin(t) * nodeData.radius;
      groupRef.current.position.set(x, 0, z);
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.x += 0.01;
    }
    
    if(nodeRefMap.current[nodeData.id]) {
      groupRef.current.getWorldPosition(nodeRefMap.current[nodeData.id]);
    }
  });

  if (!isVisible && !selectedNode) return null; // Hide if filtered out

  const isSelected = selectedNode === nodeData.id;
  const isRelated = selectedNode && relatedNodesMap.has(nodeData.id);
  const isDimmed = selectedNode && !isSelected && !isRelated;

  const currentOpacity = isDimmed ? 0.05 : (isHovered ? 1 : 0.9);
  const baseSize = nodeData.size * globalScale;
  const highlightScale = isHovered || isSelected ? 1.4 : 1;
  const finalScale = [highlightScale, highlightScale, highlightScale];

  let showLabel = false;
  if (labelMode === 'none') {
    showLabel = false;
  } else if (labelMode === 'selected') {
    // Show labels only for selected node and its connected nodes
    if (selectedNode) {
      showLabel = isSelected || isRelated;
    }
  } else if (selectedNode) {
    if (isSelected || isRelated) showLabel = true;
  } else {
    if (labelMode === 'all' && !isDimmed) showLabel = true;
    else if (labelMode === 'hover') showLabel = isHovered;
    else if (labelMode === 'smart') showLabel = (!isDimmed && (nodeData.type === 'core' || nodeData.type === 'model' || nodeData.type === 'agent' || nodeData.type === 'subagent')) || isHovered;
  }

  return (
    <group ref={orbitGroupRef}>
      <group 
        ref={groupRef}
        onPointerOver={() => setHoveredNode(nodeData.id)}
        onPointerOut={() => setHoveredNode(null)}
        onClick={(e) => { e.stopPropagation(); onSelect(isSelected ? null : nodeData.id); }}
        onDoubleClick={(e) => { e.stopPropagation(); onSelect(nodeData.id); }}
        onContextMenu={(e) => { e.stopPropagation(); onSelect(nodeData.id); }}
      >
        <mesh ref={meshRef} scale={finalScale}>
          <sphereGeometry args={[baseSize, 24, 24]} />
          <meshStandardMaterial 
            color={nodeData.color} emissive={nodeData.color} 
            emissiveIntensity={(isSelected ? 0.8 : isHovered ? 0.6 : 0.3) * (1 + (nodeData.heat || 0) * 0.8)} 
            transparent={true} opacity={currentOpacity}
            roughness={0.2} metalness={0.6} wireframe={nodeData.type === 'core'}
          />
        </mesh>
        
        {showLabel && (
          <Html center zIndexRange={[100, 0]} position={[0, baseSize * highlightScale + 1.5, 0]} style={{ pointerEvents: 'none' }}>
            <div style={{
              color: 'white', whiteSpace: 'nowrap',
              fontSize: isSelected ? '16px' : (isHovered ? '14px' : '11px'),
              fontWeight: isSelected || isHovered || nodeData.type === 'core' ? 'bold' : 'normal',
              textShadow: `0 0 5px ${nodeData.color}, 0 0 10px #000, 0 0 15px #000`, 
              opacity: currentOpacity, background: isHovered || isSelected ? 'rgba(0,0,0,0.7)' : 'transparent',
              padding: isHovered || isSelected ? '2px 6px' : '0', borderRadius: '4px'
            }}>
              {nodeData.label || nodeData.id.replace(/^(live:|mc:|task:|action:)/, '')}
            </div>
          </Html>
        )}
      </group>
      
      {nodeData.type !== 'core' && (isHovered || isSelected || isRelated) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[nodeData.radius - 0.5, nodeData.radius + 0.5, 64]} />
          <meshBasicMaterial color={nodeData.color} transparent opacity={isSelected ? 0.2 : 0.05} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};

// Hook: Fetch real-time data from Live API (models, skills, agents, MC data)
function useMissionControlData() {
  const [mcAgents, setMcAgents] = useState([]);
  const [mcTasks, setMcTasks] = useState([]);
  const [liveModels, setLiveModels] = useState([]);
  const [liveSkills, setLiveSkills] = useState([]);
  const [usageEdges, setUsageEdges] = useState([]);
  const [actionNodes, setActionNodes] = useState([]);
  const [knowledgeNodes, setKnowledgeNodes] = useState([]);
  const [mcOnline, setMcOnline] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${LIVE_API}/api/live/all`);
        if (res.ok) {
          const data = await res.json();
          setLiveModels(data.models || []);
          setLiveSkills(data.skills || []);
          setMcAgents(data.mcAgents || []);
          setMcTasks(data.mcTasks || []);
          setUsageEdges(data.usageEdges || []);
          setActionNodes(data.actionNodes || []);
          setKnowledgeNodes(data.knowledge || []);
          setMcOnline(true);
        }
      } catch { setMcOnline(false); }
    };
    fetchData();
    const interval = setInterval(fetchData, 2000); // Faster polling for actions
    return () => clearInterval(interval);
  }, []);

  return { mcAgents, mcTasks, liveModels, liveSkills, usageEdges, actionNodes, knowledgeNodes, mcOnline };
}

// Convert live data into 3D nodes & edges
function buildMCNodes(mcAgents, mcTasks, liveModels, liveSkills, usageEdges, actionNodes = [], knowledgeNodes = []) {
  const mcNodes = [];
  const mcEdges = [];

  // Usage heat map (recent/important nodes glow slightly)
  const heat = new Map();
  (usageEdges || []).forEach(e => {
    if (!e?.source || !e?.target) return;
    heat.set(e.source, (heat.get(e.source) || 0) + 1);
    heat.set(e.target, (heat.get(e.target) || 0) + 1);
  });
  const heatNorm = (id) => Math.min((heat.get(id) || 0) / 4, 1);

  // === LIVE MODELS ===
  const modelColors = ['#aa33ff','#8833ff','#ff3355','#3388ff','#33ccff','#00ccaa','#00ffaa','#00aacc','#0088cc','#33aa88','#33ffaa','#ff5533','#ff8833','#cc55ff'];
  
  // Layer 1: Models (inner ring)
  liveModels.forEach((model, i) => {
    const id = `live:${model.name}`;
    const h = heatNorm(id);
    mcNodes.push({
      id,
      type: 'model',
      radius: 70,
      size: (model.isPrimary ? 5.0 : 3.2) * (1 + h * 0.25),
      speed: 0.035,
      color: modelColors[i % modelColors.length],
      startAngle: (i * Math.PI * 2) / Math.max(liveModels.length, 1),
      tiltX: 10,
      tiltZ: -10,
      heat: h,
      mcData: model,
    });
  });

  // === MC AGENTS (PRE-PROCESS) ===
  const master = mcAgents.find(a => a.is_master);

  // === LIVE SKILLS ===
  const skillColors = ['#4444ff','#ff44ff','#ff9944','#ffaaaa','#449944','#ffff44','#994444','#ff4444','#44ffff','#9944ff','#99ff44','#ffaa00','#ff00aa','#00aaff','#aaff00','#00ff44'];
  // Layer 4: Skills (outer ring) - ALL skills (no limit)
  liveSkills.forEach((skill, i) => {
    const id = `live:skill:${skill.name}`;
    const h = heatNorm(id);
    mcNodes.push({
      id,
      type: 'skill',
      radius: 280,
      size: 1.05 * (1 + h * 0.35),
      speed: 0.01,
      color: skillColors[i % skillColors.length],
      startAngle: (i * Math.PI * 2) / Math.max(liveSkills.length, 1),
      tiltX: 35,
      tiltZ: -35,
      heat: h,
      mcData: skill,
    });
  });

  // === MC AGENTS ===
  if (master) {
    const masterId = `mc:${master.name}`;
    const h = heatNorm(masterId);
    mcNodes.push({
      id: masterId,
      type: 'agent',
      radius: 140,
      size: 4.0 * (1 + h * 0.25),
      speed: 0.028,
      color: STATUS_COLORS[master.status] || '#8899aa',
      startAngle: Math.PI * 0.15,
      tiltX: 20,
      tiltZ: 20,
      heat: h,
      mcData: master,
    });
    mcEdges.push({ source: 'MaybeAGI', target: masterId });
    mcEdges.push({ source: 'Gateway', target: masterId });
  }

  // Layer 2: Agents/Subagents (team ring)
  mcAgents.filter(a => !a.is_master).forEach((agent, i) => {
    const agentId = `mc:${agent.name}`;
    const h = heatNorm(agentId);
    mcNodes.push({
      id: agentId,
      type: 'subagent',
      radius: 165,
      size: 2.5 * (1 + h * 0.25),
      speed: 0.03,
      color: STATUS_COLORS[agent.status] || '#8899aa',
      startAngle: (i * Math.PI * 2) / Math.max(mcAgents.length - 1, 1),
      tiltX: -25,
      tiltZ: 25,
      heat: h,
      mcData: agent,
    });
    if (master) mcEdges.push({ source: `mc:${master.name}`, target: agentId });
  });

  // === MC TASKS ===
  // Layer 3: Tasks (ring between agents and skills)
  mcTasks.forEach((task, i) => {
    const taskId = `task:${task.id}`;
    const h = heatNorm(taskId);
    mcNodes.push({
      id: taskId,
      label: task.title,
      type: 'tool',
      radius: 215,
      size: 1.25 * (1 + h * 0.35),
      speed: 0.018,
      color: TASK_STATUS_COLORS[task.status] || '#3498db',
      startAngle: (i * Math.PI * 2) / Math.max(mcTasks.length, 1),
      tiltX: -10,
      tiltZ: -25,
      heat: h,
      mcData: task,
    });
  });

  // === USAGE EDGES (REAL) ===
  (usageEdges || []).forEach(e => {
    if (e?.source && e?.target) mcEdges.push({ source: e.source, target: e.target, kind: e.kind, ts: e.ts });
  });

  // === ACTION NODES (ephemeral - appear briefly when tools are used)
  const actionColors = ['#ff3366', '#33ff99', '#ffcc00', '#00ccff', '#ff6633'];
  actionNodes.forEach((action, i) => {
    const remainingPct = (action.remainingMs || 8000) / 8000; // 0-1 based on remaining time
    mcNodes.push({
      id: action.id,
      type: 'action',
      radius: 100 + Math.random() * 60, // Random position in middle ring
      size: 2.0 * remainingPct + 0.5, // Shrink as time passes
      speed: 0,
      color: actionColors[i % actionColors.length],
      startAngle: Math.random() * Math.PI * 2,
      tiltX: (Math.random() - 0.5) * 30,
      tiltZ: (Math.random() - 0.5) * 30,
      heat: remainingPct, // Glow brighter when fresh
      mcData: { name: action.name, remainingMs: action.remainingMs },
    });
    // Connect to agent (simulated)
    const agentId = 'mc:Researcher'; // Default to researcher for now
    mcEdges.push({ source: agentId, target: action.id, kind: 'action_spawn', weight: remainingPct });
  });

  // === KNOWLEDGE NODES (from memory files)
  const knowledgeColors = ['#ff9933', '#ffcc66', '#ff6699', '#66ccff', '#99ff66'];
  knowledgeNodes.forEach((kb, i) => {
    mcNodes.push({
      id: kb.id,
      type: 'knowledge',
      radius: 190 + (i * 15), // Between agents and tasks
      size: 1.8,
      speed: 0.022,
      color: knowledgeColors[i % knowledgeColors.length],
      startAngle: (i * Math.PI * 2) / Math.max(knowledgeNodes.length, 1),
      tiltX: 15,
      tiltZ: -15,
      heat: 0.3,
      mcData: { name: kb.name },
    });
    // Connect to Researcher by default
    mcEdges.push({ source: 'mc:Researcher', target: kb.id, kind: 'knowledge_access', weight: 0.4 });
  });

  return { mcNodes, mcEdges };
}

export default function App() {
  const nodeRefMap = useRef({});
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [globalScale, setGlobalScale] = useState(1.0);
  const [orbitSpeed, setOrbitSpeed] = useState(1.0);
  const [lineOpacity, setLineOpacity] = useState(1.0);
  const [labelMode, setLabelMode] = useState('none');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [layerVisible, setLayerVisible] = useState({ model: true, agent: true, subagent: true, tool: true, skill: true, system: true, core: true, action: true, knowledge: true });
  
  // Real-time Mission Control data
  const { mcAgents, mcTasks, liveModels, liveSkills, usageEdges, actionNodes, knowledgeNodes, mcOnline } = useMissionControlData();
  const { mcNodes, mcEdges } = useMemo(() => buildMCNodes(mcAgents, mcTasks, liveModels, liveSkills, usageEdges, actionNodes, knowledgeNodes), [mcAgents, mcTasks, liveModels, liveSkills, usageEdges, actionNodes, knowledgeNodes]);
  
  // Merge static + MC nodes/edges
  const allNodes = useMemo(() => {
    const merged = [...NODES, ...mcNodes];
    return merged.filter(n => layerVisible[n.type] !== false);
  }, [mcNodes, layerVisible]);
  const allEdges = useMemo(() => [...EDGES, ...mcEdges], [mcEdges]);
  
  useMemo(() => { allNodes.forEach(n => { if (!nodeRefMap.current[n.id]) nodeRefMap.current[n.id] = new THREE.Vector3(0,0,0); }); }, [allNodes]);

  const relatedNodesMap = useMemo(() => {
    if (!selectedNode) return new Set();
    let related = new Set();
    allEdges.forEach(e => {
      if(e.source === selectedNode) related.add(e.target);
      if(e.target === selectedNode) related.add(e.source);
    });
    allEdges.forEach(e => { if(related.has(e.source) && e.source !== 'MaybeAGI') related.add(e.target); });
    return related;
  }, [selectedNode, allEdges]);

  const activeNodeData = selectedNode ? allNodes.find(n => n.id === selectedNode) : null;
  const liveStats = useLiveStats(activeNodeData);

  const handleQuickAction = (action) => {
    alert(`Action [${action}] triggered for ${selectedNode}`);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000005', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      
      {/* Top Header & Search/Filter */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ color: 'white' }}>
          <h1 style={{ margin: 0, fontSize: '24px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>MaybeAGI Universe</h1>
          <p style={{ margin: '5px 0', opacity: 0.8, fontSize: '12px' }}>Enterprise AI Ecosystem Map {mcOnline ? <span style={{ color: '#2ecc71' }}>● Live ({liveModels.length} models, {liveSkills.length} skills, {mcAgents.length} agents)</span> : <span style={{ color: '#e74c3c' }}>● Offline</span>}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search nodes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none' }}
          />
          <select 
            value={activeFilter} 
            onChange={(e) => setActiveFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none' }}
          >
            <option value="all">All Types</option>
            <option value="model">Models</option>
            <option value="agent">Agents</option>
            <option value="subagent">Sub-Agents</option>
            <option value="tool">Tools</option>
            <option value="skill">Skills</option>
          </select>
        </div>
      </div>

      {/* Stats Overlay - Top Left */}
      <div style={{ position: 'absolute', top: `calc(10px + ${SAFE_TOP})`, left: `calc(10px + ${SAFE_LEFT})`, zIndex: 8, background: 'rgba(15,15,25,0.85)', padding: '8px 12px', borderRadius: '10px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', color: 'rgba(255,255,255,0.9)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px' }}>
          <div><span style={{ color: '#aa33ff' }}>●</span> Models: <b>{allNodes.filter(n => n.type === 'model').length}</b></div>
          <div><span style={{ color: '#22cc88' }}>●</span> Agents: <b>{allNodes.filter(n => n.type === 'agent' || n.type === 'subagent').length}</b></div>
          <div><span style={{ color: '#3498db' }}>●</span> Tasks: <b>{allNodes.filter(n => n.type === 'tool').length}</b></div>
          <div><span style={{ color: '#4444ff' }}>●</span> Skills: <b>{allNodes.filter(n => n.type === 'skill').length}</b></div>
          <div><span style={{ color: '#ff9933' }}>●</span> Knowledge: <b>{allNodes.filter(n => n.type === 'knowledge').length}</b></div>
          <div><span style={{ color: '#ff3366' }}>●</span> Actions: <b>{allNodes.filter(n => n.type === 'action').length}</b></div>
        </div>
        <div style={{ marginTop: '6px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '4px', fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>
          Total: <b>{allNodes.length}</b> nodes | {mcOnline ? '🟢 Online' : '🔴 Offline'}
        </div>
      </div>

      {/* Dashboard Panel - Mobile Responsive */}
      {selectedNode && activeNodeData && liveStats && (
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, maxWidth: 'min(280px, 45vw)', animation: 'fadeIn 0.3s' }}>
          <div style={{ background: 'rgba(15,15,25,0.9)', padding: '10px 12px', borderRadius: '10px', border: `1px solid ${activeNodeData.color}`, backdropFilter: 'blur(12px)', boxShadow: `0 0 15px ${activeNodeData.color}30` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '14px', color: activeNodeData.color, textShadow: `0 0 8px ${activeNodeData.color}`, maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedNode.replace(/^(live:|mc:|task:|action:)/, '')}</h2>
              <button onClick={() => setSelectedNode(null)} title="Unfocus" style={{ background: 'rgba(255,50,80,0.8)', border: 'none', borderRadius: '4px', width: '20px', height: '20px', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', lineHeight: 1 }}>×</button>
            </div>
            <span style={{ fontSize: '9px', opacity: 0.7, textTransform: 'uppercase', color: 'white' }}>{activeNodeData.type}</span>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '8px' }}>
              {Object.entries(liveStats).slice(0, 4).map(([key, value]) => (
                <div key={key} style={{ background: 'rgba(0,0,0,0.4)', padding: '4px 6px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '8px', color: '#8899aa', textTransform: 'uppercase' }}>{key.replace('_', ' ')}</div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'white' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div style={{ position: 'absolute', bottom: `calc(12px + ${SAFE_BOTTOM})`, left: '50%', transform: 'translateX(-50%)', zIndex: 10, background: 'rgba(20,20,30,0.85)', padding: '10px 12px', borderRadius: '18px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '10px', width: 'max-content', maxWidth: '95%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>Scale:</span>
          <input type="range" min="0.3" max="2.0" step="0.1" value={globalScale} onChange={(e) => setGlobalScale(parseFloat(e.target.value))} style={{ width: '60px', accentColor: '#00e5ff' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>Speed:</span>
          <input type="range" min="0.2" max="2.0" step="0.1" value={orbitSpeed} onChange={(e) => setOrbitSpeed(parseFloat(e.target.value))} style={{ width: '60px', accentColor: '#00e5ff' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>Lines:</span>
          <input type="range" min="0.2" max="1.0" step="0.1" value={lineOpacity} onChange={(e) => setLineOpacity(parseFloat(e.target.value))} style={{ width: '60px', accentColor: '#00e5ff' }} />
        </div>
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', borderRadius: '15px', overflow: 'hidden' }}>
          <button onClick={() => setLayerVisible(v => ({...v, model: !v.model}))} style={{ background: layerVisible.model ? 'rgba(0,229,255,0.25)' : 'transparent', color: 'white', border: 'none', padding: '5px 8px', cursor: 'pointer', fontSize: '11px' }}>M</button>
          <button onClick={() => setLayerVisible(v => ({...v, agent: !v.agent, subagent: !v.subagent}))} style={{ background: (layerVisible.agent || layerVisible.subagent) ? 'rgba(0,229,255,0.25)' : 'transparent', color: 'white', border: 'none', padding: '5px 8px', cursor: 'pointer', fontSize: '11px' }}>A</button>
          <button onClick={() => setLayerVisible(v => ({...v, tool: !v.tool}))} style={{ background: layerVisible.tool ? 'rgba(0,229,255,0.25)' : 'transparent', color: 'white', border: 'none', padding: '5px 8px', cursor: 'pointer', fontSize: '11px' }}>T</button>
          <button onClick={() => setLayerVisible(v => ({...v, skill: !v.skill}))} style={{ background: layerVisible.skill ? 'rgba(0,229,255,0.25)' : 'transparent', color: 'white', border: 'none', padding: '5px 8px', cursor: 'pointer', fontSize: '11px' }}>S</button>
          <button onClick={() => setLayerVisible(v => ({...v, action: !v.action}))} style={{ background: layerVisible.action ? 'rgba(255,51,102,0.25)' : 'transparent', color: 'white', border: 'none', padding: '5px 8px', cursor: 'pointer', fontSize: '11px' }}>⚡</button>
          <button onClick={() => setLayerVisible(v => ({...v, knowledge: !v.knowledge}))} style={{ background: layerVisible.knowledge ? 'rgba(255,153,51,0.25)' : 'transparent', color: 'white', border: 'none', padding: '5px 8px', cursor: 'pointer', fontSize: '11px' }}>K</button>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }}></div>
          <button onClick={() => setLabelMode('none')} style={{ background: labelMode === 'none' ? '#00e5ff' : 'transparent', color: labelMode === 'none' ? 'black' : 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', fontSize: '11px' }}>Off</button>
          <button onClick={() => setLabelMode('selected')} style={{ background: labelMode === 'selected' ? '#00e5ff' : 'transparent', color: labelMode === 'selected' ? 'black' : 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', fontSize: '11px' }}>Selected</button>
          <button onClick={() => setLabelMode('hover')} style={{ background: labelMode === 'hover' ? '#00e5ff' : 'transparent', color: labelMode === 'hover' ? 'black' : 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', fontSize: '11px' }}>Hover</button>
          <button onClick={() => setLabelMode('smart')} style={{ background: labelMode === 'smart' ? '#00e5ff' : 'transparent', color: labelMode === 'smart' ? 'black' : 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', fontSize: '11px' }}>Smart</button>
          <button onClick={() => setLabelMode('all')} style={{ background: labelMode === 'all' ? '#00e5ff' : 'transparent', color: labelMode === 'all' ? 'black' : 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', fontSize: '11px' }}>All</button>
        </div>
        {selectedNode && (
          <button onClick={() => { setGlobalScale(1.8); }} title="Zoom to selected" style={{ background: '#00e5ff', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>🔍+</button>
        )}
        <button onClick={() => { setSelectedNode(null); setGlobalScale(1.0); setSearchQuery(''); setActiveFilter('all'); }} style={{ background: '#ff3355', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>Reset</button>
      </div>
      
      {/* Legend */}
      <div style={{ position: 'absolute', bottom: `calc(60px + ${SAFE_BOTTOM})`, left: '10px', zIndex: 5, background: 'rgba(20,20,30,0.7)', padding: '6px 10px', borderRadius: '8px', fontSize: '9px', color: 'rgba(255,255,255,0.8)' }}>
        <div style={{ marginBottom: '3px', fontWeight: 'bold' }}>Edges:</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffaa00' }}></span> Task→Agent</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ffaa' }}></span> Agent→Model</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff55ff' }}></span> Agent→Skill</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff9933' }}></span> Agent→Knowledge</div>
        <div style={{ marginTop: '5px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '3px' }}>
          <div style={{ fontWeight: 'bold' }}>Toggle:</div>
          <div>M=Models A=Agents T=Tasks S=Skills ⚡=Actions K=Knowledge</div>
        </div>
      </div>
      
      <Canvas dpr={[1, 1.5]}>
        <color attach="background" args={['#000005']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[100, 100, 100]} intensity={2.5} />
        <pointLight position={[-100, -100, -100]} intensity={1.5} color="#4400ff" />
        <pointLight position={[0, 0, 0]} intensity={6} color="#ffcc00" distance={200} />
        <Stars radius={300} depth={150} count={6000} factor={5} fade speed={0.1} />
        
        <CameraController selectedNode={selectedNode} nodeRefMap={nodeRefMap} />
        
        {allNodes.map((node) => {
          const isVisible = (activeFilter === 'all' || node.type === activeFilter) && 
                            (searchQuery === '' || node.id.toLowerCase().includes(searchQuery.toLowerCase()));
          return <Node key={node.id} nodeData={node} nodeRefMap={nodeRefMap} selectedNode={selectedNode} hoveredNode={hoveredNode} setHoveredNode={setHoveredNode} onSelect={setSelectedNode} globalScale={globalScale} orbitSpeed={orbitSpeed} labelMode={labelMode} relatedNodesMap={relatedNodesMap} isVisible={isVisible} />;
        })}
        
        <DynamicConnections nodeRefMap={nodeRefMap} selectedNode={selectedNode} relatedNodesMap={relatedNodesMap} edges={allEdges} allNodes={allNodes} lineOpacity={lineOpacity} />
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} autoRotate={!selectedNode && !hoveredNode && searchQuery === ''} autoRotateSpeed={0.05} maxDistance={600} minDistance={20} makeDefault />
      </Canvas>
    </div>
  );
}
