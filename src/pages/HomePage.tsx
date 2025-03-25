import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import PreviewModal from '../components/PreviewModal';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);

  // Add no-scroll class to body when component mounts
  useEffect(() => {
    document.body.classList.add('no-scroll');
    
    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const handleSignUp = () => {
    window.location.href = '/signup';
  };

  return (
    <>
      <div className="home-container">
        <PreviewModal 
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSignUp={handleSignUp}
        />

        <main className="home-main">
          <h2 className="home-cta">
            Join the Web3 Experience—Stake, Win Big, Claim your Share in the Community Pool
          </h2>
          
          <div className="game-cards-container">
            <Link to="/games/blackjack" className="game-card">
              <div className="game-image">
                <img src="/images/blackjack.png" alt="Black Jack" />
              </div>
              <div className="game-content">
                <h3 className="game-title">Black Jack</h3>
                <p className="game-description">
                  Face the dealer in a Web3-powered classic. Aim for 21, outsmart the house, and claim your share from the community pot—no hidden edges!
                </p>
              </div>
            </Link>

            <Link to="/games/speedway" className="game-card">
              <div className="game-image">
                <img src="/images/speedway.png" alt="Salty Speedway" />
              </div>
              <div className="game-content">
                <h3 className="game-title">Salty Speedway</h3>
                <p className="game-description">
                  Rev your engines for a high-octane Web3 race. Back your racer, outpace the competition, and grab your piece of the prize pool—fueled by Solana!
                </p>
              </div>
            </Link>
          </div>
        </main>

        <div className="info-bar">
          <div className="info-stats">
            <div className="info-item">
              <span className="info-label">Total Jackpot Pool</span>
              <span className="info-value">
                <span className="sol-amount">2,547,892</span> SOL
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Bets Placed</span>
              <span className="info-value">1,234,567</span>
            </div>
            <div className="info-item">
              <span className="info-label">Amount Distributed</span>
              <span className="info-value">
                <span className="sol-amount">892,345</span> SOL
              </span>
            </div>
          </div>
          <div className="responsible-gaming">
            PLEASE PLAY RESPONSIBLY
          </div>
        </div>
      </div>
      
      {/* Simple News Ticker - guaranteed to be visible */}
      <div className="news-ticker-container">
        <div className="news-ticker">
          <span className="ticker-highlight">COMING SOON:</span> Flappy Sol • Crash • Dice • Roulette • And more... &nbsp;&nbsp;&nbsp;
          <span className="ticker-highlight">LEARN MORE:</span> View our documentation to understand how our games work &nbsp;&nbsp;&nbsp;
          <span className="ticker-highlight">WEB3 GAMING:</span> Truly fair, transparent and community-owned gaming &nbsp;&nbsp;&nbsp;
          <span className="ticker-highlight">JOIN US:</span> Sign up now for private access to exclusive rewards &nbsp;&nbsp;&nbsp;
          <span className="ticker-highlight">COMMUNITY:</span> Connect with us on Discord and Twitter &nbsp;&nbsp;&nbsp;
          <span className="ticker-highlight">JACKPOT POWERED BY YOU:</span> Every bet adds fuel to the pot &nbsp;&nbsp;&nbsp;
          <span className="ticker-highlight">GAMES BUILT FOR THE CHAIN:</span> Play, win, and earn on Solana &nbsp;&nbsp;&nbsp;
          <span className="ticker-highlight">OWN A PIECE OF THE ACTION:</span> This is your casino. Community-owned. Community-run &nbsp;&nbsp;&nbsp;
          <span className="ticker-highlight">STAY CONNECTED, STAY AHEAD:</span> Join the Discord. Follow the X. Be part of the legend &nbsp;&nbsp;&nbsp;
          <span className="ticker-highlight">BUILT ON SOLANA. POWERED BY SPEED:</span> Instant bets. Lightning-fast payouts. Solana makes it seamless &nbsp;&nbsp;&nbsp;
          <span className="ticker-highlight">GET IN EARLY:</span> Get Salty. Grab $SLSOL &nbsp;&nbsp;&nbsp;
          <span className="ticker-highlight">COMING SOON:</span> Flappy Sol • Crash • Dice • Roulette • And more... &nbsp;&nbsp;&nbsp;
          <span className="ticker-highlight">LEARN MORE:</span> View our documentation to understand how our games work &nbsp;&nbsp;&nbsp;
          <span className="ticker-highlight">WEB3 GAMING:</span> Truly fair, transparent and community-owned gaming
        </div>
      </div>
    </>
  );
};

export default HomePage; 