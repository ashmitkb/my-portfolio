import { useState } from 'react';
import { flushSync } from 'react-dom';
import { prefersReducedMotion } from '../hooks';

const STORAGE_KEY = 'theme';

const Moon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z" fill="currentColor" />
  </svg>
);
const Sun = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4.6" fill="currentColor" />
    <path
      d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M5.4 18.6l1.5-1.5M17.1 6.9l1.5-1.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const META_COLOR = { dark: '#07060c', light: '#f3f0eb' };

const currentTheme = () =>
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light') root.dataset.theme = 'light';
  else delete root.dataset.theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META_COLOR[theme]);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage unavailable — the choice just won't be remembered */
  }
}

/**
 * Keycap-style switch between the dark (default) and light themes. The new
 * theme is revealed in a growing circle from the switch where supported.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState(currentTheme);
  const light = theme === 'light';

  const toggle = (e) => {
    const next = light ? 'dark' : 'light';
    const swap = () => {
      applyTheme(next);
      flushSync(() => setTheme(next));
    };
    if (!document.startViewTransition || prefersReducedMotion()) {
      swap();
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(swap);
    transition.ready
      .then(() =>
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 750, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' }
        )
      )
      .catch(() => {});
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={light}
      aria-label="Light mode"
      className={`theme-toggle ${light ? 'is-light' : ''}`}
      onClick={toggle}
      data-cursor="hover"
    >
      <span className="theme-toggle__icon is-moon" aria-hidden="true">
        <Moon />
      </span>
      <span className="theme-toggle__icon is-sun" aria-hidden="true">
        <Sun />
      </span>
      <span className="theme-toggle__knob" aria-hidden="true">
        {light ? <Sun /> : <Moon />}
      </span>
    </button>
  );
}
