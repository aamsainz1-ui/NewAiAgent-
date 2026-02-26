import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars, Text, Billboard, Sparkles, QuadraticBezierLine } from '@react-three/drei';
import PropTypes from 'prop-types';
import * as THREE from 'three';

// ─── Category base hues (HSL hue degrees) — kept for category labels only ───
const catHues = {
  agent: 45, model: 200, seo: 270, browser: 25,
  memory: 330, infra: 90, business: 150, finance: 50,
  project: 340, calendar: 240, analytics: 170, football: 0,
  media: 30, messaging: 190, 'mem-data': 280, inactive: 220,
};

// Every node gets a unique color — full spectrum distribution
// Golden angle (~137.5°) ensures maximum spread between adjacent nodes
function getNodeColor(nodeIndex, totalNodes, weight) {
  const goldenAngle = 137.508;
  const hue = (nodeIndex * goldenAngle) % 360;
  const w = Math.max(0.1, Math.min(1, weight || 0.5));
  const sat = 65 + w * 30;
  const lit = 42 + w * 25;
  return `hsl(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(lit)}%)`;
}

// Category label color (mid-range for the category)
function getCatColor(category) {
  const hue = catHues[category] ?? 0;
  return `hsl(${hue}, 80%, 60%)`;
}

// ─── Edge color system — every edge gets a unique color too ───
function getEdgeColorUnique(edgeIndex, totalEdges, weight) {
  const goldenAngle = 137.508;
  // Offset by 68° from nodes so edges don't overlap node colors
  const hue = (edgeIndex * goldenAngle + 68) % 360;
  const w = Math.max(0.1, Math.min(1, weight || 0.3));
  const sat = 50 + w * 35;
  const lit = 40 + w * 25;
  return `hsl(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(lit)}%)`;
}

// ─── Galaxy Cluster Layout ───
// Agent/model at core, everything else in a dense spherical cluster
function createGalaxyLayout(nodes, spread = 1.5) {
  if (!nodes || nodes.length === 0) return [];

  const groupMap = new Map();
  nodes.forEach(node => {
    const cat = node.category || 'inactive';
    if (!groupMap.has(cat)) groupMap.set(cat, []);
    groupMap.get(cat).push(node);
  });

  const layout = [];

  // Layer 0: Agent core — spread apart
  const agents = groupMap.get('agent') || [];
  agents.forEach((node, i) => {
    const a = (i / Math.max(agents.length, 1)) * Math.PI * 2;
    layout.push({ ...node, position: [Math.cos(a) * 1.0 * spread, 0.5 * i, Math.sin(a) * 1.0 * spread] });
  });

  // Layer 1: Models — wide orbit, well spaced
  const models = groupMap.get('model') || [];
  models.forEach((node, i) => {
    const a = (i / models.length) * Math.PI * 2 + 0.3;
    const r = (4.0 + Math.random() * 0.8) * spread;
    const elev = Math.sin(a * 1.5) * 1.2;
    layout.push({ ...node, position: [
      Number((r * Math.cos(a)).toFixed(3)),
      Number(elev.toFixed(3)),
      Number((r * Math.sin(a)).toFixed(3))
    ]});
  });

  // Layer 2: Active skill categories — spread out in sectors
  const skillCats = Array.from(groupMap.keys()).filter(c => c !== 'agent' && c !== 'model' && c !== 'mem-data');
  
  const catAngles = {};
  skillCats.forEach((cat, i) => {
    catAngles[cat] = (i / skillCats.length) * Math.PI * 2;
  });

  skillCats.forEach(cat => {
    const catNodes = groupMap.get(cat) || [];
    const baseAngle = catAngles[cat];
    const catSpread = Math.min(0.8, (catNodes.length * 0.08));
    
    catNodes.forEach((node, j) => {
      const nodeAngle = baseAngle + (j / catNodes.length - 0.5) * catSpread * Math.PI;
      const r = (7.0 + Math.random() * 5.0) * spread;
      const elevation = (Math.random() - 0.5) * 5.0 * spread;
      
      layout.push({ ...node, position: [
        Number((r * Math.cos(nodeAngle)).toFixed(3)),
        Number(elevation.toFixed(3)),
        Number((r * Math.sin(nodeAngle)).toFixed(3))
      ]});
    });
  });

  // Layer 3: Memory/knowledge nodes — outer halo
  const memNodes = groupMap.get('mem-data') || [];
  memNodes.forEach((node, i) => {
    const phi = Math.acos(-1 + (2 * i + 1) / memNodes.length);
    const theta = Math.sqrt(memNodes.length * Math.PI) * phi;
    const r = (13.0 + Math.random() * 3.0) * spread;
    layout.push({ ...node, position: [
      Number((r * Math.cos(theta) * Math.sin(phi)).toFixed(3)),
      Number((r * Math.cos(phi) * 0.6).toFixed(3)),
      Number((r * Math.sin(theta) * Math.sin(phi)).toFixed(3))
    ]});
  });

  return layout;
}

