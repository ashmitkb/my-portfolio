import { useEffect, useRef, useState } from 'react';
import { about, aboutStats, now, offKeyboard, profile, skills } from '../data';
import { prefersReducedMotion, useClock, useInView } from '../hooks';

/** Photo that tilts toward the pointer with a moving glare, plus a spinning badge. */
function Portrait() {
  const card = useRef(null);
  const time = useClock(profile.timeZone);

  const onMove = (e) => {
    const el = card.current;
    if (!el || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-py * 10).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(px * 12).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${((px + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${((py + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = card.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <figure className="portrait" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={card} className="portrait__card glass">
        <img src={profile.photo} alt={`Portrait of ${profile.fullName}`} loading="lazy" />
        <span className="portrait__glare" aria-hidden="true" />
        <figcaption>
          <span>{profile.fullName}</span>
          <span className="mono">
            {profile.location.split(',')[0]} · {time} IST
          </span>
        </figcaption>
      </div>
      <div className="portrait__badge" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <defs>
            <path id="badge-ring" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
          </defs>
          <text>
            <textPath href="#badge-ring" textLength="274" lengthAdjust="spacing">
              BCA ’27 · BENGALURU · WEB · AI · IOT ·
            </textPath>
          </text>
        </svg>
        <span className="portrait__badge-core">✦</span>
      </div>
    </figure>
  );
}

/** Number that counts up the first time it scrolls into view. */
function Stat({ value, label, run }) {
  const [n, setN] = useState(() => (prefersReducedMotion() ? value : 0));
  useEffect(() => {
    if (!run || prefersReducedMotion()) return undefined;
    const start = performance.now();
    const duration = 1600;
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, value]);

  return (
    <div className="stat glass">
      <dt className="mono">{label}</dt>
      <dd>{n}</dd>
    </div>
  );
}

export default function About() {
  const wrap = useRef(null);
  const [head, headSeen] = useInView();
  const [statsRef, statsSeen] = useInView({ threshold: 0.4 });
  const [rowRef, rowSeen] = useInView({ threshold: 0.1 });
  const words = about.split(' ');

  // words light up one by one as the paragraph scrolls through the viewport
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
      <div ref={head} className={`section__head reveal ${headSeen ? 'is-in' : ''}`}>
        <p className="eyebrow mono">(02) About</p>
        <h2 className="display">
          The human
          <br />
          <em>behind the keys</em>
        </h2>
      </div>

      <div id="about-body" className="about__bento">
        <Portrait />
        <p className="about__text" ref={wrap} aria-label={about}>
          {words.map((w, i) => (
            <span className="word" key={i} aria-hidden="true">
              {w}{' '}
            </span>
          ))}
        </p>
        <dl ref={statsRef} className="about__stats">
          {aboutStats.map((s) => (
            <Stat key={s.label} {...s} run={statsSeen} />
          ))}
        </dl>
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
        <div className="glass panel">
          <h3 className="mono panel__title">Off the keyboard</h3>
          <ul className="now">
            {offKeyboard.map((n) => (
              <li key={n.label}>
                <span className="mono">{n.label}</span>
                {n.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
