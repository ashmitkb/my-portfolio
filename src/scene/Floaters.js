import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { scrollState } from './scrollState';

const RANGE = 13;

// small deterministic PRNG so the layout is stable between renders
const rng = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const shapes = ['icosa', 'torus', 'sphere', 'octa', 'knot'];

const DETAIL = { high: [48, 96, 16, 48], medium: [24, 64, 12, 32], low: [16, 48, 8, 24] };

export default function Floaters({ count = 12, still = false, mobile = false, q }) {
  const [sphereSeg, knotSeg, knotRad, torusSeg] = DETAIL[q.fancy ? 'high' : q.transmission ? 'medium' : 'low'];
  const refs = useRef([]);
  const spin = useRef({ boost: 0, angle: 0 });

  // heart / UIUX easter eggs make the glass shapes whirl for a moment
  useEffect(() => {
    const on = () => (spin.current.boost = 1);
    window.addEventListener('scene-burst', on);
    return () => window.removeEventListener('scene-burst', on);
  }, []);
  const items = useMemo(() => {
    const r = rng(42);
    return Array.from({ length: count }, (_, i) => {
      const x = (r() - 0.5) * 15;
      const y = r() * RANGE;
      const z = -2 - r() * 6;
      return {
        shape: shapes[i % shapes.length],
        // on narrow screens keep the shapes at the edges, behind the copy
        x: mobile ? Math.sign(x || 1) * (3.3 + (Math.abs(x) / 7.5) * 1.4) : x,
        y,
        z: mobile ? z - 2 : z,
        s: 0.35 + r() * 0.65,
        speed: 0.0016 + r() * 0.0026,
        spin: (r() - 0.5) * 0.6,
        tint: ['#ffb3a3', '#9fc8ff', '#c9b8ff', '#9fe6d6'][i % 4],
      };
    });
  }, [count, mobile]);

  useFrame((state, dt) => {
    const t = still ? 0 : state.clock.elapsedTime;
    const sp = spin.current;
    sp.boost = Math.max(0, sp.boost - dt * 0.7);
    sp.angle += dt * sp.boost * 9;
    items.forEach((it, i) => {
      const m = refs.current[i];
      if (!m) return;
      const y = (((it.y + scrollState.y * it.speed) % RANGE) + RANGE) % RANGE;
      m.position.set(it.x + Math.sin(t * 0.3 + i) * 0.3, y - RANGE / 2, it.z);
      m.rotation.set(t * it.spin + i + sp.angle, t * it.spin * 0.8 + sp.angle * 0.6, 0);
      m.scale.setScalar(it.s * (1 + sp.boost * 0.35));
    });
  });

  return items.map((it, i) => (
    <mesh key={i} ref={(el) => (refs.current[i] = el)} scale={it.s}>
      {it.shape === 'icosa' && <icosahedronGeometry args={[1, 0]} />}
      {it.shape === 'torus' && <torusGeometry args={[0.8, 0.32, torusSeg / 2, torusSeg]} />}
      {it.shape === 'sphere' && <sphereGeometry args={[0.9, sphereSeg, sphereSeg]} />}
      {it.shape === 'octa' && <octahedronGeometry args={[1, 0]} />}
      {it.shape === 'knot' && <torusKnotGeometry args={[0.6, 0.22, knotSeg, knotRad]} />}
      {q.transmission ? (
        <meshPhysicalMaterial
          color={it.tint}
          transmission={1}
          thickness={1.2}
          ior={1.5}
          roughness={0.06}
          dispersion={q.fancy ? 6 : 0}
          attenuationColor={it.tint}
          attenuationDistance={2}
          envMapIntensity={1.5}
        />
      ) : (
        // low tier: glossy candy shapes, no refraction pass
        <meshStandardMaterial color={it.tint} roughness={0.18} metalness={0.05} envMapIntensity={1.4} />
      )}
    </mesh>
  ));
}
