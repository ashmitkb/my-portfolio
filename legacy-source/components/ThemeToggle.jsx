// components/ThemeToggle.jsx
import React from 'react';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
    </button>
  );
};

export default ThemeToggle;