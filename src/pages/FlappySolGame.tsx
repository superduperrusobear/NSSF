import React from 'react';
import '../styles/GamePage.css';

const FlappySolGame: React.FC = () => {
  return (
    <div className="game-page">
      <a href="#" className="exit-link" onClick={(e) => {
        e.preventDefault();
        window.history.back();
      }}>
        Exit Game
      </a>
      
      <div className="coming-soon-container">
        <div className="coming-soon-content">
          <h1>Coming Soon</h1>
          <p>Flappy Sol is currently in development.</p>
          <p>Check back soon for updates!</p>
        </div>
      </div>
    </div>
  );
};

export default FlappySolGame; 