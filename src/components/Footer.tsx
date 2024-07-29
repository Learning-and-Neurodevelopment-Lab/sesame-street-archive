import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';
import landlabicon from '../assets/images/LandLab.png';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/download">Download</Link>
        <Link to="/admin">Upload</Link>
        <Link to="/guide">Guide</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
      
      <div className="footer-social">
        <a className="footer-icon" href="https://www.vanderbiltlandlab.io" target="_blank" rel="noopener noreferrer">
        <img src={landlabicon} alt="LAND Lab icon" width={50} />
        </a>
      </div>
      <div className="footer-text">
        © 2024 LAND Lab.     
      </div>
    </footer>
  );
};

export default Footer;
