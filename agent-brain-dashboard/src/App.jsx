import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Html } from '@react-three/drei'
import * as THREE from 'three'
import { MAIN_AGENTS_DATA, CATEGORIES_DATA } from './all-skills'

const API_BASE = '/api'

// Simplified skills for 3D (16 ตัวพอ)
const SKILLS_3D = [
  { name: 'clawhub', icon: '📦', color: '#00f0ff', category: 'CORE' },
  { name: 'discord', icon: '💬', color: '#ff00aa', category: 'COMM' },
  { name: 'notion', icon: '📓', color: '#00ff88', category: 'PRODUCTIVITY' },
  { name: 'spotify', icon: '🎵', color: '#ffaa00', category: 'MEDIA' },
  { name: 'canvas', icon: '🎨', color: '#aa00ff', category: 'DATA' },
  { name: 'browser', icon: '🌐', color: '#00f0ff', category: 'CORE' },
  { name: 'github', icon: '🐙', color: '#00ff88', category: 'PRODUCTIVITY' },
  { name: 'gemini', icon: '🧠', color: '#ffff00', category: 'CORE' },
  { name: 'cron', icon: '⏰', color: '#ff6600', category: 'HARDWARE' },
  { name: 'weather', icon: '🌤️', color: '#00f0ff', category: 'EXTERNAL' },
  { name: 'tmux', icon: '🖥️', color: '#aa00ff', category: 'DEV' },
  { name: 'nodes', icon: '📡', color: '#ff00aa', category: 'COMM' },
  { name: 'vision', icon: '👁️', color: '#00ff88', category: 'EXTERNAL' },
  { name: 'tts', icon: '🔊', color: '#ffaa00', category: 'MEDIA' },
  { name: 'web-search', icon: '🔍', color: '#00f0ff', category: 'EXTERNAL' },
  { name: 'memory', icon: '🧠', color: '#aa00ff', category: 'CORE' }
]

// Sun Component
function Sun() {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
  })
  
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.4} />
      </mesh>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#ff00aa" transparent opacity={0.2} wireframe />
      </mesh>
    </group>
  )
}

// Planet Component
function Planet({ agent, index, total }) {
  const groupRef = useRef()
  const orbitRadius = agent.active ? 3.5 : 2.5
  const orbitSpeed = 0.02 + (index * 0.005)
  
  useFrame((state) => {
    if (groupRef.current) {
      const angle = state.clock.elapsedTime * orbitSpeed + (index / total) * Math.PI * 2
      groupRef.current.position.x = Math.cos(angle) * orbitRadius
      groupRef.current.position.z = Math.sin(angle) * orbitRadius
    }
  })
  
  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={agent.color} emissive={agent.color} emissiveIntensity={agent.active ? 2 : 0.5} />
      </mesh>
      <Html position={[0, 0.4, 0]} center distanceFactor={10}>
        <div style={{ textAlign: 'center', color: agent.color, fontSize: '11px', fontWeight: 'bold', textShadow: `0 0 5px ${agent.color}` }}>
          {agent.name}
        </div>
      </Html>
    </group>
  )
}

// Moon/Skill Component
function Moon({ skill, index, total }) {
  const groupRef = useRef()
  const orbitRadius = 6 + (index % 4) * 0.8
  const orbitSpeed = 0.03 + (index * 0.008)
  const yOffset = Math.sin(index) * 0.5
  
  useFrame((state) => {
    if (groupRef.current) {
      const angle = state.clock.elapsedTime * orbitSpeed + (index / total) * Math.PI * 2
      groupRef.current.position.x = Math.cos(angle) * orbitRadius
      groupRef.current.position.z = Math.sin(angle) * orbitRadius
      groupRef.current.position.y = yOffset + Math.sin(state.clock.elapsedTime + index) * 0.2
    }
  })
  
  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color={skill.color} emissive={skill.color} emissiveIntensity={1} />
      </mesh>
      <Html position={[0, 0.2, 0]} center distanceFactor={15}>
        <div style={{ fontSize: '10px' }}>{skill.icon}</div>
      </Html>
    </group>
  )
}

