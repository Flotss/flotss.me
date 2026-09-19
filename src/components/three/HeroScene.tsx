import { Float, MeshDistortMaterial } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { Suspense, useRef } from 'react';
import * as THREE from 'three';

function InteractiveParallax({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (typeof document !== 'undefined' && document.hidden) return;

    // Smooth spring-like lerp following normalized pointer (-1 to +1)
    const targetX = state.pointer.x * 0.45;
    const targetY = state.pointer.y * 0.3;
    const targetRotY = state.pointer.x * 0.35;
    const targetRotX = -state.pointer.y * 0.25;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.04);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.04);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      0.04,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      0.04,
    );
  });

  return <group ref={groupRef}>{children}</group>;
}

function GlowingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      if (typeof document !== 'undefined' && document.hidden) return;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.8, 1]} />
        <MeshDistortMaterial
          color="#10b981"
          emissive="#059669"
          emissiveIntensity={0.65}
          roughness={0.1}
          metalness={0.9}
          distort={0.32}
          speed={2.8}
          transparent
          opacity={0.25}
        />
      </mesh>
    </Float>
  );
}

function WireframeIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      if (typeof document !== 'undefined' && document.hidden) return;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.04;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} scale={2.5}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.09} />
      </mesh>
    </Float>
  );
}

function OrbitingRings() {
  const group1 = useRef<THREE.Group>(null);
  const group2 = useRef<THREE.Group>(null);
  const group3 = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const t = state.clock.elapsedTime;
    if (group1.current) {
      group1.current.rotation.x = t * 0.2;
      group1.current.rotation.y = t * 0.1;
    }
    if (group2.current) {
      group2.current.rotation.x = t * 0.15 + 1;
      group2.current.rotation.z = t * 0.1;
    }
    if (group3.current) {
      group3.current.rotation.y = t * 0.12;
      group3.current.rotation.z = t * 0.08 + 2;
    }
  });

  return (
    <>
      <group ref={group1}>
        <mesh>
          <torusGeometry args={[2.8, 0.012, 16, 100]} />
          <meshBasicMaterial color="#34d399" transparent opacity={0.22} />
        </mesh>
      </group>
      <group ref={group2}>
        <mesh>
          <torusGeometry args={[3.2, 0.009, 16, 100]} />
          <meshBasicMaterial color="#6ee7b7" transparent opacity={0.16} />
        </mesh>
      </group>
      <group ref={group3}>
        <mesh>
          <torusGeometry args={[3.6, 0.007, 16, 100]} />
          <meshBasicMaterial color="#a7f3d0" transparent opacity={0.11} />
        </mesh>
      </group>
    </>
  );
}

function MouseFollower() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      if (typeof document !== 'undefined' && document.hidden) return;
      const x = (state.pointer.x * viewport.width) / 2;
      const y = (state.pointer.y * viewport.height) / 2;
      meshRef.current.position.x += (x * 0.35 - meshRef.current.position.x) * 0.06;
      meshRef.current.position.y += (y * 0.35 - meshRef.current.position.y) * 0.06;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.6;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <mesh ref={meshRef} scale={0.32}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.28} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent', pointerEvents: 'auto' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={0.8} color="#34d399" />
          <pointLight position={[-5, -5, 5]} intensity={0.35} color="#10b981" />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={0.45}
            color="#34d399"
          />
          <InteractiveParallax>
            <GlowingSphere />
            <WireframeIcosahedron />
            <OrbitingRings />
          </InteractiveParallax>
          <MouseFollower />
        </Suspense>
      </Canvas>
    </div>
  );
}
