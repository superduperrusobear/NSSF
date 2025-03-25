import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/SplashPage.css';

const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const features = [
    "All Profits Return to Players",
    "Built by the Community, for the Community",
    "Transparent, Decentralized, and Fair",
    "Every Bet Fuels the Jackpot Pool",
    "Secured by Solana",
    "Instant Payouts with Zero Middlemen",
    "Play Anytime, Anywhere—Globally Accessible",
    "Fair Distribution"
  ];

  const handlePreviewClick = () => {
    navigate('/home');
  };

  const handleSignUpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/signup';
  };

  return (
    <div className="splash-container">
      <a 
        href="/signup"
        className="signup-button"
        tabIndex={0}
        aria-label="Sign Up for Private Access"
        onClick={(e) => {
          e.preventDefault();
          window.location.href = "/signup";
        }}
      >
        Sign Up for Private Access
      </a>

      <motion.div 
        className="splash-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="splash-logo">
          <img src="/images/salty-sol-logo.png" alt="Salty Sol Logo" />
        </div>

        <button 
          className="preview-button"
          onClick={handlePreviewClick}
          tabIndex={0}
          aria-label="Preview"
        >
          PREVIEW
        </button>
      </motion.div>
      
      <div className="features-ticker-container">
        <div className="features-ticker">
          {[...features, ...features, ...features, ...features, ...features].map((feature, index) => (
            <div className="ticker-item" key={index}>
              <span className="checkmark">✓</span>
              <span className="feature-text">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="footer">
        <div className="footer-links">
          <a href="/docs" className="footer-link" tabIndex={0} aria-label="Documentation">Documentation</a>
          <a href="/roadmap" className="footer-link" tabIndex={0} aria-label="Roadmap">Roadmap</a>
          <a href="/faq" className="footer-link" tabIndex={0} aria-label="FAQ">FAQ</a>
          <a href="/referrals" className="footer-link" tabIndex={0} aria-label="Referrals">Referrals</a>
        </div>
        <div className="copyright">
          © 2025 Salty Sol. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default SplashPage; 