// Connection Lines between Agents
function AgentConnections() {
  const lineRef = useRef()
  const positions = useMemo(() => {
    const pos = []
    for (let i = 0; i < MAIN_AGENTS_DATA.length; i++) {
      for (let j = i + 1; j < MAIN_AGENTS_DATA.length; j++) {
        pos.push({ from: i, to: j })
      }
    }
    return pos
  }, [])
  
  useFrame((state) => {
    if (!lineRef.current) return
    const points = []
    positions.forEach(({ from, to }) => {
      const a1 = state.clock.elapsedTime * (0.02 + from * 0.005) + (from / MAIN_AGENTS_DATA.length) * Math.PI * 2
      const r1 = MAIN_AGENTS_DATA[from].active ? 3.5 : 2.5
      const x1 = Math.cos(a1) * r1
      const z1 = Math.sin(a1) * r1
      
      const a2 = state.clock.elapsedTime * (0.02 + to * 0.005) + (to / MAIN_AGENTS_DATA.length) * Math.PI * 2
      const r2 = MAIN_AGENTS_DATA[to].active ? 3.5 : 2.5
      const x2 = Math.cos(a2) * r2
      const z2 = Math.sin(a2) * r2
      
      points.push(new THREE.Vector3(x1, 0, z1))
      points.push(new THREE.Vector3(x2, 0, z2))
    })
    lineRef.current.geometry.setFromPoints(points)
  })
  
  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color="#00f0ff" transparent opacity={0.3} />
    </line>
  )
}

// Scene
function Scene({ showSkills }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />
      <Stars radius={100} depth={50} count={300} factor={4} fade />
      
      <Sun />
      
      <AgentConnections />
      
      {MAIN_AGENTS_DATA.map((agent, i) => <Planet key={agent.name} agent={agent} index={i} total={MAIN_AGENTS_DATA.length} />)}
      
      {showSkills && SKILLS_3D.map((skill, i) => <Moon key={skill.name} skill={skill} index={i} total={SKILLS_3D.length} />)}
      
      <OrbitControls enableZoom={true} enablePan={true} autoRotate={false} minDistance={5} maxDistance={30} />
    </>
  )
}