// ─── Core Glow — soft emissive sphere at center ───
function CoreGlow() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.material.opacity = 0.12 + 0.06 * Math.sin(t * 0.5);
      ref.current.scale.setScalar(1 + 0.05 * Math.sin(t * 0.8));
    }
  });
  return (
    <Sphere ref={ref} args={[1.2, 32, 32]} position={[0, 0, 0]}>
      <meshBasicMaterial color="#fde047" transparent opacity={0.15} depthWrite={false} />
    </Sphere>
  );
}

// ─── Inner dust ring — tiny points swirling around core ───
function DustRing({ count = 200, radius = 1.0 }) {
  const ref = useRef();
  const points = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 0.4;
      arr[i * 3] = r * Math.cos(a);
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
      arr[i * 3 + 2] = r * Math.sin(a);
    }
    return arr;
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#60a5fa" transparent opacity={0.6} depthWrite={false} sizeAttenuation />
    </points>
  );
}
DustRing.propTypes = { count: PropTypes.number, radius: PropTypes.number };

// ─── Node Label ───
function NodeLabel({ label, yOffset }) {
  return (
    <Billboard position={[0, yOffset, 0]}>
      <Text fontSize={0.13} color="#e2e8f0" anchorX="center" anchorY="bottom"
        outlineWidth={0.012} outlineColor="#020617">
        {label}
      </Text>
    </Billboard>
  );
}
NodeLabel.propTypes = { label: PropTypes.string.isRequired, yOffset: PropTypes.number.isRequired };

