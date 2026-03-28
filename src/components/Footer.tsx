'use client';

import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        
        <div className="footer-col brand-col">
          <a href="#" className="navbar-brand footer-brand">Creativity</a>
          <p className="brand-desc">Research &amp; Development in 3D Collisions and WebGL Experiences.</p>
        </div>

        <div className="footer-col">
          <h3>Contact</h3>
          <ul className="footer-link-list">
            <li><a href="mailto:contact@example.com">contact@example.com</a></li>
            <li><a href="tel:+1234567890">+1 234 567 890</a></li>
            <li><a href="#">New York, USA</a></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h3>Social</h3>
          <ul className="footer-link-list">
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">LinkedIn</a></li>
            <li><a href="#">Dribbble</a></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h3>Navigation</h3>
          <ul className="footer-link-list">
            <li><a href="#hero">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Work</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        
      </div>
      
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Meet-The-New. All rights reserved.
      </div>
    </footer>
  );
}
