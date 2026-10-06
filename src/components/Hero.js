import { profile } from '../data';

const letters = 'ASHMIT'.split('');

export default function Hero({ ready }) {
  return (
    <section id="top" className={`hero ${ready ? 'is-ready' : ''}`}>
      <h1 className="hero__title" aria-label={`${profile.name} — ${profile.role}`}>
        {letters.map((l, i) => (
          <span className="mask" key={i} aria-hidden="true">
            <span className="mask__inner" style={{ '--d': `${i * 70}ms` }}>
              {l}
            </span>
          </span>
        ))}
      </h1>

      <div className="hero__ui">
        <p className="glass-chip mono">
          <span className="dot" /> Open to work · {profile.role}
        </p>
        <p className="hero__intro">{profile.intro}</p>
        <div className="hero__actions">
          <a href="#work" className="btn-glass" data-cursor="hover">
            Explore my work <span aria-hidden="true">↓</span>
          </a>
          <span className="hero__hint mono">Psst — the keyboard is real. Press the keys.</span>
        </div>
      </div>
    </section>
  );
}
