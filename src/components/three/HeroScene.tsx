import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshTransmissionMaterial } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

function GlowingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
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
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.9}
          distort={0.3}
          speed={3}
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
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={2.5}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.08} />
      </mesh>
    </Float>
  );
}

function OrbitingRings() {
  const group1 = useRef<THREE.Group>(null);
  const group2 = useRef<THREE.Group>(null);
  const group3 = useRef<THREE.Group>(null);

  useFrame((state) => {
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
          <torusGeometry args={[2.8, 0.01, 16, 100]} />
          <meshBasicMaterial color="#34d399" transparent opacity={0.2} />
        </mesh>
      </group>
      <group ref={group2}>
        <mesh>
          <torusGeometry args={[3.2, 0.008, 16, 100]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.15} />
        </mesh>
      </group>
      <group ref={group3}>
        <mesh>
          <torusGeometry args={[3.6, 0.006, 16, 100]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.1} />
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
      const x = (state.pointer.x * viewport.width) / 2;
      const y = (state.pointer.y * viewport.height) / 2;
      meshRef.current.position.x += (x * 0.3 - meshRef.current.position.x) * 0.05;
      meshRef.current.position.y += (y * 0.3 - meshRef.current.position.y) * 0.05;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} scale={0.3}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#a78bfa" wireframe transparent opacity={0.3} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', pointerEvents: 'auto' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={0.8} color="#34d399" />
          <pointLight position={[-5, -5, 5]} intensity={0.4} color="#8b5cf6" />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={0.5}
            color="#06b6d4"
          />
          <GlowingSphere />
          <WireframeIcosahedron />
          <OrbitingRings />
          <MouseFollower />
        </Suspense>
      </Canvas>
    </div>
  );
}
