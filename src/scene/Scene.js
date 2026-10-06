import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { MathUtils } from 'three';
import Keyboard from './Keyboard';
import Floaters from './Floaters';
import { scrollState } from './scrollState';
import { prefersReducedMotion } from '../hooks';

// Where the keyboard sits as each section scrolls into view.
// x/y/z are world units (desktop x is scaled to the viewport width);
// `m` overrides the pose on narrow screens, where it hides behind the glass
// panels instead of competing with the copy.
const POSES = [
  { id: null, x: 1.5, y: 0.02, z: 0, tilt: 0.82, yaw: -0.62, s: 0.66, m: { x: 0.1, y: 0.15, z: -0.6, s: 0.95 } },
  { id: 'work', x: 4.4, y: 2.9, z: -4.5, tilt: 0.7, yaw: -0.95, s: 0.6, m: { x: 0.5, y: -0.6, z: -5, s: 0.85 } },
  { id: 'about', x: 3.6, y: 3.1, z: -4.5, tilt: 0.6, yaw: 0.9, s: 0.5, m: { x: -0.2, y: 1, z: -5, s: 0.75 } },
  // drifts up out of view while the About text is being read
  { id: 'about-body', x: 4.4, y: 7.5, z: -4.5, tilt: 0.6, yaw: 1.2, s: 0.5, m: { x: 0, y: 9, z: -5, s: 0.7 } },
  { id: 'experience', x: 4.1, y: 2.3, z: -4, tilt: 0.75, yaw: 0.7, s: 0.52, m: { x: 0, y: -0.4, z: -5, s: 0.85 } },
  { id: 'services', x: 3.9, y: -0.3, z: -3, tilt: 1.1, yaw: -0.3, s: 0.7, m: { x: 0.6, y: -0.6, z: -5, s: 0.85 } },
  { id: 'contact', x: 2.7, y: -0.2, z: -1.6, tilt: 1.0, yaw: -0.4, s: 0.62, m: { x: 1.3, y: -1, z: -2.5, s: 0.55 } },
];

const smooth = (t) => t * t * (3 - 2 * t);

function samplePose(y, mobile) {
  // page-relative top of each anchor (works for nested elements too)
  const stops = POSES.map((p) => {
    const el = p.id && document.getElementById(p.id);
    return el ? el.getBoundingClientRect().top + y : 0;
  });
  const vh = window.innerHeight;
  // pose is reached when a section's top is ~60% down the viewport
  const pts = stops.map((s, i) => (i === 0 ? 0 : Math.max(0, s - vh * 0.6)));
  let i = pts.length - 2;
  for (let j = 0; j < pts.length - 1; j += 1) {
    if (y < pts[j + 1]) {
      i = j;
      break;
    }
  }
  const span = Math.max(1, pts[i + 1] - pts[i]);
  const t = smooth(MathUtils.clamp((y - pts[i]) / span, 0, 1));
  const a = mobile ? { ...POSES[i], ...POSES[i].m } : POSES[i];
  const b = mobile ? { ...POSES[i + 1], ...POSES[i + 1].m } : POSES[i + 1];
  const mix = (k) => MathUtils.lerp(a[k], b[k], t);
  return { x: mix('x'), y: mix('y'), z: mix('z'), tilt: mix('tilt'), yaw: mix('yaw'), s: mix('s') };
}

function Rig({ reduced, mobile }) {
  const outer = useRef();
  const inner = useRef();
  const { viewport, camera, pointer } = useThree();

  useFrame((state, dt) => {
    const aspect = state.size.width / state.size.height;
    const fov = aspect < 0.8 ? 54 : 35;
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    const p = samplePose(scrollState.y, mobile);
    const fit = Math.min(1, (viewport.width * 0.98) / 7.6);
    const k = reduced ? 1 : 1 - Math.exp(-dt * 5);
    const t = state.clock.elapsedTime;
    const g = outer.current;
    if (!g) return;
    const xs = mobile ? 1 : viewport.width / 9;
    const float = reduced ? 0 : Math.sin(t * 0.8) * 0.08;
    g.position.x = MathUtils.lerp(g.position.x, p.x * xs, k);
    g.position.y = MathUtils.lerp(g.position.y, p.y + float, k);
    g.position.z = MathUtils.lerp(g.position.z, p.z, k);
    g.rotation.x = MathUtils.lerp(g.rotation.x, p.tilt - (reduced ? 0 : pointer.y * 0.12), k);
    const s = MathUtils.lerp(g.scale.x, p.s * fit, k);
    g.scale.setScalar(s);
    if (inner.current) {
      const yaw = p.yaw + (reduced ? 0 : pointer.x * 0.28 + Math.sin(t * 0.4) * 0.05);
      inner.current.rotation.y = MathUtils.lerp(inner.current.rotation.y, yaw, k);
    }
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        <Keyboard />
      </group>
    </group>
  );
}

export default function Scene() {
  const reduced = prefersReducedMotion();
  const mobile = window.innerWidth < 760;

  return (
    <Canvas
      className="scene"
      dpr={[1, mobile ? 1.5 : 1.8]}
      camera={{ position: [0, 0, 9], fov: window.innerWidth / window.innerHeight < 0.8 ? 54 : 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      eventSource={document.getElementById('root')}
      eventPrefix="client"
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      {/* procedural studio lighting — no HDR download */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={5} position={[0, 6, -4]} scale={[14, 5, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={4} position={[-7, 1, 3]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} color="#ff9d8a" />
        <Lightformer form="rect" intensity={4} position={[7, 1, 3]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} color="#7fb8ff" />
        <Lightformer form="rect" intensity={2.5} position={[0, 1.5, 8]} scale={[16, 4, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.5} position={[0, -2, 7]} scale={[16, 2, 1]} color="#c9b8ff" />
        <Lightformer form="rect" intensity={2} position={[0, -5, 2]} rotation-x={Math.PI / 2} scale={[12, 6, 1]} color="#ffffff" />
      </Environment>
      <Rig reduced={reduced} mobile={mobile} />
      <Floaters count={mobile ? 6 : 12} still={reduced} mobile={mobile} />
    </Canvas>
  );
}
