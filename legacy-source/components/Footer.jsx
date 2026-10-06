// components/Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  const navigateTo = (section, e) => {
    e.preventDefault();
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Ashmit Kiran Bhandary. All Rights Reserved.</p>
          <div className="footer-links">
            <a 
              href="#home"
              onClick={(e) => navigateTo('home', e)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigateTo('home', e);
                }
              }}
            >
              Home
            </a>
            <a 
              href="#about"
              onClick={(e) => navigateTo('about', e)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigateTo('about', e);
                }
              }}
            >
              About
            </a>
            <a 
              href="#projects"
              onClick={(e) => navigateTo('projects', e)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigateTo('projects', e);
                }
              }}
            >
              Projects
            </a>
            <a 
              href="#contact"
              onClick={(e) => navigateTo('contact', e)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigateTo('contact', e);
                }
              }}
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;