import React, { useEffect } from 'react';
import '../styles/PreviewModal.css';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, onSignUp }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="preview-modal-wrapper modal-wrapper">
      <div className="preview-modal-overlay modal-overlay" onClick={onClose}></div>
      <div className="preview-modal-container modal-container">
        <div className="preview-modal-content modal-content">
          <div className="preview-modal-logo-container modal-logo-container">
            <img src="/images/s.png" alt="Salty Sol Logo" className="preview-modal-logo modal-logo" />
          </div>
          
          <div className="preview-modal-body modal-body">
            <p className="preview-modal-description modal-description">
              You're viewing a preview of our platform. Explore the interface and features before our full launch.
            </p>
            
            <div className="preview-modal-feature-list feature-list">
              <p>• Salty Sol is powered by your bets. Every wager fuels the pool, and every win comes straight from it.</p>
              <p>• Curious about the nitty-gritty? Read our docs to see how we handle randomness, payouts, and platform security.</p>
            </div>

            <div className="preview-modal-actions modal-actions">
              <a 
                href="/signup" 
                className="preview-modal-signup modal-signup"
              >
                Sign Up for Private Access
              </a>
              <button className="preview-modal-referral modal-referral" onClick={onClose}>
                Continue Preview
              </button>
            </div>

            <p className="preview-modal-footer modal-footer">
              Please play responsibly and only risk what you can afford to lose.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal; 