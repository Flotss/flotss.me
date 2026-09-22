import { Canvas, useFrame, useThree } from '@react-three/fiber';
import Router from 'next/router';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import FloatingGeometry from './FloatingGeometry';
import ParticleField from './ParticleField';

function CameraRig() {
  const { camera } = useThree();
  const targetZ = useRef(8);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleStart = () => {
      clearTimeout(timeoutId);
      // Dive forward on navigation
      targetZ.current = 4.6;
    };

    const handleComplete = () => {
      clearTimeout(timeoutId);
      // Smooth return to default distance after transition
      timeoutId = setTimeout(() => {
        targetZ.current = 8;
      }, 350);
    };

    Router.events.on('routeChangeStart', handleStart);
    Router.events.on('routeChangeComplete', handleComplete);
    Router.events.on('routeChangeError', handleComplete);

    return () => {
      clearTimeout(timeoutId);
      Router.events.off('routeChangeStart', handleStart);
      Router.events.off('routeChangeComplete', handleComplete);
      Router.events.off('routeChangeError', handleComplete);
    };
  }, []);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.1);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, clampedDelta * 7);
  });

  return null;
}

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
          <CameraRig />
          <ParticleField />
          <FloatingGeometry />
        </Suspense>
      </Canvas>
    </div>
  );
}
