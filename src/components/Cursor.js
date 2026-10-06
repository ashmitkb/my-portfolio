import { useEffect, useRef } from 'react';
import { profile } from '../data';
import { isFinePointer, prefersReducedMotion } from '../hooks';

export const CURSOR_STYLES = ['droplet', 'ring', 'invert'];

// `?cursor=ring` (or droplet / invert) in the URL overrides the default, so
// each style can be tried on the live site before committing to one.
function pickStyle() {
  try {
    const q = new URLSearchParams(window.location.search).get('cursor');
    if (CURSOR_STYLES.includes(q)) return q;
  } catch {
    /* ignore malformed URLs */
  }
  return CURSOR_STYLES.includes(profile.cursor) ? profile.cursor : 'droplet';
}

/**
 * Custom cursor. A small shape trails the pointer, grows over `[data-cursor]`
 * elements and shows their label (e.g. "Open"). Disabled on touch devices.
 */
export default function Cursor() {
  const dot = useRef(null);
  const blob = useRef(null);
  const shape = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return undefined;
    const style = pickStyle();
    const root = document.documentElement;
    root.classList.add('has-cursor');
    root.dataset.cursorStyle = style;

    const pos = { x: -100, y: -100 };
    const lag = { x: -100, y: -100 };
    let state = '';
    let raf;

    const setState = (next, text, arrow = false) => {
      state = next || '';
      if (blob.current) {
        blob.current.dataset.state = state;
        blob.current.classList.toggle('has-arrow', arrow);
      }
      root.classList.toggle('cursor-view', state === 'view');
      if (label.current) label.current.textContent = text || '';
    };
    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    };
    // Page elements and 3D keys report hover separately, so a key's late
    // "pointer out" can't wipe the state of a link the pointer is now over.
    let domHover = null;
    let sceneHover = null;
    const apply = () => {
      const h = sceneHover || domHover;
      if (h) setState(h.state, h.label, h.arrow);
      else setState('');
    };
    const onOver = (e) => {
      const target = e.target.closest && e.target.closest('[data-cursor]');
      domHover = target
        ? { state: target.dataset.cursor || 'hover', label: target.dataset.cursorLabel, arrow: 'cursorArrow' in target.dataset }
        : null;
      apply();
    };
    // 3D scene objects report hover through a custom event
    const onScene = (e) => {
      sceneHover = e.detail ? { state: e.detail.state, label: e.detail.label, arrow: false } : null;
      apply();
    };
    const onDown = () => blob.current && blob.current.classList.add('is-down');
    const onUp = () => blob.current && blob.current.classList.remove('is-down');
    const onLeave = () => root.classList.add('cursor-away');
    const onEnter = () => root.classList.remove('cursor-away');

    const loop = () => {
      const dx = pos.x - lag.x;
      const dy = pos.y - lag.y;
      const ease = style === 'invert' ? 0.24 : 0.18;
      lag.x += dx * ease;
      lag.y += dy * ease;
      if (blob.current) blob.current.style.transform = `translate3d(${lag.x}px, ${lag.y}px, 0)`;
      // the droplet stretches along its direction of travel, like liquid
      if (style === 'droplet' && shape.current) {
        const speed = Math.hypot(dx, dy);
        const stretch = Math.min(speed / 150, 0.5) * (state ? 0.25 : 1);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        shape.current.style.transform = `rotate(${angle.toFixed(1)}deg) scale(${(1 + stretch).toFixed(3)}, ${(1 - stretch * 0.55).toFixed(3)})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);
    window.addEventListener('scene-cursor', onScene);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    return () => {
      root.classList.remove('has-cursor', 'cursor-away', 'cursor-view');
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      delete root.dataset.cursorStyle;
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('scene-cursor', onScene);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={blob} className="cursor" aria-hidden="true">
        <div ref={shape} className="cursor__shape" />
        <span ref={label} className="cursor__label mono" />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
