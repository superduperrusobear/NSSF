import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/SignUpPage.css';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [step, setStep] = useState(1);
  const [walletConnected, setWalletConnected] = useState(false);
  const navigate = useNavigate();

  const handleFirstSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSecondSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleConnectWallet = () => {
    // In a real app, this would connect to Phantom wallet
    console.log('Connecting wallet...');
    setTimeout(() => {
      setWalletConnected(true);
      setStep(4);
    }, 1500);
  };

  const handleGoToTelegram = () => {
    window.open('https://t.me/SaltySolBot', '_blank');
  };

  const renderStep1 = () => (
    <div className="signup-form-container">
      <div className="signup-form-header">
        <h1>Create an account</h1>
        <p>Enter your details below to create your account</p>
      </div>
      
      <form onSubmit={handleFirstSubmit} className="minimal-signup-form">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input 
            type="text" 
            id="firstName" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input 
            type="text" 
            id="lastName" 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="signup-submit-button">
          Continue
        </button>
        
        <div className="or-divider">
          <span>Or</span>
        </div>
        
        <Link to="/" className="login-link">
          Login
        </Link>
        
        <p className="terms-text">
          By clicking continue, you agree to our terms of use.
        </p>
      </form>
    </div>
  );

  const renderStep2 = () => (
    <div className="signup-form-container">
      <div className="signup-form-header">
        <h1>Additional Information</h1>
        <p>Tell us a bit more about how you found us</p>
      </div>
      
      <form onSubmit={handleSecondSubmit} className="minimal-signup-form">
        <div className="form-group">
          <label htmlFor="referralSource">How did you find out about Salty Sol?</label>
          <select 
            id="referralSource" 
            value={referralSource}
            onChange={(e) => setReferralSource(e.target.value)}
            required
            className="form-select"
          >
            <option value="" disabled>Select an option</option>
            <option value="twitter">Twitter</option>
            <option value="discord">Discord</option>
            <option value="telegram">Telegram</option>
            <option value="friend">Friend</option>
            <option value="search">Search Engine</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="referralCode">Referral Code (Optional)</label>
          <input 
            type="text" 
            id="referralCode" 
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            placeholder="Enter your referral code if you have one"
          />
        </div>
        
        <button type="submit" className="signup-submit-button">
          Continue
        </button>
        
        <button 
          type="button" 
          className="back-button"
          onClick={() => setStep(1)}
        >
          Back
        </button>
      </form>
    </div>
  );

  const renderStep3 = () => (
    <div className="signup-form-container">
      <div className="signup-form-header">
        <h1>Connect your Wallet</h1>
        <p>Connect your Phantom wallet to continue</p>
      </div>
      
      <div className="wallet-connect-container">
        <div className="wallet-icon">
          <img src="/images/phantom.png" alt="Phantom Wallet" className="wallet-logo" />
        </div>
        
        <p className="wallet-description">
          Connecting your wallet is required to get private access to Salty Sol.
        </p>
        
        <button 
          onClick={handleConnectWallet} 
          className="wallet-connect-button"
          disabled={walletConnected}
        >
          {walletConnected ? 'Wallet Connected' : 'Connect Phantom Wallet'}
        </button>
        
        <button 
          type="button" 
          className="back-button"
          onClick={() => setStep(2)}
        >
          Back
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="signup-form-container">
      <div className="signup-success">
        <div className="success-icon">✓</div>
        <h1>Request Received!</h1>
        <p>Thank you for your interest in Salty Sol private access.</p>
        <p>Your request has been received and is being processed.</p>
        
        <div className="telegram-container">
          <p>For the next steps, please join our Telegram bot:</p>
          <button 
            onClick={handleGoToTelegram} 
            className="telegram-button"
          >
            Join @SaltySolBot on Telegram
          </button>
        </div>
        
        <p className="note-text">
          Note: Private access is limited and subject to approval.
        </p>
      </div>
    </div>
  );

  return (
    <div className="minimal-signup-page">
      <div className="signup-left">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>
      
      <div className="signup-right">
        <div className="logo-container">
          <img src="/images/s.png" alt="Salty Sol Logo" />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage; 