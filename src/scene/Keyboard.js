import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  ExtrudeGeometry,
  MathUtils,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Shape,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { COLS, ROWS, keys } from './keys';
import { legendTexture } from './legend';
import { runAction, typeLetter } from './actions';

const U = 1; // key pitch
const GAP = 0.035; // space between caps
const H = 0.62; // keycap height
const INSET = 0.075; // how much narrower the top of a cap is than its base
const BORDER = 0.34; // case border around the key grid
export const MODEL_SCALE = 1.45;

const setCursor = (detail) =>
  window.dispatchEvent(new CustomEvent('scene-cursor', { detail }));

// Pointer events reach the scene through the page; ignore the ones that land
// on real UI drawn above the canvas so a click never does two things.
const blocked = (e) => {
  const t = e.nativeEvent && e.nativeEvent.target;
  return !!(
    t &&
    t.closest &&
    t.closest('a, button, input, textarea, .glass, .glass-chip, .btn-glass, .nav, .menu')
  );
};

/** Rounded box whose sides taper inward toward the top, like a sculpted keycap. */
const geoCache = new Map();
function keycapGeometry(w, d) {
  const id = `${w}x${d}`;
  if (geoCache.has(id)) return geoCache.get(id);
  const g = new RoundedBoxGeometry(w, H, d, 6, 0.15);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i += 1) {
    const t = (p.getY(i) + H / 2) / H;
    p.setX(i, p.getX(i) * (1 - (INSET * t) / (w / 2)));
    p.setZ(i, p.getZ(i) * (1 - (INSET * t) / (d / 2)));
  }
  geoCache.set(id, g);
  return g;
}

