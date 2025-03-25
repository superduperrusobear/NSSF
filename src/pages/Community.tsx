import React from 'react';
import '../styles/Community.css';

const Community: React.FC = () => {
  return (
    <div className="community-page">
      <h1 className="gradient-text">Be Apart of the fastest growing Web3 Platform</h1>

      <div className="social-links">
        <a href="https://discord.gg/saltysol" target="_blank" rel="noopener noreferrer">
          <img src="/images/Discord-Logo.png" alt="Discord" />
        </a>

        <a href="https://t.me/SaltySolBot" target="_blank" rel="noopener noreferrer">
          <img src="/images/telegram logo.png" alt="Telegram" />
        </a>

        <a href="https://twitter.com/BetSaltySol" target="_blank" rel="noopener noreferrer">
          <img src="/images/x-twitter-light-grey-logo-5694251.png" alt="Twitter" />
        </a>

        <a href="https://dexscreener.com/solana/saltysol" target="_blank" rel="noopener noreferrer">
          <img src="/images/dark-66ad3c6be79f67571c0a4c2d_dexscreener.png" alt="DexScreener" />
        </a>
      </div>
    </div>
  );
};

export default Community; 