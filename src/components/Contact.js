import { useState } from 'react';
import { profile, socials } from '../data';
import { useClock, useInView } from '../hooks';
import Magnetic from './Magnetic';
import { toast } from '../scene/actions';

const track = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

export default function Contact() {
  const [ref, seen] = useInView();
  const [copied, setCopied] = useState(false);
  const time = useClock(profile.timeZone);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      toast('Email copied — talk soon ✦');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <footer id="contact" className="section contact">
      <p className="eyebrow mono">(04) Contact</p>
      <h2 ref={ref} className={`contact__title reveal ${seen ? 'is-in' : ''}`}>
        Let’s make something <em>unforgettable</em>
      </h2>

      <div className="compose glass" onMouseMove={track}>
        <p className="compose__label mono">
          <span className="dot" /> Say hello — always open to new projects
        </p>
        <a href={`mailto:${profile.email}`} className="compose__email" data-cursor="hover">
          {profile.email}
        </a>
        <div className="compose__keys">
          <Magnetic strength={0.2}>
            <button type="button" className="keycap" onClick={copy} data-cursor="hover">
              {copied ? 'Copied ✓' : 'Copy email'}
            </button>
          </Magnetic>
          <Magnetic strength={0.2}>
            <a href={`mailto:${profile.email}`} className="keycap keycap--accent" data-cursor="hover">
              Write <span aria-hidden="true">↵</span>
            </a>
          </Magnetic>
        </div>
      </div>

      <div className="contact__foot mono">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>
          {profile.location} · {time}
        </span>
        <span className="contact__social">
          {socials.map((s) => (
            <a key={s.label} href={s.href} className="link-underline" data-cursor="hover">
              {s.label}
            </a>
          ))}
        </span>
      </div>
    </footer>
  );
}
