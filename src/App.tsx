import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import BlackJackGame from './pages/BlackJackGame';
import SaltySpeedwayGame from './pages/SaltySpeedwayGame';
import Leaderboards from './pages/Leaderboards';
import Community from './pages/Community';
import Dashboard from './pages/Dashboard';
import Documentation from './pages/Documentation';
import Roadmap from './pages/Roadmap';
import SignUpPage from './pages/SignUpPage';
import './App.css';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isOnSplash = location.pathname === '/';
  const isOnDocs = location.pathname === '/docs';
  const isOnSignUp = location.pathname === '/signup';

  if (isOnSplash || isOnSignUp) {
    return <>{children}</>;
  }

  if (isOnDocs) {
    return <>{children}</>;
  }

  return (
    <div className="app-container">
      <header className="home-header">
        <Link to="/home" className="logo-container">
          <img src="/images/salty-sol-logo.png" alt="Salty Sol Logo" className="home-logo" />
        </Link>
        <div className="nav-divider">|</div>
        <nav className="main-nav">
          <Link to="/leaderboards" className="nav-link">Leaderboards</Link>
          <div className="nav-divider">|</div>
          <Link to="/docs" className="nav-link">Docs</Link>
          <div className="nav-divider">|</div>
          <Link to="/community" className="nav-link">Community</Link>
          <div className="nav-divider">|</div>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <div className="nav-divider">|</div>
          <Link to="/roadmap" className="nav-link">Roadmap</Link>
        </nav>
        <div className="wallet-section">
          <button className="deposit-btn">Deposit</button>
          <div className="wallet-balance">
            <span className="balance-value">5.00</span>
            <span className="balance-currency">SOL</span>
          </div>
        </div>
      </header>

      <div className="main-content">
        {children}
      </div>

      <div className="info-bar">
        <div className="info-stats">
          <div className="info-item">
            <span className="info-label">Total Jackpot Pool</span>
            <span className="info-value">13 SOL</span>
          </div>
          <div className="info-item">
            <span className="info-label">Total Bets Placed</span>
            <span className="info-value">137</span>
          </div>
          <div className="info-item">
            <span className="info-label">Amount Distributed</span>
            <span className="info-value">8.5 SOL</span>
          </div>
        </div>
        <div className="responsible-gaming">
          PLEASE PLAY RESPONSIBLY
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/games/blackjack" element={<BlackJackGame />} />
            <Route path="/games/speedway" element={<SaltySpeedwayGame />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/community" element={<Community />} />
            <Route path="/roadmap" element={<Roadmap />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App; 