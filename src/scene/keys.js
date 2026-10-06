// Keyboard layout. `w` is width in key units, `go` is the section it scrolls to.
// `tint` is the glass colour, `ink` the legend colour.
export const keys = [
  // row 0 — spells the name
  { label: 'A', w: 1, row: 0, tint: '#ffd2c8', ink: '#2a0f08' },
  { label: 'S', w: 1, row: 0, tint: '#f4f1ff', ink: '#1b1630' },
  { label: 'H', w: 1, row: 0, tint: '#cfe3ff', ink: '#0d1b2e' },
  { label: 'M', w: 1, row: 0, tint: '#f4f1ff', ink: '#1b1630' },
  { label: 'I', w: 1, row: 0, tint: '#ffd2c8', ink: '#2a0f08' },
  { label: 'T', w: 1, row: 0, tint: '#cfe3ff', ink: '#0d1b2e' },
  // row 1 — navigation
  { label: 'Work', w: 2, row: 1, tint: '#8f6bff', ink: '#ffffff', go: '#work' },
  { label: 'About', w: 2, row: 1, tint: '#f4f1ff', ink: '#1b1630', go: '#about' },
  { label: 'Skills', w: 2, row: 1, tint: '#7fe0cc', ink: '#08261f', go: '#services' },
  // row 2 — actions
  { label: 'Hire me', w: 3, row: 2, tint: '#ff8a73', ink: '#2a0f08', go: '#contact', solid: true },
  { label: 'Resume', w: 2, row: 2, tint: '#ffd166', ink: '#2b1d00', go: '#contact' },
  { label: '♥', w: 1, row: 2, tint: '#ff4f7b', ink: '#ffffff', heart: true },
];