function roundedRectShape(w, h, r, shape = new Shape()) {
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

/** Emissive light that is strongest at the base of the cap and fades out by the top. */
function withUnderglow(mat) {
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vKeyY;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvKeyY = position.y;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vKeyY;')
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        totalEmissiveRadiance *= 1.0 - smoothstep(${(-H / 2).toFixed(3)}, ${(H * 0.42).toFixed(3)}, vKeyY);`
      );
  };
  mat.customProgramCacheKey = () => 'keycap-underglow';
  return mat;
}

const STYLES = {
  white: {
    color: '#f4f0f3', transmission: 0.45, thickness: 1.2, roughness: 0.38, ior: 1.4,
    attenuationColor: '#ffe4d8', attenuationDistance: 1.4, clearcoat: 0.4, clearcoatRoughness: 0.3,
    sheen: 0.6, sheenColor: '#ffffff', emissive: '#ff9a72', glow: 0.35,
  },
  purple: {
    color: '#7a5cff', transmission: 0.2, thickness: 1, roughness: 0.22, clearcoat: 1,
    attenuationColor: '#5b3dff', attenuationDistance: 1, emissive: '#8a6cff', glow: 0.45,
  },
  yellow: {
    color: '#ffb51c', roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.1,
    emissive: '#ff8a00', glow: 0.35,
  },
  blue: {
    color: '#5a48ff', transmission: 0.35, thickness: 2, roughness: 0.18, clearcoat: 1,
    attenuationColor: '#3424ff', attenuationDistance: 0.9, emissive: '#6f63ff', glow: 0.7,
  },
  heart: {
    color: '#140606', transmission: 0.25, thickness: 1, roughness: 0.12, clearcoat: 1,
    attenuationColor: '#ff2a0a', attenuationDistance: 0.6, emissive: '#ff2a0a', glow: 2.6,
  },
};

function makeMaterial(style) {
  if (style === 'chrome') {
    const chrome = new MeshStandardMaterial({
      color: '#e4e8ee', metalness: 1, roughness: 0.1, envMapIntensity: 1.7,
    });
    const top = new MeshPhysicalMaterial({
      color: '#0a0e1f', metalness: 0.4, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.04,
      iridescence: 1, iridescenceIOR: 1.6, iridescenceThicknessRange: [200, 700], envMapIntensity: 1.7,
    });
    // BoxGeometry face order: +x, -x, +y (top), -y, +z, -z
    return { material: [chrome, chrome, top, chrome, chrome, chrome], glow: 0, emissive: null };
  }
  const { glow, ...params } = STYLES[style];
  const m = withUnderglow(
    new MeshPhysicalMaterial({ envMapIntensity: 1.6, ior: 1.45, ...params, emissiveIntensity: glow })
  );
  return { material: m, glow, emissive: m };
}

function Key({ k, state }) {
  const cap = useRef();
  const { material, glow, emissive } = useMemo(() => makeMaterial(k.style), [k.style]);
  const geometry = keycapGeometry(k.w * U - GAP, k.d * U - GAP);
  const legend = useMemo(() => legendTexture(k.legend, k.w, k.d), [k]);
  const topW = k.w * U - GAP - INSET * 2 - 0.06;
  const topD = k.d * U - GAP - INSET * 2 - 0.06;
  const x = (k.col + k.w / 2) * U - (COLS * U) / 2;
  const z = (ROWS * U) / 2 - (k.row + k.d / 2) * U; // row 0 is the front

  useFrame((frame, dt) => {
    const s = state.current;
    const pressed = s.down || s.kbd;
    const target = pressed ? -0.2 : s.hover ? -0.06 : 0;
    if (cap.current) cap.current.position.y = MathUtils.damp(cap.current.position.y, target, 22, dt);
    s.flash = Math.max(0, s.flash - dt * 2.2);
    if (emissive) {
      const beat = k.style === 'heart' ? Math.pow(Math.max(0, Math.sin(frame.clock.elapsedTime * 3.2)), 12) * 0.5 : 0;
      emissive.emissiveIntensity = glow * (1 + beat + s.flash * 1.6 + (s.hover ? 0.35 : 0));
    }
  });

  const handlers = {
    onPointerOver: (e) => {
      if (blocked(e)) return;
      e.stopPropagation();
      state.current.hover = true;
      setCursor({ state: 'view', label: k.cursor });
    },
    onPointerMove: (e) => {
      if (blocked(e) && state.current.hover) {
        state.current.hover = false;
        setCursor(null);
      }
    },
    onPointerOut: () => {
      state.current.hover = false;
      state.current.down = false;
      setCursor(null);
    },
    onPointerDown: (e) => {
      if (blocked(e)) return;
      e.stopPropagation();
      state.current.down = true;
      state.current.flash = 1;
    },
    onPointerUp: () => {
      state.current.down = false;
    },
    onClick: (e) => {
      if (blocked(e)) return;
      e.stopPropagation();
      runAction(k);
    },
  };

  return (
    <group position={[x, 0, z]}>
      <group ref={cap}>
        <mesh geometry={geometry} material={material} position={[0, H / 2, 0]} {...handlers} />
        <mesh position={[0, H + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={5}>
          <planeGeometry args={[topW, topD]} />
          <meshBasicMaterial map={legend} transparent toneMapped={false} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

function Case() {
  const W = COLS * U + BORDER * 2;
  const D = ROWS * U + BORDER * 2;
  const { base, rim, plate } = useMemo(() => {
    const frame = roundedRectShape(W - 0.1, D - 0.1, 0.32);
    frame.holes.push(roundedRectShape(COLS * U + 0.12, ROWS * U + 0.12, 0.14));
    return {
      base: new RoundedBoxGeometry(W, 0.5, D, 6, 0.3),
      rim: new ExtrudeGeometry(frame, {
        depth: 0.16,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 5,
        curveSegments: 20,
      }),
      plate: new RoundedBoxGeometry(COLS * U + 0.14, 0.06, ROWS * U + 0.14, 2, 0.03),
    };
  }, [W, D]);

  return (
    <group>
      <mesh geometry={base} position={[0, -0.25, 0]}>
        <meshStandardMaterial color="#353a3f" metalness={0.45} roughness={0.42} envMapIntensity={1.3} />
      </mesh>
      <mesh geometry={rim} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <meshStandardMaterial color="#454b51" metalness={0.5} roughness={0.32} envMapIntensity={1.4} />
      </mesh>
      <mesh geometry={plate} position={[0, 0, 0]}>
        <meshStandardMaterial color="#121417" roughness={0.75} />
      </mesh>
    </group>
  );
}

export default function Keyboard() {
  // one mutable state object per key, shared by pointer + physical keyboard input
  const states = useRef(
    Object.fromEntries(keys.map((k) => [k.id, { current: { hover: false, down: false, kbd: false, flash: 0 } }]))
  );

  // typing U, I or X on a real keyboard presses the matching caps
  useEffect(() => {
    const match = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return [];
      const tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return [];
      const letter = (e.key || '').toUpperCase();
      return keys.filter((k) => k.letter === letter);
    };
    const down = (e) => {
      const hit = match(e);
      if (!hit.length || e.repeat) return;
      hit.forEach((k) => {
        const s = states.current[k.id].current;
        s.kbd = true;
        s.flash = 1;
      });
      typeLetter(hit[0].letter);
    };
    const up = (e) => match(e).forEach((k) => (states.current[k.id].current.kbd = false));
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const heart = keys.find((k) => k.id === 'heart');
  const hire = keys.find((k) => k.id === 'hire');
  const pos = (k) => [(k.col + k.w / 2) * U - (COLS * U) / 2, (ROWS * U) / 2 - (k.row + k.d / 2) * U];

  return (
    <group scale={MODEL_SCALE}>
      <Case />
      {/* light spilling out from under the glowing caps onto their neighbours */}
      <pointLight position={[pos(heart)[0], 0.3, pos(heart)[1]]} color="#ff3a1a" intensity={5} distance={2.8} decay={2} />
      <pointLight position={[pos(hire)[0], 0.3, pos(hire)[1]]} color="#6b5cff" intensity={3} distance={2.6} decay={2} />
      {keys.map((k) => (
        <Key key={k.id} k={k} state={states.current[k.id]} />
      ))}
    </group>
  );
}
