import React from 'react';
import '../styles/Leaderboards.css';

// Mock data for demonstration - replace with real data later
const leaderboardData = [
  {
    username: "SSDEVELOPER",
    gamesPlayed: 56,
    totalStaked: 2.5,
    pnl: 3.2,
    mostPlayedGame: "Black Jack"
  },
  {
    username: "aqfut.",
    gamesPlayed: 43,
    totalStaked: 1.8,
    pnl: 2.1,
    mostPlayedGame: "Salty Speedway"
  },
  {
    username: "ripMYsol.",
    gamesPlayed: 39,
    totalStaked: 1.2,
    pnl: 1.5,
    mostPlayedGame: "Salty Speedway"
  },
  {
    username: "reqsted",
    gamesPlayed: 28,
    totalStaked: 1.5,
    pnl: 1.2,
    mostPlayedGame: "Salty Speedway"
  },
  {
    username: "d3ghen",
    gamesPlayed: 32,
    totalStaked: 2.0,
    pnl: 0.5,
    mostPlayedGame: "Black Jack"
  }
  // Add more mock data as needed
];

const Leaderboards: React.FC = () => {
  return (
    <div className="leaderboards-container">
      <div className="leaderboards-header">
        <div className="logo-container">
          <img src="/images/s.png" alt="Salty Sol Logo" className="leaderboard-logo" />
        </div>
        <p className="subtitle">Top Earners on Salty Sol</p>
      </div>

      <div className="leaderboards-content">
        <table className="leaderboards-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Games Played</th>
              <th>Total Staked</th>
              <th>PNL</th>
              <th>Most Played Game</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((player, index) => (
              <tr key={player.username}>
                <td className="rank">{index + 1}</td>
                <td className="username">{player.username}</td>
                <td className="games-played">{player.gamesPlayed}</td>
                <td className="total-staked">{player.totalStaked.toFixed(2)} SOL</td>
                <td className={`pnl ${player.pnl >= 0 ? 'positive' : 'negative'}`}>
                  {player.pnl >= 0 ? '+' : ''}{player.pnl.toFixed(2)} SOL
                </td>
                <td className="most-played">{player.mostPlayedGame}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboards; 