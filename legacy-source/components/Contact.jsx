// Updated components/Contact.jsx
import React, { useState } from 'react';
import './Contact.css';

const Contact = ({ activeSection, sectionRef }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here (would typically connect to a backend)
    console.log('Form submitted:', formData);
    alert('Thank you for your message! I will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleSocialLink = (platform, e) => {
    e.preventDefault();
    // Handle social link click (in a real app, add actual links)
    console.log(`Navigate to ${platform}`);
    // You would use window.open() or navigate to the actual URL
  };

  return (
    <section 
      id="contact" 
      className={activeSection === 'contact' ? 'active' : ''}
      ref={sectionRef}
    >
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-content">
          <div className="contact-info">
            <h3>Let's Talk</h3>
            <p>I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.</p>
            <div className="contact-details">
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>Ashmitbdry@gmail.com</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Bangalore,India</span>
              </div>
            </div>
            <div className="social-links">
              <a 
                href="https://github.com/ashmitkb" 
                aria-label="GitHub"
                onClick={(e) => handleSocialLink('GitHub', e)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSocialLink('GitHub', e);
                  }
                }}
              >
                <i className="fab fa-github"></i>
              </a>
              <a 
                href="https://www.linkedin.com/in/ashmit-bhandary-aba060307/" 
                aria-label="LinkedIn"
                onClick={(e) => handleSocialLink('LinkedIn', e)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSocialLink('LinkedIn', e);
                  }
                }}
              >
                <i className="fab fa-linkedin"></i>
              </a>
              <a 
                href="https://twitter.com/ashmitkb" 
                aria-label="Twitter"
                onClick={(e) => handleSocialLink('Twitter', e)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSocialLink('Twitter', e);
                  }
                }}
              >
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-button">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;