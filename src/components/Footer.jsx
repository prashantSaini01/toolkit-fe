import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light p-6 mt-auto shadow-inner">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; 2024 Scraping Assistant. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-4">
          <a href="https://github.com" className="hover:text-primary transition-colors duration-300">GitHub</a>
          <a href="https://twitter.com" className="hover:text-primary transition-colors duration-300">Twitter</a>
          <a href="https://linkedin.com" className="hover:text-primary transition-colors duration-300">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;