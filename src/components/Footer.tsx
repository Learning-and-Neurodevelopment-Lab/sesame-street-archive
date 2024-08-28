import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';
import landlabicon from '../assets/images/LandLab.png';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/guide">Guide</Link>
        <Link to="/about">About</Link>
        <Link to="/metrics">Metrics</Link>
        <a href="https://peabody.az1.qualtrics.com/jfe/preview/previewId/0419baa6-934b-4d65-a11c-e8e6f79c85b9/SV_eRQUVmfS4d7q4yq?Q_CHL=preview&Q_SurveyVersionID=current" target="_blank" rel="noopener noreferrer">
              Feedback
            </a>
      </div>
      <div className="footer-text">
        © 2024 LANDLAB    
      </div>
      <div className="footer-social">
        <a className="footer-icon" href="https://www.vanderbiltlandlab.io" target="_blank" rel="noopener noreferrer">
        <img src={landlabicon} alt="LANDLab icon" width={50} />
        </a>
      </div>

    </footer>
  );
};

export default Footer;
