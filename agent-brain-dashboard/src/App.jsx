import React, { useState, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Sparkles, Float } from '@react-three/drei'
import * as THREE from 'three'

// Neural Node Component
function NeuralNode({ position, color, size = 0.3, pulse = true }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current && pulse) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2)
    }
  })
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

// Neural Connection Component
function NeuralConnection({ start, end, color }) {
  const points = useMemo(() => {
    const curve = new THREE.LineCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...end)
    )
    return curve.getPoints(20)
  }, [start, end])
  
  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [points])
  
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={color} transparent opacity={0.4} />
    </line>
  )
}

// Brain Core Component
function BrainCore() {
  const groupRef = useRef()
  
  // Generate neural nodes
  const nodes = useMemo(() => {
    const result = []
    const colors = ['#00f0ff', '#ff00aa', '#00ff88', '#ffaa00', '#aa00ff']
    
    // Central brain nodes
    for (let i = 0; i < 20; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2 + Math.random() * 2
      
      result.push({
        position: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        ],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 0.1 + Math.random() * 0.2
      })
    }
    
    // Inner core
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      result.push({
        position: [Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0],
        color: '#00f0ff',
        size: 0.4
      })
    }
    
    return result
  }, [])
  
  // Generate connections
  const connections = useMemo(() => {
    const result = []
    const colors = ['#00f0ff', '#ff00aa', '#00ff88']
    
    for (let i = 0; i < 30; i++) {
      const startNode = nodes[Math.floor(Math.random() * nodes.length)]
      const endNode = nodes[Math.floor(Math.random() * nodes.length)]
      
      if (startNode !== endNode) {
        result.push({
          start: startNode.position,
          end: endNode.position,
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }
    }
    return result
  }, [nodes])
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
    }
  })
  
  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <NeuralNode key={i} {...node} />
      ))}
      {connections.map((conn, i) => (
        <NeuralConnection key={i} {...conn} />
      ))}
    </group>
  )
}

// Agent Nodes Ring
function AgentRing() {
  const agents = [
    { name: 'APEX', role: 'CEO', color: '#00f0ff' },
    { name: 'PULSE', role: 'CMO', color: '#ff00aa' },
    { name: 'AURA', role: 'CSO', color: '#00ff88' },
    { name: 'STAT', role: 'CAO', color: '#ffaa00' },
    { name: 'LEDGER', role: 'CFO', color: '#aa00ff' },
    { name: 'NEXUS', role: 'COO', color: '#00ffaa' },
    { name: 'CIPHER', role: 'CIO', color: '#ffaa00' },
    { name: 'SYNC', role: 'CHRO', color: '#aa00ff' }
  ]
  
  return (
    <group>
      {agents.map((agent, i) => {
        const angle = (i / agents.length) * Math.PI * 2
        const radius = 8
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        return (
          <Float key={agent.name} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={[x, 0, z]}>
              <mesh>
                <octahedronGeometry args={[0.5, 0]} />
                <meshStandardMaterial 
                  color={agent.color}
                  emissive={agent.color}
                  emissiveIntensity={0.8}
                  wireframe
                />
              </mesh>
            </group>
          </Float>
        )
      })}
    </group>
  )
}

// Main 3D Scene
function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00aa" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={20} size={2} speed={0.4} color="#00f0ff" />
      
      <BrainCore />
      <AgentRing />
      
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        autoRotate
        autoRotateSpeed={0.5}
        minDistance={5}
        maxDistance={30}
      />
    </>
  )
}

// Stats Card Component
function StatCard({ label, value, color, icon }) {
  return (
    <div className={`glass rounded-xl p-4 ${color === 'cyan' ? 'glow-cyan' : color === 'pink' ? 'glow-pink' : 'glow-green'}`}>
      <div className="text-3xl mb-1">{icon}</div>
      <div className="text-4xl font-bold title" style={{ color: color === 'cyan' ? '#00f0ff' : color === 'pink' ? '#ff00aa' : '#00ff88' }}>
        {value}
      </div>
      <div className="text-gray-400 text-sm uppercase tracking-wider">{label}</div>
    </div>
  )
}

