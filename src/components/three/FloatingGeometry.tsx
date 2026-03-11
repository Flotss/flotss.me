import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

export default function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.003;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      wireRef.current.rotation.y += 0.003;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={[5, 0, -3]}>
        {/* Solid inner shape */}
        <mesh ref={meshRef}>
          <torusKnotGeometry args={[1, 0.35, 128, 32]} />
          <MeshDistortMaterial
            color="#10b981"
            emissive="#064e3b"
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={0.8}
            distort={0.2}
            speed={2}
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Wireframe overlay */}
        <mesh ref={wireRef}>
          <torusKnotGeometry args={[1, 0.35, 64, 16]} />
          <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.12} />
        </mesh>
      </group>
    </Float>
  );
}
