import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei';
import { MathUtils } from 'three';
import Keyboard from './Keyboard';
import Floaters from './Floaters';
import { scrollState } from './scrollState';
import { prefersReducedMotion } from '../hooks';
import { applyTier, currentTier, forcedTier, lowerTier, softwareGpu } from '../perf';

// What each quality tier (see src/perf.js) renders.
const QUALITY = {
  high: { dpr: 1.8, floaters: 12, transmission: true, fancy: true, segs: 6, loop: 'always' },
  medium: { dpr: 1.3, floaters: 7, transmission: true, fancy: false, segs: 4, loop: 'paced' },
  low: { dpr: 1, floaters: 4, transmission: false, fancy: false, segs: 3, loop: 'lazy' },
};

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
  { id: 'about-end', x: 4.4, y: 7.5, z: -4.5, tilt: 0.6, yaw: 1.0, s: 0.5, m: { x: 0, y: 9, z: -5, s: 0.7 } },
  { id: 'experience', x: 4.1, y: 2.3, z: -4, tilt: 0.75, yaw: 0.7, s: 0.52, m: { x: 0, y: -0.4, z: -5, s: 0.85 } },
  // and again while the timeline is being read
  { id: 'experience-body', x: 4.4, y: 7.5, z: -4.5, tilt: 0.75, yaw: 0.9, s: 0.5, m: { x: 0, y: 9, z: -5, s: 0.7 } },
  { id: 'experience-end', x: 4.4, y: 7.5, z: -4.5, tilt: 0.9, yaw: 0.4, s: 0.5, m: { x: 0, y: 9, z: -5, s: 0.7 } },
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

function Rig({ reduced, mobile, q }) {
  const outer = useRef();
  const inner = useRef();
  const { viewport, camera, pointer } = useThree();

  useFrame((state, delta) => {
    // on-demand tiers can sleep between frames; don't jump after a long gap
    const dt = Math.min(delta, 0.1);
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
        <Keyboard q={q} />
      </group>
    </group>
  );
}

/**
 * Frame pacing for the lighter tiers (the canvas runs frameloop="demand").
 * "paced": 60fps while the visitor is active, a gentle 20fps idle drift.
 * "lazy":  30fps while active, no redraws at all when idle.
 * Also watches the real frame rate while active and asks for a lower tier
 * if the device can't keep up.
 */
function Pacer({ mode, onSlow }) {
  const invalidate = useThree((st) => st.invalidate);

  useEffect(() => {
    let raf;
    let last = 0;
    let prev = 0;
    let wakeUntil = performance.now() + 3000;
    let slowMs = 0;
    const wake = () => {
      wakeUntil = performance.now() + 2000;
    };
    const events = ['scroll', 'pointermove', 'pointerdown', 'keydown', 'wheel', 'touchmove', 'resize', 'scene-burst', 'perf-tier'];
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const awake = now < wakeUntil;
      // a long gap between animation frames while active means the device is struggling
      // (gaps over a second are a background tab or a breakpoint, not slowness)
      const gap = now - prev;
      if (awake && prev && onSlow && gap < 1000) {
        slowMs = gap > 45 ? slowMs + gap : Math.max(0, slowMs - gap);
        if (slowMs > 3000) {
          slowMs = 0;
          onSlow();
        }
      }
      prev = now;
      const fps = awake ? (mode === 'lazy' ? 30 : 60) : mode === 'lazy' ? 0 : 20;
      if (fps && now - last >= 1000 / fps - 4) {
        last = now;
        invalidate();
      }
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      events.forEach((e) => window.removeEventListener(e, wake));
    };
  }, [mode, onSlow, invalidate]);

  return null;
}

export default function Scene() {
  const reduced = prefersReducedMotion();
  const mobile = window.innerWidth < 760;
  const forced = forcedTier();
  const [tier, setTier] = useState(currentTier);
  const [armed, setArmed] = useState(false);
  const q = QUALITY[tier];

  // step down one tier (never back up within a visit) and tell the CSS
  const stepDown = useRef(() => {
    setTier((t) => {
      const next = lowerTier(t);
      if (next !== t) applyTier(next, { remember: true });
      return next;
    });
  }).current;

  // let shaders compile before judging the frame rate
  useEffect(() => {
    const id = setTimeout(() => setArmed(true), 4000);
    return () => clearTimeout(id);
  }, []);

  return (
    <Canvas
      className="scene"
      frameloop={q.loop === 'always' ? 'always' : 'demand'}
      dpr={[1, mobile ? Math.min(1.5, q.dpr) : q.dpr]}
      camera={{ position: [0, 0, 9], fov: window.innerWidth / window.innerHeight < 0.8 ? 54 : 35 }}
      gl={{ antialias: !(tier === 'low' && softwareGpu()), alpha: true, powerPreference: tier === 'low' ? 'default' : 'high-performance' }}
      eventSource={document.getElementById('root')}
      eventPrefix="client"
    >
      {/* high tier: drop to medium if it can't hold ~40fps */}
      {armed && !forced && tier === 'high' && (
        <PerformanceMonitor bounds={() => [40, 60]} flipflops={2} onDecline={stepDown} />
      )}
      {q.loop !== 'always' && (
        <Pacer mode={q.loop} onSlow={armed && !forced && tier === 'medium' ? stepDown : null} />
      )}
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      {/* procedural studio lighting — no HDR download */}
      <Environment resolution={tier === 'low' ? 128 : 256} frames={1}>
        <Lightformer form="rect" intensity={5} position={[0, 6, -4]} scale={[14, 5, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={4} position={[-7, 1, 3]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} color="#ff9d8a" />
        <Lightformer form="rect" intensity={4} position={[7, 1, 3]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} color="#7fb8ff" />
        <Lightformer form="rect" intensity={2.5} position={[0, 1.5, 8]} scale={[16, 4, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.5} position={[0, -2, 7]} scale={[16, 2, 1]} color="#c9b8ff" />
        <Lightformer form="rect" intensity={2} position={[0, -5, 2]} rotation-x={Math.PI / 2} scale={[12, 6, 1]} color="#ffffff" />
      </Environment>
      <Rig reduced={reduced} mobile={mobile} q={q} />
      <Floaters count={mobile ? Math.min(6, q.floaters) : q.floaters} still={reduced} mobile={mobile} q={q} />
    </Canvas>
  );
}
