import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

interface CirclingParticle {
  angle: number;
  radius: number;
  speed: number;
  color: string;
  size: number;
}

interface CentralOctahedronProps {
  ideaCount: number;
}

const CirclingParticles: React.FC<{ particles: CirclingParticle[] }> = ({ particles }) => {
  const particlesRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, index) => {
        const particleData = particles[index];
        if (particleData) {
          // Update angle for rotation
          particleData.angle += particleData.speed;
          
          // Calculate position in circular orbit
          const x = Math.cos(particleData.angle) * particleData.radius;
          const z = Math.sin(particleData.angle) * particleData.radius;
          const y = Math.sin(particleData.angle * 2) * 0.2; // Add vertical wave motion
          
          particle.position.set(x, y, z);
        }
      });
    }
  });

  return (
    <group ref={particlesRef}>
      {particles.map((particle, index) => (
        <mesh key={index} position={[0, 0, 0]}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial 
            color={particle.color} 
            transparent 
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

const IcosahedronCore: React.FC = () => {
  const icosahedronRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (icosahedronRef.current) {
      // Slower rotation on mobile for better performance
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const rotationSpeed = isMobile ? 0.003 : 0.005;
      const pulseSpeed = isMobile ? 1.5 : 2;
      
      // Slow, steady rotation
      icosahedronRef.current.rotation.x += rotationSpeed;
      icosahedronRef.current.rotation.y += rotationSpeed * 2;
      
      // Gentle pulsing scale
      const scale = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.1;
      icosahedronRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={icosahedronRef}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial 
        color="#3b82f6" 
        wireframe 
        transparent 
        opacity={0.6}
      />
    </mesh>
  );
};

const CentralOctahedronScene: React.FC<CentralOctahedronProps> = ({ ideaCount }) => {
  // Generate particles based on idea count (limit for mobile performance)
  const particles = useMemo(() => {
    const particleArray: CirclingParticle[] = [];
    const maxParticles = typeof window !== 'undefined' && window.innerWidth < 768 ? 20 : ideaCount; // Limit particles on mobile
    const actualCount = Math.min(maxParticles, ideaCount);
    
    for (let i = 0; i < actualCount; i++) {
      particleArray.push({
        angle: (i / actualCount) * Math.PI * 2, // Evenly distribute around circle
        radius: 3 + Math.random() * 1, // Slightly randomize radius
        speed: 0.01 + Math.random() * 0.01, // Vary speed
        color: `hsl(${200 + Math.random() * 60}, 70%, ${60 + Math.random() * 30}%)`, // Blue spectrum
        size: 0.05 + Math.random() * 0.03, // Small particles
      });
    }
    
    return particleArray;
  }, [ideaCount]);

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      {/* Central icosahedron */}
      <IcosahedronCore />
      
      {/* Circling particles */}
      <CirclingParticles particles={particles} />
    </>
  );
};

const CentralOctahedron: React.FC<CentralOctahedronProps> = ({ ideaCount }) => {
  // Mobile detection for performance optimization
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      zIndex: 10,
      pointerEvents: 'none'
    }}>
      <Canvas 
        camera={{ position: [0, 2, 8], fov: 50 }} // Moved camera up (y: 0 -> 2)
        dpr={isMobile ? 1 : window.devicePixelRatio} // Limit pixel ratio on mobile
        performance={{ min: 0.5 }} // Allow lower framerates for performance
        gl={{ 
          antialias: !isMobile, // Disable antialiasing on mobile
          alpha: true,
          powerPreference: isMobile ? 'low-power' : 'high-performance'
        }}
      >
        <CentralOctahedronScene ideaCount={ideaCount} />
      </Canvas>
    </div>
  );
};

export default CentralOctahedron;
