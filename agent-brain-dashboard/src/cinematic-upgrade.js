// Cinematic Brain Visualization Component
// This file contains the enhanced visual effects

import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

// Generate high-density random nodes
export const generateDenseNodes = (baseNodes, count = 200) => {
  const categories = ['NEURAL', 'DATA', 'FLOW', 'SIGNAL', 'MEMORY'];
  const newNodes = [...baseNodes];
  
  for (let i = 0; i < count; i++) {
    const group = Math.floor(Math.random() * 10) + 5;
    newNodes.push({
      id: `neural_${i}`,
      group,
      label: `Node ${i}`,
      desc: `Neural pathway ${i}`,
      val: Math.random() * 8 + 4,
      category: categories[Math.floor(Math.random() * categories.length)]
    });
  }
  
  return newNodes;
};

// Generate dense links for brain structure
export const generateDenseLinks = (nodes) => {
  const links = [];
  const coreNodes = nodes.filter(n => n.group <= 1);
  
  // Connect neural nodes to core
  nodes.filter(n => n.id.startsWith('neural_')).forEach((node, i) => {
    const targetCore = coreNodes[Math.floor(Math.random() * coreNodes.length)];
    links.push({ source: node.id, target: targetCore.id });
    
    // Connect to nearby neural nodes
    if (i > 0 && Math.random() > 0.7) {
      links.push({ 
        source: node.id, 
        target: `neural_${Math.floor(Math.random() * i)}` 
      });
    }
  });
  
  return links;
};

// Space Dust Particles Component
export const SpaceDust = ({ count = 1000 }) => {
  const points = useRef();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;
    }
    return positions;
  }, [count]);
  
  useEffect(() => {
    if (!points.current) return;
    const animate = () => {
      if (points.current) {
        points.current.rotation.y += 0.0002;
        points.current.rotation.x += 0.0001;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#4488ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Enhanced glowing node with aura layers
export const createNeonNode = (node, size, glowIntensity, colors) => {
  const group = new THREE.Group();
  const color = colors[node.group] || '#ffffff';
  
  // Core sphere - high emissive
  const coreGeometry = new THREE.SphereGeometry(size * 0.4, 32, 32);
  const coreMaterial = new THREE.MeshStandardMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: glowIntensity * 2,
    roughness: 0.2,
    metalness: 0.8
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  group.add(core);
  
  // Inner aura
  const innerGlow = new THREE.Mesh(
    new THREE.SphereGeometry(size * 0.7, 32, 32),
    new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3
    })
  );
  group.add(innerGlow);
  
  // Outer aura - atmospheric
  const outerGlow = new THREE.Mesh(
    new THREE.SphereGeometry(size * 1.2, 32, 32),
    new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.1
    })
  );
  group.add(outerGlow);
  
  // Halo ring
  const ringGeometry = new THREE.RingGeometry(size * 1.5, size * 1.6, 32);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.lookAt(0, 0, 1);
  group.add(ring);
  
  return group;
};

// Brain structure physics configuration
export const brainPhysics = {
  charge: -80,
  centerStrength: 0.08,
  velocityDecay: 0.4,
  alphaDecay: 0.02,
  warmupTicks: 100,
  cooldownTicks: 200
};

// Neural pulse configuration
export const neuralPulseConfig = {
  linkDirectionalParticles: 4,
  linkDirectionalParticleSpeed: 0.02,
  linkDirectionalParticleWidth: 2,
  linkDirectionalParticleColor: () => '#00ffff'
};

