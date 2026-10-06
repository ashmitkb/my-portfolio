import { useEffect, useRef } from 'react';
import { isFinePointer, prefersReducedMotion } from '../hooks';

/**
 * Custom cursor with a lagging ring. Grows over `[data-cursor]` elements and
 * shows their label (e.g. "View"). Disabled on touch devices.
 */
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return undefined;
    document.documentElement.classList.add('has-cursor');

    const pos = { x: -100, y: -100 };
    const lag = { x: -100, y: -100 };
    let raf;

    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dot.current)
        dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    };
    const onOver = (e) => {
      const target = e.target.closest && e.target.closest('[data-cursor]');
      const r = ring.current;
      if (!r) return;
      if (target) {
        r.dataset.state = target.dataset.cursor || 'hover';
        if (label.current) label.current.textContent = target.dataset.cursorLabel || '';
      } else {
        r.dataset.state = '';
        if (label.current) label.current.textContent = '';
      }
    };
    const loop = () => {
      lag.x += (pos.x - lag.x) * 0.16;
      lag.y += (pos.y - lag.y) * 0.16;
      if (ring.current)
        ring.current.style.transform = `translate3d(${lag.x}px, ${lag.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <span ref={label} className="cursor-label mono" />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
