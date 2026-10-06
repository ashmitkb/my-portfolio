import { useState } from 'react';
import { profile, socials } from '../data';
import { useClock, useInView } from '../hooks';
import Magnetic from './Magnetic';

export default function Contact() {
  const [ref, seen] = useInView();
  const [copied, setCopied] = useState(false);
  const time = useClock(profile.timeZone);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
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

      <div className="contact__row">
        <Magnetic>
          <a
            href={`mailto:${profile.email}`}
            className="btn-round"
            data-cursor="hover"
          >
            <span>Say hello</span>
          </a>
        </Magnetic>

        <div className="contact__mail">
          <button className="link-underline" onClick={copy} data-cursor="hover">
            {profile.email}
          </button>
          <span className="mono" role="status">
            {copied ? 'Copied to clipboard ✓' : 'Click to copy'}
          </span>
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