// Main App
function App() {
  const [activeTab, setActiveTab] = useState('brain')
  
  return (
    <div className="h-screen w-screen bg-[#0a0a0f] relative overflow-hidden scanline">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center glass">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#ff00aa] flex items-center justify-center">
            <span className="text-2xl">🧠</span>
          </div>
          <div>
            <h1 className="text-2xl title text-[#00f0ff]">AGENT BRAIN</h1>
            <p className="text-xs text-gray-400">Neural Network Dashboard v1.0</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="glass rounded-lg px-4 py-2">
            <span className="text-[#00ff88]">●</span> <span className="text-sm">System Online</span>
          </div>
          <div className="glass rounded-lg px-4 py-2">
            <span className="text-[#00f0ff]">8</span> <span className="text-sm text-gray-400">Agents Active</span>
          </div>
        </div>
      </div>
      
      {/* 3D Canvas */}
      <div className="absolute inset-0 pt-20">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <Scene />
        </Canvas>
      </div>
      
      {/* Stats Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Neural Nodes" value="128" color="cyan" icon="🔮" />
          <StatCard label="Active Agents" value="8" color="pink" icon="🤖" />
          <StatCard label="Connections" value="2.4K" color="green" icon="🔗" />
          <StatCard label="Memory Usage" value="84%" color="cyan" icon="💾" />
        </div>
      </div>
      
      {/* Side Panel */}
      <div className="absolute right-4 top-24 bottom-24 w-72 glass rounded-xl p-4 overflow-y-auto">
        <h3 className="title text-[#00f0ff] mb-4">AGENT STATUS</h3>
        
        {[
          { name: 'APEX', role: 'CEO', status: 'active', color: '#00f0ff' },
          { name: 'PULSE', role: 'CMO', status: 'active', color: '#ff00aa' },
          { name: 'AURA', role: 'CSO', status: 'idle', color: '#00ff88' },
          { name: 'STAT', role: 'CAO', status: 'active', color: '#ffaa00' },
          { name: 'LEDGER', role: 'CFO', status: 'idle', color: '#aa00ff' },
          { name: 'NEXUS', role: 'COO', status: 'active', color: '#00ffaa' },
          { name: 'CIPHER', role: 'CIO', status: 'active', color: '#ffaa00' },
          { name: 'SYNC', role: 'CHRO', status: 'idle', color: '#aa00ff' }
        ].map(agent => (
          <div key={agent.name} className="flex items-center justify-between p-3 mb-2 rounded-lg bg-[#0a0a15]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: agent.status === 'active' ? '#00ff88' : '#666' }} />
              <div>
                <div className="font-bold text-sm" style={{ color: agent.color }}>{agent.name}</div>
                <div className="text-xs text-gray-500">{agent.role}</div>
              </div>
            </div>
            <div className="text-xs text-gray-400 uppercase">{agent.status}</div>
          </div>
        ))}
      </div>
      
      {/* Controls */}
      <div className="absolute left-4 top-24 w-48 glass rounded-xl p-4">
        <h3 className="title text-[#00f0ff] mb-4">CONTROLS</h3>
        
        <div className="space-y-2">
          <button className="w-full py-2 px-4 rounded-lg bg-[#00f0ff] text-black font-bold hover:opacity-80 transition">
            Auto Rotate
          </button>
          <button className="w-full py-2 px-4 rounded-lg bg-[#1a1a2e] text-[#00f0ff] border border-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition">
            Reset View
          </button>
          <button className="w-full py-2 px-4 rounded-lg bg-[#1a1a2e] text-[#ff00aa] border border-[#ff00aa] hover:bg-[#ff00aa] hover:text-black transition">
            Pulse All
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
