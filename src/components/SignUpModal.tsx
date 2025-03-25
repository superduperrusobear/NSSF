import React, { useState, useEffect } from 'react';
import '../styles/SignUpModal.css';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      // Move to next step
      setStep(2);
    } else {
      // Submit the form
      console.log('Signup submitted', { email, username, referralCode });
      
      // Show success message
      setSuccess(true);
      
      // In a real app, you would make an API call here
      // For now, we'll simulate a success after submission
    }
  };

  return (
    <div className="signup-modal-wrapper modal-wrapper">
      <div className="signup-modal-overlay modal-overlay" onClick={onClose}></div>
      <div className="signup-modal-container modal-container">
        <div className="signup-modal-content modal-content">
          <button className="close-button" onClick={onClose}>×</button>
          
          <div className="signup-modal-logo-container modal-logo-container">
            <img src="/images/s.png" alt="Salty Sol Logo" className="signup-modal-logo modal-logo" />
          </div>
          
          {!success ? (
            <div className="signup-modal-body modal-body">
              <h2 className="signup-modal-title modal-title">
                {step === 1 ? 'Sign Up for Private Access' : 'Complete Your Profile'}
              </h2>
              
              <p className="signup-modal-description modal-description">
                {step === 1 
                  ? 'Join our exclusive community of early adopters and get access to Salty Sol before the public launch.'
                  : 'Almost there! Just a few more details to customize your experience.'}
              </p>
              
              <form onSubmit={handleSubmit} className="signup-form">
                {step === 1 ? (
                  <>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="youremail@example.com"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="referralCode">Referral Code (Optional)</label>
                      <input 
                        type="text" 
                        id="referralCode"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        placeholder="Enter code if you have one"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label htmlFor="username">Choose a Username</label>
                      <input 
                        type="text" 
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Your gaming handle"
                      />
                    </div>
                    
                    <div className="form-group checkbox-group">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        required
                      />
                      <label htmlFor="terms">I agree to the Terms of Service and Privacy Policy</label>
                    </div>
                    
                    <div className="form-group checkbox-group">
                      <input 
                        type="checkbox" 
                        id="age" 
                        required
                      />
                      <label htmlFor="age">I confirm that I am 18 years or older</label>
                    </div>
                  </>
                )}
                
                <button type="submit" className="submit-button">
                  {step === 1 ? 'Continue' : 'Complete Sign Up'}
                </button>
              </form>
              
              <p className="signup-modal-footer modal-footer">
                By signing up, you'll be first in line for exclusive rewards and community participation.
              </p>
            </div>
          ) : (
            <div className="signup-success">
              <div className="success-icon">✓</div>
              <h2>You're In!</h2>
              <p>Thanks for signing up for private access to Salty Sol.</p>
              <p>We've sent a confirmation email to <strong>{email}</strong> with next steps.</p>
              <p>Keep an eye on your inbox for your exclusive access link.</p>
              <button onClick={onClose} className="submit-button">
                Got It
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpModal; 