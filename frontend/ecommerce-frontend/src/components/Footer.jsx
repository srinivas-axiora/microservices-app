import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} MicroStore Inc. All rights reserved.</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Powered by Microservices Architecture (FastAPI, Spring Boot, Node.js, React)
        </p>
      </div>
    </footer>
  );
};

export default Footer;
