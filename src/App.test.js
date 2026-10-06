import { render, screen } from '@testing-library/react';
import App from './App';

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
    screen.getByRole('heading', { level: 1, name: /creative developer/i })
  ).toBeInTheDocument();
  expect(screen.getByText(/selected work/i)).toBeInTheDocument();
  expect(screen.getByText(/aurora/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /ashmitbdry@gmail.com/i })).toBeInTheDocument();
});
