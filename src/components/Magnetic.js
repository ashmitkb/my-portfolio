import { useRef } from 'react';
import { isFinePointer, prefersReducedMotion } from '../hooks';

/** Wraps a child so it gently pulls toward the pointer. */
export default function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null);
  const enabled = () => isFinePointer() && !prefersReducedMotion();

  const onMove = (e) => {
    if (!enabled() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <span
      ref={ref}
      className={`magnetic ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </span>
  );
}
