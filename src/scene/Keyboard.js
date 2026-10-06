import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { MathUtils } from 'three';
import { keys } from './keys';
import { legendTexture } from './legend';
import { scrollState } from './scrollState';

const U = 1.12; // key pitch
const H = 0.55; // keycap height
const ROW_Z = [-1.2, 0, 1.2];

const setCursor = (detail) =>
  window.dispatchEvent(new CustomEvent('scene-cursor', { detail }));

function Key({ k, x, z }) {
  const mesh = useRef();
  const s = useRef({ hover: false, down: false, kbd: false, glow: 0 });
  const width = k.w * U - 0.12;

  // physical keyboard presses animate the matching letter key
  useEffect(() => {
    if (k.label.length !== 1 || k.heart) return undefined;
    const match = (e) => e.key && e.key.toUpperCase() === k.label;
    const dn = (e) => match(e) && (s.current.kbd = true);
    const up = (e) => match(e) && (s.current.kbd = false);
    window.addEventListener('keydown', dn);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', dn);
      window.removeEventListener('keyup', up);
    };
  }, [k]);

  useFrame((_, dt) => {
    const st = s.current;
    const pressed = st.down || st.kbd;
    const target = pressed ? -0.24 : st.hover ? -0.1 : 0;
    if (mesh.current) {
      mesh.current.position.y = MathUtils.damp(mesh.current.position.y, target, 18, dt);
    }
  });

  // only the hero keyboard is interactive; later it's a backdrop
  const live = () => scrollState.y < window.innerHeight * 0.6;

  return (
    <group position={[x, 0, z]}>
      <group ref={mesh}>
        <RoundedBox
          args={[width, H, 1.0]}
          radius={0.16}
          smoothness={5}
          position={[0, H / 2, 0]}
          onPointerOver={(e) => {
            if (!live()) return;
            e.stopPropagation();
            s.current.hover = true;
            setCursor({ state: 'view', label: k.go ? 'Go' : 'Press' });
          }}
          onPointerOut={() => {
            s.current.hover = false;
            s.current.down = false;
            setCursor(null);
          }}
          onPointerDown={(e) => {
            if (!live()) return;
            e.stopPropagation();
            s.current.down = true;
          }}
          onPointerUp={() => (s.current.down = false)}
          onClick={(e) => {
            if (!live()) return;
            e.stopPropagation();
            if (k.go) document.querySelector(k.go)?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <meshPhysicalMaterial
            color={k.tint}
            transmission={k.solid ? 0.35 : 0.9}
            thickness={2}
            ior={1.45}
            roughness={k.solid ? 0.28 : 0.2}
            dispersion={4}
            attenuationColor={k.tint}
            attenuationDistance={0.7}
            clearcoat={1}
            clearcoatRoughness={0.04}
            sheen={0.6}
            sheenColor="#ffffff"
            envMapIntensity={1.8}
            emissive={k.tint}
            emissiveIntensity={k.solid ? 0.25 : 0.12}
          />
        </RoundedBox>
        <mesh position={[0, H + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={5}>
          <planeGeometry args={[Math.min(width * 0.86, 1.9), Math.min(width * 0.86, 1.9) / 2]} />
          <meshBasicMaterial
            map={legendTexture(k.label, { color: k.ink })}
            transparent
            toneMapped={false}
            depthWrite={false}
            opacity={0.95}
          />
        </mesh>
      </group>
    </group>
  );
}

export default function Keyboard() {
  const rows = [0, 1, 2].map((r) => {
    const row = keys.filter((k) => k.row === r);
    const total = row.reduce((a, k) => a + k.w, 0);
    let cursor = -total / 2;
    return row.map((k) => {
      const x = (cursor + k.w / 2) * U;
      cursor += k.w;
      return { k, x, z: ROW_Z[r] };
    });
  });

  return (
    <group>
      {/* chassis */}
      <RoundedBox args={[7.5, 0.8, 4.4]} radius={0.3} smoothness={5} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#0c0b13" metalness={0.9} roughness={0.28} envMapIntensity={1.2} />
      </RoundedBox>
      <RoundedBox args={[7.1, 0.12, 4.0]} radius={0.2} smoothness={4} position={[0, -0.08, 0]}>
        <meshStandardMaterial color="#191726" metalness={0.7} roughness={0.4} />
      </RoundedBox>
      {/* under-glow that tints the glass */}
      <pointLight position={[-2.4, 0.5, 0.4]} color="#ff8a73" intensity={9} distance={7} />
      <pointLight position={[2.4, 0.5, -0.4]} color="#6aa8ff" intensity={9} distance={7} />
      {rows.flat().map(({ k, x, z }) => (
        <Key key={k.label + x} k={k} x={x} z={z} />
      ))}
    </group>
  );
}
