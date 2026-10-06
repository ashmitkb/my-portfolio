import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/SceneLayer', () => () => null);

beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    ((query) => ({
      matches: query.includes('reduce'),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
});

test('renders hero, sections and contact', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { level: 1, name: /ashmit/i })
  ).toBeInTheDocument();
  expect(screen.getByText(/selected work/i)).toBeInTheDocument();
  expect(screen.getByText(/green corridor/i, { selector: 'h3' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /ashmitbdry@gmail.com/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /copy email/i })).toBeInTheDocument();
});

test('theme switch flips to light and back, and remembers the choice', () => {
  localStorage.clear();
  render(<App />);
  const toggle = screen.getByRole('switch', { name: /light mode/i });
  expect(toggle).toHaveAttribute('aria-checked', 'false');
  expect(document.documentElement.dataset.theme).toBeUndefined();

  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-checked', 'true');
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(localStorage.getItem('theme')).toBe('light');

  fireEvent.click(toggle);
  expect(document.documentElement.dataset.theme).toBeUndefined();
  expect(localStorage.getItem('theme')).toBe('dark');
});
