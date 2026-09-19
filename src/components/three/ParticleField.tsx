import { useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const CONNECTION_DISTANCE = 2.5;
const MOUSE_INFLUENCE = 2.8;
const MOUSE_RADIUS = 4.5;

export default function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mouseRef = useRef(new THREE.Vector3(0, 0, 0));
  const { viewport } = useThree();

  const isMobile = useMemo(
    () => typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window),
    [],
  );

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  // Dynamic particle count: 85 on mobile to eliminate CPU/battery throttle, 175 on desktop
  const particleCount = useMemo(() => (isMobile ? 85 : 175), [isMobile]);

  const { positions, velocities, particleColors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      velocities[i * 3] = (Math.random() - 0.5) * 0.008;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.004;

      const t = Math.random();
      if (t < 0.45) {
        // Emerald primary
        particleColors[i * 3] = 0.1;
        particleColors[i * 3 + 1] = 0.8;
        particleColors[i * 3 + 2] = 0.5;
      } else if (t < 0.75) {
        // Soft mint
        particleColors[i * 3] = 0.2;
        particleColors[i * 3 + 1] = 0.85;
        particleColors[i * 3 + 2] = 0.65;
      } else {
        // Subtle neutral
        particleColors[i * 3] = 0.65;
        particleColors[i * 3 + 1] = 0.7;
        particleColors[i * 3 + 2] = 0.65;
      }
    }
    return { positions, velocities, particleColors };
  }, [particleCount]);

  const maxLines = useMemo(() => particleCount * 18, [particleCount]);
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);
  const lineColors = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);

  // Build geometries imperatively
  const pointsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    return geo;
  }, [positions, particleColors]);

  const linesGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    geo.setDrawRange(0, 0);
    return geo;
  }, [linePositions, lineColors]);

  const pointsMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: isMobile ? 0.05 : 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
      }),
    [isMobile],
  );

  const linesMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.28,
      }),
    [],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (isMobile) return;
      mouseRef.current.x = ((e.clientX / window.innerWidth) * 2 - 1) * (viewport.width / 2);
      mouseRef.current.y = (-(e.clientY / window.innerHeight) * 2 + 1) * (viewport.height / 2);
    },
    [viewport, isMobile],
  );

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [onPointerMove, isMobile]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !linesRef.current) return;
    // Energy saver: pause physics when browser tab is inactive
    if (typeof document !== 'undefined' && document.hidden) return;

    const pos = positions;
    const clampedDelta = Math.min(delta, 0.08);

    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      if (!prefersReducedMotion && !isMobile) {
        const dx = pos[ix] - mouseRef.current.x;
        const dy = pos[iy] - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0.01) {
          const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * MOUSE_INFLUENCE * clampedDelta;
          velocities[ix] += (dx / dist) * force;
          velocities[iy] += (dy / dist) * force;
        }
      }

      velocities[ix] *= 0.98;
      velocities[iy] *= 0.98;
      velocities[iz] *= 0.98;

      pos[ix] += velocities[ix];
      pos[iy] += velocities[iy];
      pos[iz] += velocities[iz];

      if (pos[ix] > 12) pos[ix] = -12;
      if (pos[ix] < -12) pos[ix] = 12;
      if (pos[iy] > 9) pos[iy] = -9;
      if (pos[iy] < -9) pos[iy] = 9;
      if (pos[iz] > 6) pos[iz] = -6;
      if (pos[iz] < -6) pos[iz] = 6;
    }

    pointsGeo.attributes.position.needsUpdate = true;

    let lineIndex = 0;
    for (let i = 0; i < particleCount && lineIndex < maxLines; i++) {
      for (let j = i + 1; j < particleCount && lineIndex < maxLines; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < CONNECTION_DISTANCE) {
          const alpha = 1 - dist / CONNECTION_DISTANCE;
          const li = lineIndex * 6;

          linePositions[li] = pos[i * 3];
          linePositions[li + 1] = pos[i * 3 + 1];
          linePositions[li + 2] = pos[i * 3 + 2];
          linePositions[li + 3] = pos[j * 3];
          linePositions[li + 4] = pos[j * 3 + 1];
          linePositions[li + 5] = pos[j * 3 + 2];

          lineColors[li] = 0.18 * alpha;
          lineColors[li + 1] = 0.85 * alpha;
          lineColors[li + 2] = 0.55 * alpha;
          lineColors[li + 3] = 0.18 * alpha;
          lineColors[li + 4] = 0.85 * alpha;
          lineColors[li + 5] = 0.55 * alpha;

          lineIndex++;
        }
      }
    }

    linesGeo.setDrawRange(0, lineIndex * 2);
    linesGeo.attributes.position.needsUpdate = true;
    linesGeo.attributes.color.needsUpdate = true;
  });

  return (
    <>
      <points ref={pointsRef} geometry={pointsGeo} material={pointsMat} />
      <lineSegments ref={linesRef} geometry={linesGeo} material={linesMat} />
    </>
  );
}