// ─── Node ───
function Node({ label, position, color, type, nodeScale, isActive, onSelect, onHover, showLabel, skillActive, nodeIndex, weight, dimmed, highlighted }) {
  const w = weight || 0.5;
  // Agent biggest, model big, skill medium, memory small
  const sizeMap = { agent: 2.5, model: 1.3, memory: 0.5, skill: 0.7 };
  const sizeMultiplier = sizeMap[type] || 0.7;
  const finalSize = 0.12 * nodeScale * sizeMultiplier * (0.6 + w * 0.6);
  const sphereArgs = useMemo(() => [finalSize, 16, 16], [finalSize]);
  const glowArgs = useMemo(() => [finalSize * 2.0, 10, 10], [finalSize]);
  const sphereRef = useRef();
  const glowRef = useRef();
  const offset = nodeIndex * 0.7;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (sphereRef.current) {
      const speed = highlighted ? 3.0 : 1.2;
      const amp = highlighted ? 0.15 : 0.04;
      sphereRef.current.scale.setScalar(1 + amp * Math.sin(t * speed + offset));
      const mat = sphereRef.current.material;
      if (mat) {
        if (dimmed) {
          mat.emissiveIntensity = 0.01;
          mat.opacity = 0.2;
          mat.transparent = true;
        } else {
          mat.opacity = 1;
          mat.transparent = false;
          mat.emissiveIntensity = highlighted ? 2.5 : isActive ? 1.8
            : 0.4 + 0.3 * Math.abs(Math.sin(t * 0.8 + offset));
        }
      }
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = highlighted ? 0.5
        : !dimmed ? 0.15 + 0.1 * Math.sin(t * 0.6 + offset) : 0.02;
    }
  });

  const handleClick = useCallback((e) => { e.stopPropagation(); onSelect(); }, [onSelect]);
  const handleOver = useCallback(() => { document.body.style.cursor = 'pointer'; onHover(true); }, [onHover]);
  const handleOut = useCallback(() => { document.body.style.cursor = 'auto'; onHover(false); }, [onHover]);

  return (
    <group position={position}>
      <Sphere ref={sphereRef} args={sphereArgs} onClick={handleClick} onPointerOver={handleOver} onPointerOut={handleOut}>
        <meshStandardMaterial
          color={!dimmed ? color : '#1e293b'}
          emissive={!dimmed ? color : '#0f172a'}
          emissiveIntensity={0.4} metalness={0.4}
          roughness={0.2}
        />
      </Sphere>
      {!dimmed && (
        <Sphere ref={glowRef} args={glowArgs}>
          <meshBasicMaterial color={color} transparent opacity={0.15} depthWrite={false} />
        </Sphere>
      )}
      {(showLabel || highlighted) && <NodeLabel label={label} yOffset={finalSize + 0.15} />}
    </group>
  );
}
Node.propTypes = {
  label: PropTypes.string.isRequired, position: PropTypes.arrayOf(PropTypes.number).isRequired,
  color: PropTypes.string.isRequired, type: PropTypes.string, weight: PropTypes.number,
  nodeScale: PropTypes.number.isRequired, isActive: PropTypes.bool.isRequired,
  showLabel: PropTypes.bool.isRequired, skillActive: PropTypes.bool,
  nodeIndex: PropTypes.number.isRequired, onSelect: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired, dimmed: PropTypes.bool, highlighted: PropTypes.bool,
};

// ─── Edge (subtle curved lines) ───
function Edge({ start, end, weight, dimmed, highlighted, edgeColor, edgeType }) {
  const color = highlighted ? '#ffffff' : dimmed ? '#1e293b' : edgeColor;
  // Weight drives opacity and thickness — important edges are brighter and thicker
  const baseOpacity = { 'agent-model': 0.5, 'model-skill': 0.3, 'intra-category': 0.2, 'cross-category': 0.18, 'agent-memory': 0.25, 'memory-chain': 0.12 };
  const baseLw = { 'agent-model': 2.5, 'model-skill': 1.8, 'intra-category': 1.0, 'cross-category': 0.8, 'agent-memory': 1.2, 'memory-chain': 0.6 };
  const opacity = dimmed ? 0.03 : highlighted ? 0.85 : (baseOpacity[edgeType] || 0.15) + weight * 0.15;
  const lw = dimmed ? 0.3 : highlighted ? 2.5 : (baseLw[edgeType] || 0.8) + weight * 0.8;
  const mid = useMemo(() => {
    const mx = (start[0] + end[0]) / 2;
    const my = (start[1] + end[1]) / 2 + 0.15;
    const mz = (start[2] + end[2]) / 2;
    return [mx, my, mz];
  }, [start, end]);
  return (
    <QuadraticBezierLine start={start} end={end} mid={mid} color={color}
      lineWidth={lw} transparent opacity={opacity} dashed={false} />
  );
}
Edge.propTypes = {
  start: PropTypes.arrayOf(PropTypes.number).isRequired,
  end: PropTypes.arrayOf(PropTypes.number).isRequired,
  weight: PropTypes.number.isRequired,
  dimmed: PropTypes.bool, highlighted: PropTypes.bool, edgeColor: PropTypes.string,
  edgeType: PropTypes.string,
};

