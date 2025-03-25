import React, { useState } from 'react';
import '../styles/Dashboard.css';

// Custom SVG icons
const WinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="activity-svg win-icon">
    <path d="M8 21v-2a4 4 0 0 1 4-4h2.5M21 15l-5-6M3 6l5 6M21 6l-5 6M3 15l5-6" />
    <circle cx="12" cy="8" r="2" />
    <path d="M12 10v3M17.5 17a2.5 2.5 0 0 0 0 5H22" />
  </svg>
);

const LossIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="activity-svg loss-icon">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const DepositIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="activity-svg deposit-icon">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 8h18M7 16h.01M12 16h.01" />
    <path d="M16 16l1-1 1 1-1 1z" />
  </svg>
);

const WithdrawalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="activity-svg withdrawal-icon">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 8h18M12 13v3M8 13l4-4 4 4" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const TransactionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="2" y1="7" x2="22" y2="7" />
    <line x1="12" y1="17" x2="12" y2="17.01" />
    <path d="M2 11h20M2 15h20M14 21h-4" />
  </svg>
);

const ReferralIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon">
    <path d="M16 22L12 20 8 22M21 16v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M12 12h.01M8 12h.01M16 12h.01" />
    <path d="M12 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="settings-icon">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const VIPIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="vip-icon">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Dashboard: React.FC = () => {
  // More realistic mock user data
  const [userData] = useState({
    username: "CryptoPlayer",
    balance: 2.74,
    totalWagered: 18.42,
    totalWinnings: 16.88,
    gamesPlayed: 67,
    favoriteGame: "Black Jack",
    winRate: 43,
    lastLogin: "Today, 14:30",
    accountCreated: "Oct 20, 2023",
    referralCode: "CRYPTO25X",
    referralEarnings: 0.35,
    referralSignups: 2,
    vipLevel: "Bronze",
    vipPoints: 125,
    nextVipLevel: "Silver",
    nextVipPoints: 250
  });

  // More realistic transaction history with small SOL amounts
  const [transactions] = useState([
    { id: 1, type: "Deposit", amount: 1.0, time: "Today, 10:25", status: "Complete" },
    { id: 2, type: "Win", amount: 0.75, time: "Today, 11:30", status: "Complete", game: "Black Jack" },
    { id: 3, type: "Loss", amount: -0.5, time: "Today, 12:15", status: "Complete", game: "Salty Speedway" },
    { id: 4, type: "Win", amount: 2.0, time: "Today, 09:45", status: "Complete", game: "Salty Speedway" },
    { id: 5, type: "Withdrawal", amount: -1.0, time: "Yesterday, 14:20", status: "Processing" }
  ]);

  // Mock referral users
  const [referrals] = useState([
    { id: 1, username: "SolanaGamer", joinDate: "Oct 10, 2023", wagers: 5.2 },
    { id: 2, username: "CryptoFan", joinDate: "Oct 22, 2023", wagers: 3.5 }
  ]);

  // Active dashboard section
  const [activeSection, setActiveSection] = useState('overview');
  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Get icon based on transaction type
  const getTransactionIcon = (type: string) => {
    switch(type) {
      case "Win":
        return <WinIcon />;
      case "Loss":
        return <LossIcon />;
      case "Deposit":
        return <DepositIcon />;
      case "Withdrawal":
        return <WithdrawalIcon />;
      default:
        return <DepositIcon />;
    }
  };

  // Format SOL with proper decimals
  const formatSOL = (amount: number) => {
    return amount.toFixed(amount % 1 === 0 ? 0 : 3);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-nav">
        <button 
          className={`nav-button ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          <ProfileIcon />
          <span>Account</span>
        </button>
        <button 
          className={`nav-button ${activeSection === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveSection('transactions')}
        >
          <TransactionIcon />
          <span>Transactions</span>
        </button>
        <button 
          className={`nav-button ${activeSection === 'referrals' ? 'active' : ''}`}
          onClick={() => setActiveSection('referrals')}
        >
          <ReferralIcon />
          <span>Referrals</span>
        </button>
      </div>

      <div className="dashboard-content">
        {activeSection === 'overview' && (
          <div className="account-overview">
            <div className="dashboard-summary">
              <div className="profile-header">
                <div className="profile-avatar">
                  {userData.username.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                  <div className="username-vip">
                    <h3>{userData.username}</h3>
                    <div className="vip-badge">
                      <VIPIcon />
                      <span>{userData.vipLevel}</span>
                    </div>
                  </div>
                  <p>Member since {userData.accountCreated}</p>
                  <div className="vip-progress">
                    <div className="vip-progress-bar">
                      <div 
                        className="vip-progress-fill" 
                        style={{ width: `${(userData.vipPoints / (userData.nextVipPoints)) * 100}%` }}
                      ></div>
                    </div>
                    <div className="vip-progress-text">
                      {userData.vipPoints}/{userData.nextVipPoints} points to {userData.nextVipLevel}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <button className="action-button deposit">Deposit</button>
              <button className="action-button withdraw">Withdraw</button>
              <button className="action-button play">Play Now</button>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-title">Balance</div>
                <div className="stat-value highlight">{formatSOL(userData.balance)} SOL</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Total Wagered</div>
                <div className="stat-value">{formatSOL(userData.totalWagered)} SOL</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Total Winnings</div>
                <div className="stat-value">{formatSOL(userData.totalWinnings)} SOL</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Win Rate</div>
                <div className="stat-value">{userData.winRate}%</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Games Played</div>
                <div className="stat-value">{userData.gamesPlayed}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Favorite Game</div>
                <div className="stat-value">{userData.favoriteGame}</div>
              </div>
            </div>

            <div className="active-bonuses">
              <h3>Active Bonuses</h3>
              <div className="bonus-item">
                <div className="bonus-info">
                  <div className="bonus-name">Welcome Bonus</div>
                  <div className="bonus-progress">
                    <div className="bonus-bar">
                      <div className="bonus-fill" style={{ width: '75%' }}></div>
                    </div>
                    <div className="bonus-text">75% completed (0.75/1 SOL wagered)</div>
                  </div>
                </div>
                <div className="bonus-value">+0.25 SOL</div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {transactions.slice(0, 3).map(tx => (
                  <div key={tx.id} className="activity-item">
                    <div className="activity-icon">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div className="activity-details">
                      <div className="activity-title">
                        {tx.type} {tx.game ? `- ${tx.game}` : ""}
                      </div>
                      <div className="activity-time">{tx.time}</div>
                    </div>
                    <div className={`activity-amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
                      {tx.amount > 0 ? '+' : ''}{formatSOL(tx.amount)} SOL
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'transactions' && (
          <div className="transactions-section">
            <div className="transactions-filters">
              <h3>Transaction History</h3>
              <div className="filter-buttons">
                <button className="filter-button active">All</button>
                <button className="filter-button">Deposits</button>
                <button className="filter-button">Withdrawals</button>
                <button className="filter-button">Wins</button>
                <button className="filter-button">Losses</button>
              </div>
            </div>
            <div className="transaction-list">
              {transactions.map(tx => (
                <div key={tx.id} className="transaction-item">
                  <div className="transaction-icon">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div className="transaction-type">{tx.type}</div>
                  <div className="transaction-game">{tx.game || "-"}</div>
                  <div className="transaction-time">{tx.time}</div>
                  <div className={`transaction-amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatSOL(tx.amount)} SOL
                  </div>
                  <div className="transaction-status">{tx.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'referrals' && (
          <div className="referrals-section">
            <div className="referral-stats">
              <div className="stat-card">
                <div className="stat-title">Your Referral Code</div>
                <div className="stat-value code">{userData.referralCode}</div>
                <button className="copy-button">Copy</button>
              </div>
              <div className="stat-card">
                <div className="stat-title">Referral Earnings</div>
                <div className="stat-value">{formatSOL(userData.referralEarnings)} SOL</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Total Referrals</div>
                <div className="stat-value">{userData.referralSignups}</div>
              </div>
            </div>
            
            <div className="referral-benefits">
              <h3>Referral Program Benefits</h3>
              <ul className="benefits-list">
                <li>Earn 5% of your referrals' wagers forever</li>
                <li>They get a 10% deposit bonus when they join</li>
                <li>Unlock special bonuses at 5, 10 and 25 referrals</li>
              </ul>
            </div>
            
            <div className="referred-users">
              <h3>Users You've Referred</h3>
              {referrals.length > 0 ? (
                <div className="referred-list">
                  {referrals.map(referral => (
                    <div key={referral.id} className="referred-item">
                      <div className="referred-username">{referral.username}</div>
                      <div className="referred-date">Joined: {referral.joinDate}</div>
                      <div className="referred-wagers">Wagered: {formatSOL(referral.wagers)} SOL</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-referrals">
                  <p>You haven't referred anyone yet. Share your code to start earning!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="account-settings-link" onClick={() => setShowModal(true)}>
        <SettingsIcon /> Account Settings
      </div>

      {showModal && (
        <div className="settings-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="settings-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Account Settings</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-options">
              <button className="modal-option">Change Username</button>
              <button className="modal-option">Change Avatar</button>
              <button className="modal-option">Two-Factor Authentication</button>
              <button className="modal-option">Responsible Gaming Limits</button>
              <button className="modal-option">Temporarily Pause Account</button>
              <button className="modal-option">Contact Support</button>
              <button className="modal-option danger">Close Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 