function App() {
  const [showSkills, setShowSkills] = useState(true)
  const [showModelPanel, setShowModelPanel] = useState(true)
  const [showAgentsPanel, setShowAgentsPanel] = useState(true)
  const [showStats, setShowStats] = useState(true)
  const [modelStats, setModelStats] = useState({ 
    current: 'claude-opus-4-6', 
    provider: 'google-antigravity',
    tokens: { in: 0, out: 0 }, 
    cache: '0%',
    fallback: 'kimi-k2p5'
  })
  
  useEffect(() => {
    fetch(`${API_BASE}/models`).then(r => r.json()).then(setModelStats).catch(() => {})
  }, [])
  
  const activeCount = useMemo(() => MAIN_AGENTS_DATA.filter(a => a.active).length, [])
  const totalTokens = useMemo(() => (modelStats.tokens?.in || 0) + (modelStats.tokens?.out || 0), [modelStats])
  
  return (
    <div className="h-screen w-screen bg-[#000005] relative overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-3 flex justify-between items-center glass">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#ff00aa] flex items-center justify-center text-xl">☀️</div>
          <div>
            <h1 className="text-lg font-bold text-[#00f0ff]">OPENCLAW 3D</h1>
            <p className="text-xs text-gray-400">{MAIN_AGENTS_DATA.length} Planets | {showSkills ? SKILLS_3D.length : 0} Moons | Three.js</p>
          </div>
        </div>
        <nav className="flex gap-2">
          <button onClick={() => setShowSkills(!showSkills)} className={`px-3 py-2 rounded text-xs font-bold ${showSkills ? 'bg-[#00ff88] text-black' : 'bg-[#1a1a2e] text-[#00ff88] border border-[#00ff88]'}`}>🌙 Moons</button>
          <button onClick={() => setShowModelPanel(!showModelPanel)} className={`px-3 py-2 rounded text-xs font-bold ${showModelPanel ? 'bg-[#ff00aa] text-black' : 'bg-[#1a1a2e] text-[#ff00aa] border border-[#ff00aa]'}`}>🧠 Model</button>
          <button onClick={() => setShowAgentsPanel(!showAgentsPanel)} className={`px-3 py-2 rounded text-xs font-bold ${showAgentsPanel ? 'bg-[#00f0ff] text-black' : 'bg-[#1a1a2e] text-[#00f0ff] border border-[#00f0ff]'}`}>🪐 Agents</button>
          <button onClick={() => setShowStats(!showStats)} className={`px-3 py-2 rounded text-xs font-bold ${showStats ? 'bg-[#ffff00] text-black' : 'bg-[#1a1a2e] text-[#ffff00] border border-[#ffff00]'}`}>📊 Stats</button>
        </nav>
      </header>

      {/* 3D Canvas */}
      <div className="absolute inset-0 pt-16 pb-24">
        <Canvas camera={{ position: [0, 8, 18], fov: 55 }}>
          <Scene showSkills={showSkills} />
        </Canvas>
      </div>

      {/* Left Panel */}
      {showAgentsPanel && (
        <aside className="absolute left-4 top-20 w-56 glass rounded-lg p-4 z-40 max-h-[60vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[#00f0ff] font-bold text-sm">🪐 AGENTS ({MAIN_AGENTS_DATA.length})</h2>
            <button onClick={() => setShowAgentsPanel(false)} className="text-gray-400">✕</button>
          </div>
          <div className="space-y-2">
            {MAIN_AGENTS_DATA.map(agent => (
              <div key={agent.name} className="flex items-center justify-between p-2 rounded text-xs" style={{ backgroundColor: agent.color + '20', borderLeft: `3px solid ${agent.color}` }}>
                <div>
                  <div className="font-bold" style={{ color: agent.color }}>{agent.name}</div>
                  <div className="text-gray-400 text-[10px]">{agent.role}</div>
                </div>
                <span className={agent.active ? 'text-green-400' : 'text-gray-600'}>{agent.active ? '●' : '○'}</span>
              </div>
            ))}
          </div>
        </aside>
      )}

      {/* Right Panel */}
      {showModelPanel && (
        <aside className="absolute right-4 top-20 w-56 glass rounded-lg p-4 z-40">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[#ff00aa] font-bold text-sm">🧠 MODEL USAGE</h2>
            <button onClick={() => setShowModelPanel(false)} className="text-gray-400">✕</button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-gray-400">Current:</span><span className="text-[#00f0ff] font-bold">{modelStats.current}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Tokens:</span><span className="text-[#ffff00]">{totalTokens.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Cache:</span><span className="text-[#aa00ff]">{modelStats.cache}</span></div>
          </div>
        </aside>
      )}

      {/* Bottom Stats */}
      {showStats && (
        <footer className="absolute bottom-4 left-4 right-4 glass rounded-lg p-3 z-40">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-gray-400 text-xs">📊 SYSTEM STATS</span>
            <button onClick={() => setShowStats(false)} className="text-gray-400 text-xs">✕</button>
          </div>
          <div className="grid grid-cols-5 gap-4 text-center">
            <div><div className="text-xl font-bold text-[#ffff00]">☀️</div><div className="text-[10px] text-gray-400">Core</div></div>
            <div><div className="text-xl font-bold text-[#00f0ff]">{MAIN_AGENTS_DATA.length}</div><div className="text-[10px] text-gray-400">Planets</div></div>
            <div><div className="text-xl font-bold text-[#ff00aa]">{showSkills ? SKILLS_3D.length : 0}</div><div className="text-[10px] text-gray-400">Moons</div></div>
            <div><div className="text-xl font-bold text-[#00ff88]">{activeCount}</div><div className="text-[10px] text-gray-400">Active</div></div>
            <div><div className="text-lg font-bold text-[#aa00ff]">{totalTokens > 1000 ? (totalTokens/1000).toFixed(1) + 'k' : totalTokens}</div><div className="text-[10px] text-gray-400">Tokens</div></div>
          </div>
        </footer>
      )}

      {/* Categories */}
      <div className="absolute bottom-20 left-4 right-4 z-40">
        <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
          {CATEGORIES_DATA.slice(0, 6).map(cat => (
            <div key={cat.name} className="flex-shrink-0 glass rounded-lg px-3 py-2 text-xs font-bold" style={{ color: cat.color, border: `1px solid ${cat.color}` }}>
              {cat.emoji} {cat.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
