import { useEffect, useState } from 'react';
import { profile } from '../data';
import { useClock } from '../hooks';

const links = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const time = useClock(profile.timeZone);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // hide on scroll down, reveal on scroll up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 160 && !open);
      setScrolled(y > 40);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`nav ${hidden ? 'is-hidden' : ''} ${open ? 'is-open' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
      <a href="#top" className="nav__logo" data-cursor="hover" aria-label="Back to top">
        {profile.name}
        <sup>©</sup>
      </a>

      <p className="nav__meta mono" aria-label="Local time">
        {profile.location.split(',')[0]} — {time}
      </p>

      <nav className="nav__links glass-pill" aria-label="Primary">
        {links.map((l) => (
          <a key={l.href} href={l.href} className="link-underline" data-cursor="hover">
            {l.label}
          </a>
        ))}
      </nav>

      <button
        className="nav__burger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="menu"
      >
        <span className="mono">{open ? 'Close' : 'Menu'}</span>
      </button>

      <div id="menu" className="menu" aria-hidden={!open}>
        {links.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            style={{ '--i': i }}
          >
            <span className="mono">0{i + 1}</span>
            {l.label}
          </a>
        ))}
      </div>
    </header>
  );
}
