import React from 'react';

interface BettingPanelProps {
  betAmount: number;
  onBetChange: (amount: number) => void;
  multiplier: number;
  disabled?: boolean;
  minBet?: number;
  maxBet?: number;
}

const BettingPanel: React.FC<BettingPanelProps> = ({
  betAmount,
  onBetChange,
  multiplier,
  disabled = false,
  minBet = 0.1,
  maxBet = 2.9
}) => {
  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) return;
    
    // Clamp bet amount between min and max
    const clampedValue = Math.min(Math.max(value, minBet), maxBet);
    onBetChange(parseFloat(clampedValue.toFixed(2)));
  };

  const setQuickBetAmount = (amount: number) => {
    const maxBetAmount = Math.min(amount, maxBet);
    onBetChange(parseFloat(maxBetAmount.toFixed(2)));
  };

  return (
    <div className="betting-panel">
      <h3 className="betting-title">PLACE YOUR BET</h3>
      
      <div className="bet-amount-container">
        <div className="bet-input-group">
          <label className="bet-input-label">BET AMOUNT (SOL)</label>
          <input 
            type="number"
            className="bet-input"
            value={betAmount}
            onChange={handleBetChange}
            min={minBet}
            max={maxBet}
            step={0.1}
            disabled={disabled}
          />
        </div>
        
        <input 
          type="range"
          className="bet-slider"
          min={minBet}
          max={maxBet}
          step={0.1}
          value={betAmount}
          onChange={handleBetChange}
          disabled={disabled}
        />
        
        <div className="bet-quick-amounts">
          <button 
            className="quick-amount"
            onClick={() => setQuickBetAmount(0.1)}
            disabled={disabled}
          >
            0.1
          </button>
          <button 
            className="quick-amount"
            onClick={() => setQuickBetAmount(0.5)}
            disabled={disabled}
          >
            0.5
          </button>
          <button 
            className="quick-amount"
            onClick={() => setQuickBetAmount(1.0)}
            disabled={disabled}
          >
            1.0
          </button>
          <button 
            className="quick-amount"
            onClick={() => setQuickBetAmount(2.0)}
            disabled={disabled}
          >
            2.0
          </button>
        </div>
      </div>
      
      <div className="multiplier-section">
        <div className="multiplier-info">
          <div className="multiplier-title">CURRENT MULTIPLIER</div>
          <div className="multiplier-value">{multiplier.toFixed(2)}x</div>
          <div className="multiplier-explanation">
            Pass 4+ cars to receive a payout.<br/>
            Each additional car adds 0.04x to your multiplier.
          </div>
        </div>
        
        <div className="potential-win">
          Potential win: <span className="win-amount">
            {(betAmount * (1 + multiplier)).toFixed(2)} SOL
          </span>
        </div>
      </div>
    </div>
  );
};

export default BettingPanel; 