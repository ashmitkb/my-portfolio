import { useState } from 'react';
import { flushSync } from 'react-dom';
import { prefersReducedMotion } from '../hooks';

const STORAGE_KEY = 'theme';
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
        ☾
      </span>
      <span className="theme-toggle__icon is-sun" aria-hidden="true">
        ☀
      </span>
      <span className="theme-toggle__knob" aria-hidden="true" />
    </button>
  );
}
