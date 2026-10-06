// 4 × 3 macro pad, modelled on the original keyboard.
// col/row: grid position (row 0 = front). w/d: size in key units.
// style: material preset in Keyboard.js. action: see actions.js.
export const keys = [
  // back row
  { id: 'resume', col: 0, row: 2, w: 2, d: 1, style: 'yellow', action: 'resume', cursor: 'Resume',
    legend: { text: ['Resume'], color: '#8d6ff0', font: 'sans', size: 0.3, align: 'center', dx: -0.05 } },
  { id: 'u1', col: 2, row: 2, w: 1, d: 1, style: 'white', action: 'letter', letter: 'U', cursor: 'Type',
    legend: { text: ['U'], color: '#8d7cf0', font: 'mono', size: 0.36, align: 'center' } },
  { id: 'hire', col: 3, row: 1, w: 1, d: 2, style: 'blue', action: 'hire', cursor: 'Hire',
    legend: { text: ['Hire', 'Me'], color: '#e7e2ff', font: 'mono', size: 0.22, align: 'topleft', enter: true } },
  // middle row
  { id: 'figma', col: 0, row: 1, w: 1, d: 1, style: 'purple', action: 'figma', cursor: 'Design',
    legend: { icon: 'figma' } },
  { id: 'i', col: 1, row: 1, w: 1, d: 1, style: 'white', action: 'letter', letter: 'I', cursor: 'Type',
    legend: { text: ['I'], color: '#8d7cf0', font: 'mono', size: 0.36, align: 'center' } },
  { id: 'u2', col: 2, row: 1, w: 1, d: 1, style: 'white', action: 'letter', letter: 'U', cursor: 'Type',
    legend: { text: ['U'], color: '#8d7cf0', font: 'mono', size: 0.36, align: 'center' } },
  // front row
  { id: 'works', col: 0, row: 0, w: 2, d: 1, style: 'chrome', action: 'works', cursor: 'Works',
    legend: { text: ['Works'], color: '#ffffff', font: 'sans', size: 0.26, align: 'center', tracking: 0.12 } },
  { id: 'x', col: 2, row: 0, w: 1, d: 1, style: 'white', action: 'letter', letter: 'X', cursor: 'Type',
    legend: { text: ['X'], color: '#8d7cf0', font: 'mono', size: 0.36, align: 'center' } },
  { id: 'heart', col: 3, row: 0, w: 1, d: 1, style: 'heart', action: 'heart', cursor: 'Like',
    legend: { icon: 'heart' } },
];

export const COLS = 4;
export const ROWS = 3;
