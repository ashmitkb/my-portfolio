import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { scrollState } from './scrollState';

const RANGE = 13;

// small deterministic PRNG so the layout is stable between renders
const rng = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const shapes = ['icosa', 'torus', 'sphere', 'octa', 'knot'];

export default function Floaters({ count = 12, still = false }) {
  const refs = useRef([]);
  const items = useMemo(() => {
    const r = rng(42);
    return Array.from({ length: count }, (_, i) => ({
      shape: shapes[i % shapes.length],
      x: (r() - 0.5) * 15,
      y: r() * RANGE,
      z: -2 - r() * 6,
      s: 0.35 + r() * 0.65,
      speed: 0.0016 + r() * 0.0026,
      spin: (r() - 0.5) * 0.6,
      tint: ['#ffb3a3', '#9fc8ff', '#c9b8ff', '#9fe6d6'][i % 4],
    }));
  }, [count]);

  useFrame((state) => {
    const t = still ? 0 : state.clock.elapsedTime;
    items.forEach((it, i) => {
      const m = refs.current[i];
      if (!m) return;
      const y = (((it.y + scrollState.y * it.speed) % RANGE) + RANGE) % RANGE;
      m.position.set(it.x + Math.sin(t * 0.3 + i) * 0.3, y - RANGE / 2, it.z);
      m.rotation.set(t * it.spin + i, t * it.spin * 0.8, 0);
    });
  });

  return items.map((it, i) => (
    <mesh key={i} ref={(el) => (refs.current[i] = el)} scale={it.s}>
      {it.shape === 'icosa' && <icosahedronGeometry args={[1, 0]} />}
      {it.shape === 'torus' && <torusGeometry args={[0.8, 0.32, 24, 48]} />}
      {it.shape === 'sphere' && <sphereGeometry args={[0.9, 48, 48]} />}
      {it.shape === 'octa' && <octahedronGeometry args={[1, 0]} />}
      {it.shape === 'knot' && <torusKnotGeometry args={[0.6, 0.22, 96, 16]} />}
      <meshPhysicalMaterial
        color={it.tint}
        transmission={1}
        thickness={1.2}
        ior={1.5}
        roughness={0.06}
        dispersion={6}
        attenuationColor={it.tint}
        attenuationDistance={2}
        envMapIntensity={1.5}
      />
    </mesh>
  ));
}
