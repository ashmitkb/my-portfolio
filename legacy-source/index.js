
/* index.js for the complete setup */
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Add Font Awesome for icons
const fontAwesomeScript = document.createElement('link');
fontAwesomeScript.rel = 'stylesheet';
fontAwesomeScript.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
document.head.appendChild(fontAwesomeScript);

// Add Google Fonts
const googleFonts = document.createElement('link');
googleFonts.rel = 'stylesheet';
googleFonts.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap';
document.head.appendChild(googleFonts);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);