// ─── Camera Zoom ───
function CameraZoom({ target, controlsRef, isInteracting }) {
  const { camera } = useThree();
  const animRef = useRef(null);
  useEffect(() => {
    if (!target || isInteracting) { animRef.current = null; return; }
    const camTarget = new THREE.Vector3(target[0], target[1], target[2] + 2.5);
    const lookTarget = new THREE.Vector3(target[0], target[1], target[2]);
    animRef.current = { camTarget, lookTarget, progress: 0 };
  }, [target, isInteracting]);
  useFrame(() => {
    if (isInteracting || !animRef.current) return;
    const { camTarget, lookTarget } = animRef.current;
    animRef.current.progress = Math.min(1, animRef.current.progress + 0.04);
    const f = 1 - Math.pow(0.001, animRef.current.progress);
    camera.position.lerp(camTarget, f);
    if (controlsRef?.current) {
      controlsRef.current.target.lerp(lookTarget, f);
      controlsRef.current.update();
    }
    if (camera.position.distanceTo(camTarget) < 0.02) {
      camera.position.copy(camTarget);
      if (controlsRef?.current) { controlsRef.current.target.copy(lookTarget); controlsRef.current.update(); }
      animRef.current = null;
    }
  });
  return null;
}
CameraZoom.propTypes = {
  target: PropTypes.arrayOf(PropTypes.number),
  controlsRef: PropTypes.shape({ current: PropTypes.object }),
  isInteracting: PropTypes.bool.isRequired,
};

// ─── Edge positions helper ───
function useEdgePositions(nodes, edges) {
  return useMemo(() => {
    const nodeMap = {};
    nodes.forEach(n => { nodeMap[n.id] = n.position; });
    return edges.map(edge => ({
      ...edge,
      startPos: nodeMap[edge.source] || [0, 0, 0],
      endPos: nodeMap[edge.target] || [0, 0, 0]
    }));
  }, [nodes, edges]);
}

// ─── Category Label — large floating text for each category zone ───
const catEmojis = {
  agent: '🤖', model: '⚙️', seo: '🔍', browser: '🌐',
  memory: '🧠', infra: '🔧', business: '💼', finance: '💰',
  project: '📋', calendar: '📅', analytics: '📊', football: '⚽',
  media: '🎬', messaging: '💬', 'mem-data': '📁', inactive: '💤',
};

const catDisplayNames = {
  agent: 'AGENT', model: 'MODELS', seo: 'SEO', browser: 'BROWSER',
  memory: 'MEMORY', infra: 'INFRA', business: 'BUSINESS', finance: 'FINANCE',
  project: 'PROJECT', calendar: 'CALENDAR', analytics: 'ANALYTICS', football: 'FOOTBALL',
  media: 'MEDIA', messaging: 'MESSAGING', 'mem-data': 'KNOWLEDGE', inactive: 'INACTIVE',
};

function CategoryLabel({ position, category }) {
  const color = getCatColor(category);
  const name = catDisplayNames[category] || category.toUpperCase();
  const emoji = catEmojis[category] || '';
  return (
    <Billboard position={[position[0], position[1] + 1.0, position[2]]}>
      <Text fontSize={0.4} color={color} anchorX="center" anchorY="middle"
        outlineWidth={0.025} outlineColor="#020617" fontWeight="bold">
        {`${emoji}${name}`}
      </Text>
    </Billboard>
  );
}
CategoryLabel.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  category: PropTypes.string.isRequired,
};

// ─── Orbital Group — children rotate around Y axis ───
function OrbitalGroup({ speed = 0.05, children }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * speed;
    }
  });
  return <group ref={ref}>{children}</group>;
}
OrbitalGroup.propTypes = { speed: PropTypes.number, children: PropTypes.node };

// ─── Format number helper ───
function fmtNum(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
}

