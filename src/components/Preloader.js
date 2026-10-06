import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../hooks';

export default function Preloader({ onDone }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setGone(true);
      onDone();
      return undefined;
    }
    const start = performance.now();
    const duration = 1800;
    let raf;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      // ease-out so the number decelerates into 100
      setCount(Math.round(100 * (1 - Math.pow(1 - t, 3))));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setLeaving(true);
        setTimeout(onDone, 350);
        setTimeout(() => setGone(true), 1300);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div
      className={`preloader ${leaving ? 'is-leaving' : ''}`}
      role="status"
      aria-label="Loading"
    >
      <div className="preloader__inner">
        <span className="preloader__label mono">Portfolio — {new Date().getFullYear()}</span>
        <span className="preloader__count">{String(count).padStart(3, '0')}</span>
        <span className="preloader__bar">
          <span style={{ transform: `scaleX(${count / 100})` }} />
        </span>
      </div>
    </div>
  );
}
