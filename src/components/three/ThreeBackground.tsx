import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import ParticleField from './ParticleField';
import FloatingGeometry from './FloatingGeometry';

export default function ThreeBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#34d399" />
          <pointLight position={[-10, -10, -5]} intensity={0.3} color="#8b5cf6" />
          <ParticleField />
          <FloatingGeometry />
        </Suspense>
      </Canvas>
    </div>
  );
}
