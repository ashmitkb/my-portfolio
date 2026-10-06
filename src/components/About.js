import { useEffect, useRef } from 'react';
import { about, now, profile, skills } from '../data';
import { prefersReducedMotion, useInView } from '../hooks';

/** Paragraph whose words light up as you scroll through it. */
export default function About() {
  const wrap = useRef(null);
  const [rowRef, rowSeen] = useInView();
  const words = about.split(' ');

  useEffect(() => {
    const el = wrap.current;
    if (!el) return undefined;
    const spans = Array.from(el.querySelectorAll('.word'));
    if (prefersReducedMotion()) {
      spans.forEach((s) => (s.style.opacity = 1));
      return undefined;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.4;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height)));
      const lit = p * spans.length;
      spans.forEach((s, i) => {
        s.style.opacity = Math.min(1, Math.max(0.16, lit - i + 1)).toFixed(2);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="about" className="section about">
      <p className="eyebrow mono">(02) About</p>
      <div className="about__grid">
        <figure className="about__photo glass">
          <img src={profile.photo} alt={`Portrait of ${profile.fullName}`} loading="lazy" />
          <figcaption className="mono">{profile.fullName}</figcaption>
        </figure>
        <p className="about__text" ref={wrap} aria-label={about}>
          {words.map((w, i) => (
            <span className="word" key={i} aria-hidden="true">
              {w}{' '}
            </span>
          ))}
        </p>
      </div>

      <div ref={rowRef} className={`about__cols reveal ${rowSeen ? 'is-in' : ''}`}>
        <div className="glass panel">
          <h3 className="mono panel__title">Right now</h3>
          <ul className="now">
            {now.map((n) => (
              <li key={n.label}>
                <span className="mono">{n.label}</span>
                {n.text}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass panel">
          <h3 className="mono panel__title">Toolbox</h3>
          {skills.map((g) => (
            <div className="skills" key={g.group}>
              <span className="mono">{g.group}</span>
              <ul className="tags mono">
                {g.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