// ─── Main Scene ───
export function GraphScene({ graph, config, searchTerm, modelUsage }) {
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [legendOpen, setLegendOpen] = useState(false);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const controlsRef = useRef();
  const containerRef = useRef();

  const layoutNodes = useMemo(() => {
    const spread = config.spread ?? 1.5;
    return graph.nodes.map(node => ({
      ...node,
      position: [
        node.position[0] * spread,
        node.position[1] * spread,
        node.position[2] * spread,
      ],
    }));
  }, [graph.nodes, config.spread]);
  const edgesWithPos = useEdgePositions(layoutNodes, graph.edges);
  const focusEnabled = config.focusOnSelect ?? false;

  // Connected IDs
  const connectedIds = useMemo(() => {
    const focusId = hoveredId || selectedId;
    if (!focusId) return null;
    const ids = new Set([focusId]);
    graph.edges.forEach(e => {
      if (e.source === focusId) ids.add(e.target);
      if (e.target === focusId) ids.add(e.source);
    });
    return ids;
  }, [hoveredId, selectedId, graph.edges]);

  // Search
  const searchMatch = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return null;
    const term = searchTerm.toLowerCase();
    const ids = new Set();
    layoutNodes.forEach(n => {
      if (n.label.toLowerCase().includes(term) || (n.category && n.category.toLowerCase().includes(term)))
        ids.add(n.id);
    });
    return ids.size > 0 ? ids : null;
  }, [searchTerm, layoutNodes]);

  const activeFilter = searchMatch || connectedIds;

  const zoomTarget = useMemo(() => {
    if (!focusEnabled || !selectedId) return null;
    const node = layoutNodes.find(n => n.id === selectedId);
    return node ? node.position : null;
  }, [selectedId, layoutNodes, focusEnabled]);

  // Pre-compute unique colors per node — full spectrum, no duplicates
  const nodeColorMap = useMemo(() => {
    const total = layoutNodes.length;
    const map = {};
    layoutNodes.forEach((n, i) => {
      map[n.id] = getNodeColor(i, total, n.weight);
    });
    return map;
  }, [layoutNodes]);

  // Pre-compute unique edge colors — full spectrum offset from nodes
  const edgeColorMap = useMemo(() => {
    const total = edgesWithPos.length;
    return edgesWithPos.map((e, i) => getEdgeColorUnique(i, total, e.weight));
  }, [edgesWithPos]);

  // Split nodes into orbital layers
  const agentNodes = useMemo(() => layoutNodes.filter(n => n.type === 'agent'), [layoutNodes]);
  const modelNodes = useMemo(() => layoutNodes.filter(n => n.type === 'model'), [layoutNodes]);
  const skillNodes = useMemo(() => layoutNodes.filter(n => n.type === 'skill'), [layoutNodes]);
  const memoryNodes = useMemo(() => layoutNodes.filter(n => n.type === 'memory'), [layoutNodes]);

  // Compute category center positions for floating labels
  const categoryCenters = useMemo(() => {
    const groups = {};
    layoutNodes.forEach(n => {
      const cat = n.category || 'inactive';
      if (!groups[cat]) groups[cat] = { xs: [], ys: [], zs: [] };
      groups[cat].xs.push(n.position[0]);
      groups[cat].ys.push(n.position[1]);
      groups[cat].zs.push(n.position[2]);
    });
    return Object.entries(groups).map(([cat, g]) => ({
      category: cat,
      position: [
        g.xs.reduce((a, b) => a + b, 0) / g.xs.length,
        Math.max(...g.ys) + 0.3,
        g.zs.reduce((a, b) => a + b, 0) / g.zs.length,
      ],
    }));
  }, [layoutNodes]);

  // Hovered node data for tooltip
  const hoveredNodeData = useMemo(() => {
    if (!hoveredId) return null;
    return layoutNodes.find(n => n.id === hoveredId) || null;
  }, [hoveredId, layoutNodes]);

  // Selected node data for detail panel
  const selectedNodeData = useMemo(() => {
    if (!selectedId) return null;
    return layoutNodes.find(n => n.id === selectedId) || null;
  }, [selectedId, layoutNodes]);

  // Match selected model node to modelUsage data
  const selectedModelUsage = useMemo(() => {
    if (!selectedNodeData || selectedNodeData.type !== 'model' || !modelUsage) return null;
    // Try matching by label (display name)
    const byLabel = modelUsage.find(m => m.model === selectedNodeData.label);
    if (byLabel) return byLabel;
    // Try matching by modelId substring in node id
    return modelUsage.find(m => selectedNodeData.id.includes(m.modelId?.replace(/[^a-z0-9]/gi, '-'))) || null;
  }, [selectedNodeData, modelUsage]);

  // Unique categories present in the graph (for legend)
  const legendCategories = useMemo(() => {
    const cats = new Set();
    layoutNodes.forEach(n => cats.add(n.category || 'inactive'));
    return Array.from(cats).sort();
  }, [layoutNodes]);

  // Track mouse for tooltip
  const handlePointerMove = useCallback((e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setHoverPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, []);

  // Render helper for a node
  const renderNode = useCallback((node, idx) => {
          const isSelected = selectedId === node.id;
          const isHovered = hoveredId === node.id;
          const isConnected = activeFilter ? activeFilter.has(node.id) : true;
          const isDimmed = activeFilter ? !isConnected : false;
          const isHighlighted = isHovered || (isSelected && !activeFilter);
          const shouldShowLabel =
            (config.labelMode === 'always' && !activeFilter) ||
            (activeFilter && activeFilter.has(node.id)) ||
            (config.labelMode === 'hover' && isHovered && !activeFilter) ||
            (config.labelMode === 'click' && isSelected && !activeFilter) ||
            (searchMatch && searchMatch.has(node.id));
          const color = nodeColorMap[node.id] || '#475569';
          return (
            <Node key={node.id} {...node} color={color} nodeScale={config.nodeScale} nodeIndex={idx}
              isActive={shouldShowLabel} showLabel={shouldShowLabel}
              skillActive={node.active !== false} dimmed={isDimmed} highlighted={isHighlighted}
              onSelect={() => setSelectedId(prev => prev === node.id ? null : node.id)}
              onHover={(state) => setHoveredId(state ? node.id : null)}
            />
          );
  }, [selectedId, hoveredId, activeFilter, config.labelMode, config.nodeScale, searchMatch, nodeColorMap]);

  return (
    <>
      {/* Canvas container — responsive height */}
      <div
        ref={containerRef}
        className="h-[50vh] min-h-[400px] lg:h-[550px] rounded-2xl overflow-hidden border border-slate-700/60 relative"
        onPointerMove={handlePointerMove}
      >
        <Canvas camera={{ position: [0, 0, 28], fov: 65 }} onPointerMissed={() => setSelectedId(null)} performance={{ min: 0.5 }}>
          <color attach="background" args={["#020617"]} />
          <fog attach="fog" args={['#020617', 40, 120]} />
          <ambientLight intensity={0.35} />
          <pointLight position={[5, 4, 5]} intensity={0.5} color="#60a5fa" />
          <pointLight position={[-5, -3, -5]} intensity={0.4} color="#c084fc" />
          <pointLight position={[0, -5, 3]} intensity={0.3} color="#f472b6" />

          {/* Deep space background */}
          <Stars radius={200} depth={100} count={6000} factor={4} saturation={0.4} fade speed={0.2} />
          <Stars radius={80} depth={50} count={2000} factor={2} saturation={0.8} fade speed={0.1} />

          {/* Nebula sparkles */}
          <Sparkles count={400} scale={12} size={0.3} speed={0.08} noise={1.5} color="#a78bfa" />
          <Sparkles count={300} scale={18} size={0.2} speed={0.05} noise={2.0} color="#60a5fa" />
          <Sparkles count={200} scale={25} size={0.15} speed={0.03} noise={2.5} color="#f472b6" />

          <CameraZoom target={zoomTarget} controlsRef={controlsRef} isInteracting={isInteracting} />

          {/* Everything orbits together — agent included so edges stay connected */}
          <OrbitalGroup speed={0.04}>
            {agentNodes.map((node, idx) => renderNode(node, idx))}
            {modelNodes.map((node, idx) => renderNode(node, idx + agentNodes.length))}
            {skillNodes.map((node, idx) => renderNode(node, idx + agentNodes.length + modelNodes.length))}
            {memoryNodes.map((node, idx) => renderNode(node, idx + agentNodes.length + modelNodes.length + skillNodes.length))}

            {categoryCenters.map(c => (
              <CategoryLabel key={`cat-${c.category}`} position={c.position} category={c.category} />
            ))}

            {(config.showEdges !== false) && edgesWithPos.map((edge, idx) => {
              const isHighlighted = activeFilter && activeFilter.has(edge.source) && activeFilter.has(edge.target);
              const isDimmed = activeFilter && !isHighlighted;
              return (
                <Edge key={`${edge.source}-${edge.target}-${idx}`}
                  start={edge.startPos} end={edge.endPos}
                  weight={edge.weight} edgeColor={edgeColorMap[idx]} edgeType={edge.edgeType}
                  dimmed={isDimmed} highlighted={isHighlighted} />
              );
            })}
          </OrbitalGroup>

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            autoRotate={config.autoRotate}
            autoRotateSpeed={config.autoRotateSpeed}
            minDistance={1}
            maxDistance={80}
            onStart={() => setIsInteracting(true)}
            onEnd={() => setIsInteracting(false)}
          />
        </Canvas>

        {/* ── Tooltip overlay (hover) ── */}
        {hoveredNodeData && (
          <div
            className="absolute z-20 pointer-events-none px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-600/60 backdrop-blur-sm text-xs text-slate-200 shadow-lg max-w-[220px]"
            style={{
              left: Math.min(hoverPos.x + 14, (containerRef.current?.clientWidth || 300) - 230),
              top: Math.min(hoverPos.y - 10, (containerRef.current?.clientHeight || 300) - 100),
            }}
          >
            <div className="font-semibold text-white text-sm mb-1">{hoveredNodeData.label}</div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span>{catEmojis[hoveredNodeData.category] || '📦'}</span>
              <span style={{ color: getCatColor(hoveredNodeData.category) }}>{catDisplayNames[hoveredNodeData.category] || hoveredNodeData.category}</span>
            </div>
            <div className="text-slate-400">Type: <span className="text-slate-200">{hoveredNodeData.type}</span></div>
            <div className="text-slate-400">Weight: <span className="text-slate-200">{(hoveredNodeData.weight ?? 0).toFixed(2)}</span></div>
          </div>
        )}

        {/* ── Color Legend overlay (bottom-left) ── */}
        <div className="absolute bottom-2 left-2 z-10 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700/50 text-[10px]">
          <button onClick={() => setLegendOpen(!legendOpen)} className="flex items-center gap-1 px-3 py-1.5 w-full text-slate-300 hover:text-white text-left">
            <span>{legendOpen ? '▼' : '▶'}</span>
            <span className="font-medium text-[11px]">Legend</span>
          </button>
          {legendOpen && (
            <div className="px-3 pb-2 max-h-[160px] overflow-y-auto">
              {legendCategories.map(cat => (
                <div key={cat} className="flex items-center gap-1.5 py-0.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: getCatColor(cat) }} />
                  <span className="text-slate-300">{catEmojis[cat] || ''} {catDisplayNames[cat] || cat}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Panel (selected node) ── */}
      {selectedNodeData && (
        <div className="mt-3 rounded-xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-sm p-4 text-sm text-slate-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{catEmojis[selectedNodeData.category] || '📦'}</span>
              {selectedNodeData.label}
            </h3>
            <button onClick={() => setSelectedId(null)} className="text-slate-400 hover:text-white text-lg leading-none">✕</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/60 rounded-lg px-3 py-2">
              <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Category</div>
              <div className="font-medium" style={{ color: getCatColor(selectedNodeData.category) }}>
                {catDisplayNames[selectedNodeData.category] || selectedNodeData.category}
              </div>
            </div>
            <div className="bg-slate-800/60 rounded-lg px-3 py-2">
              <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Type</div>
              <div className="font-medium capitalize">{selectedNodeData.type}</div>
            </div>
            <div className="bg-slate-800/60 rounded-lg px-3 py-2">
              <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Weight</div>
              <div className="font-medium">{(selectedNodeData.weight ?? 0).toFixed(2)}</div>
            </div>
            <div className="bg-slate-800/60 rounded-lg px-3 py-2">
              <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">ID</div>
              <div className="font-mono text-[11px] text-slate-300 truncate">{selectedNodeData.id}</div>
            </div>
          </div>

          {/* Model Usage section — only for model nodes with matching usage data */}
          {selectedModelUsage && (
            <div className="mt-3 pt-3 border-t border-slate-700/40">
              <h4 className="text-xs uppercase tracking-wide text-slate-400 mb-2">📊 Token Usage</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                <div className="bg-slate-800/60 rounded-lg px-2.5 py-1.5">
                  <div className="text-[9px] uppercase text-slate-500">Calls</div>
                  <div className="text-sm font-semibold text-sky-400">{fmtNum(selectedModelUsage.calls)}</div>
                </div>
                <div className="bg-slate-800/60 rounded-lg px-2.5 py-1.5">
                  <div className="text-[9px] uppercase text-slate-500">Input</div>
                  <div className="text-sm font-semibold text-emerald-400">{fmtNum(selectedModelUsage.inputTokens)}</div>
                </div>
                <div className="bg-slate-800/60 rounded-lg px-2.5 py-1.5">
                  <div className="text-[9px] uppercase text-slate-500">Output</div>
                  <div className="text-sm font-semibold text-purple-400">{fmtNum(selectedModelUsage.outputTokens)}</div>
                </div>
                <div className="bg-slate-800/60 rounded-lg px-2.5 py-1.5">
                  <div className="text-[9px] uppercase text-slate-500">Cache Read</div>
                  <div className="text-sm font-semibold text-amber-400">{fmtNum(selectedModelUsage.cacheRead)}</div>
                </div>
                <div className="bg-slate-800/60 rounded-lg px-2.5 py-1.5">
                  <div className="text-[9px] uppercase text-slate-500">Total</div>
                  <div className="text-sm font-semibold text-white">{fmtNum(selectedModelUsage.totalTokens)}</div>
                </div>
                <div className="bg-slate-800/60 rounded-lg px-2.5 py-1.5">
                  <div className="text-[9px] uppercase text-slate-500">Cost</div>
                  <div className="text-sm font-semibold text-rose-400">${selectedModelUsage.cost?.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

GraphScene.propTypes = {
  graph: PropTypes.shape({
    nodes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired, label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired, position: PropTypes.arrayOf(PropTypes.number).isRequired
    })).isRequired,
    edges: PropTypes.arrayOf(PropTypes.shape({
      source: PropTypes.string.isRequired, target: PropTypes.string.isRequired,
      weight: PropTypes.number.isRequired
    })).isRequired
  }).isRequired,
  config: PropTypes.shape({
    nodeScale: PropTypes.number.isRequired, autoRotate: PropTypes.bool.isRequired,
    autoRotateSpeed: PropTypes.number.isRequired,
    labelMode: PropTypes.oneOf(['click', 'hover', 'always']).isRequired,
    focusOnSelect: PropTypes.bool.isRequired,
    spread: PropTypes.number,
    showEdges: PropTypes.bool,
  }).isRequired,
  searchTerm: PropTypes.string,
  modelUsage: PropTypes.array,
};
