import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiHome, 
  FiBook, 
  FiSearch, 
  FiUser, 
  FiSettings,
  FiInstagram,
  FiTwitter,
  FiFacebook
} from 'react-icons/fi';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      {/* Main Footer Content */}
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-heading">Explore</h3>
          <ul className="footer-links">
            <li><Link to="/"><FiHome className="footer-icon" /> Home</Link></li>
            <li><Link to="/collection"><FiBook className="footer-icon" /> Collection</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Account</h3>
          <ul className="footer-links">
            <li><Link to="/account"><FiUser className="footer-icon" /> Profile</Link></li>
            <li><Link to="/setting"><FiSettings className="footer-icon" /> Settings</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Connect</h3>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FiInstagram className="social-icon" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FiTwitter className="social-icon" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FiFacebook className="social-icon" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MyBookShelf. All rights reserved.</p>
        <div className="legal-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;