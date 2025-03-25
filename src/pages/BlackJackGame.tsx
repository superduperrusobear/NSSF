import React, { useState, useEffect } from 'react';
import '../styles/GamePage.css';
import '../styles/BlackJackGame.css';

type Card = {
  suit: string;
  value: string;
  numerical: number;
};

type GameState = 'betting' | 'playing' | 'dealerTurn' | 'gameOver';

const BlackJackGame: React.FC = () => {
  // Modal state
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  
  // Game state
  const [gameState, setGameState] = useState<GameState>('betting');
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [betAmount, setBetAmount] = useState(0.1);
  const [balance, setBalance] = useState(5.0);
  const [message, setMessage] = useState('Place your bet to start the game');
  const [result, setResult] = useState<'win' | 'lose' | 'push' | ''>('');
  const [gamesPlayed, setGamesPlayed] = useState(0);
  
  // Stats
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [profit, setProfit] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  
  // Create and shuffle a new deck
  const createDeck = () => {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const newDeck: Card[] = [];
    
    for (const suit of suits) {
      for (const value of values) {
        let numerical = parseInt(value);
        if (isNaN(numerical)) {
          if (value === 'A') {
            numerical = 11;
          } else {
            numerical = 10;
          }
        }
        newDeck.push({ suit, value, numerical });
      }
    }
    
    // Shuffle the deck (Fisher-Yates algorithm)
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    
    // Add some slight bias against the player (make game harder to win)
    // Place more high cards in the first half of the deck for dealer
    for (let i = 0; i < 10; i++) {
      const highCardIndex = newDeck.findIndex(
        (card, index) => index > 26 && (card.value === 'A' || card.numerical === 10)
      );
      if (highCardIndex !== -1) {
        const temp = newDeck[highCardIndex];
        newDeck.splice(highCardIndex, 1);
        newDeck.unshift(temp);
      }
    }
    
    return newDeck;
  };
  
  // Calculate score for a hand, handling aces
  const calculateScore = (hand: Card[]) => {
    let score = hand.reduce((total, card) => total + card.numerical, 0);
    let aces = hand.filter(card => card.value === 'A').length;
    
    // Adjust aces from 11 to 1 as needed
    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }
    
    return score;
  };
  
  // Deal a card from the deck
  const dealCard = (currentDeck: Card[] = deck) => {
    if (currentDeck.length === 0) {
      currentDeck = createDeck();
    }
    const card = currentDeck.pop()!;
    setDeck([...currentDeck]);
    return card;
  };
  
  // Start a new game
  const startGame = () => {
    if (balance < betAmount) {
      setMessage('Not enough balance for this bet');
      return;
    }
    
    const newDeck = createDeck();
    const playerCards = [newDeck.pop()!, newDeck.pop()!];
    const dealerCards = [newDeck.pop()!, newDeck.pop()!];
    
    setDeck(newDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setPlayerScore(calculateScore(playerCards));
    setDealerScore(calculateScore([dealerCards[0]])); // Only show score for first dealer card
    setGameState('playing');
    setMessage('Hit or Stand?');
    setResult('');
    setBalance(prevBalance => prevBalance - betAmount);
    
    // Increment games played counter
    setGamesPlayed(prev => prev + 1);
  };
  
  // Player action: Hit
  const handleHit = () => {
    if (gameState !== 'playing') return;
    
    const card = dealCard();
    const updatedHand = [...playerHand, card];
    setPlayerHand(updatedHand);
    
    const score = calculateScore(updatedHand);
    setPlayerScore(score);
    
    if (score > 21) {
      endGame('bust');
    }
  };
  
  // Player action: Stand
  const handleStand = () => {
    if (gameState !== 'playing') return;
    
    setGameState('dealerTurn');
    dealerPlay();
  };
  
  // Dealer's turn
  const dealerPlay = () => {
    let currentDealerHand = [...dealerHand];
    let currentDeck = [...deck];
    
    // Reveal both dealer cards
    setDealerScore(calculateScore(currentDealerHand));
    
    // Dealer draws until they have 17 or more
    let dealerScore = calculateScore(currentDealerHand);
    
    setTimeout(() => {
      const drawCard = () => {
        if (dealerScore < 17) {
          const card = currentDeck.pop()!;
          currentDealerHand.push(card);
          setDealerHand([...currentDealerHand]);
          dealerScore = calculateScore(currentDealerHand);
          setDealerScore(dealerScore);
          
          setTimeout(() => {
            if (dealerScore < 17) {
              drawCard();
            } else {
              determineWinner(calculateScore(playerHand), dealerScore);
            }
          }, 800); // Delay between dealer cards
        } else {
          determineWinner(calculateScore(playerHand), dealerScore);
        }
      };
      
      drawCard();
    }, 800); // Initial delay
  };
  
  // Determine the winner
  const determineWinner = (playerScore: number, dealerScore: number) => {
    if (playerScore > 21) {
      endGame('bust');
    } else if (dealerScore > 21) {
      endGame('dealerBust');
    } else if (playerScore > dealerScore) {
      endGame('playerWin');
    } else if (dealerScore > playerScore) {
      endGame('dealerWin');
    } else {
      endGame('push');
    }
  };
  
  // End the game and update stats
  const endGame = (outcome: 'bust' | 'dealerBust' | 'playerWin' | 'dealerWin' | 'push') => {
    let resultMessage = '';
    let winAmount = 0;
    
    switch (outcome) {
      case 'bust':
        resultMessage = 'Bust! You lose.';
        setLosses(prev => prev + 1);
        setResult('lose');
        setCurrentStreak(0); // Reset streak on loss
        break;
      case 'dealerBust':
        resultMessage = 'Dealer busts! You win!';
        winAmount = betAmount * 2;
        setWins(prev => prev + 1);
        setResult('win');
        updateStreak(true); // Update streak on win
        break;
      case 'playerWin':
        resultMessage = 'You win!';
        winAmount = betAmount * 2;
        setWins(prev => prev + 1);
        setResult('win');
        updateStreak(true); // Update streak on win
        break;
      case 'dealerWin':
        resultMessage = 'Dealer wins. You lose.';
        setLosses(prev => prev + 1);
        setResult('lose');
        setCurrentStreak(0); // Reset streak on loss
        break;
      case 'push':
        resultMessage = 'Push! Bet returned.';
        winAmount = betAmount;
        setResult('push');
        // Don't change streak on push
        break;
    }
    
    setBalance(prev => {
      const newBalance = prev + winAmount;
      return parseFloat(newBalance.toFixed(2));
    });
    
    setProfit(prev => {
      const newProfit = prev + (winAmount - betAmount);
      return parseFloat(newProfit.toFixed(2));
    });
    
    setMessage(resultMessage);
    setGameState('gameOver');
    
    // Check if we should show the warning modal
    if (gamesPlayed === 4) {
      setTimeout(() => {
        setShowWarningModal(true);
      }, 1000);
    }
  };
  
  // Update streak counter
  const updateStreak = (win: boolean) => {
    if (win) {
      setCurrentStreak(prev => {
        const newStreak = prev + 1;
        // Update best streak if current streak is higher
        if (newStreak > bestStreak) {
          setBestStreak(newStreak);
        }
        return newStreak;
      });
    } else {
      setCurrentStreak(0);
    }
  };
  
  // Adjust bet amount
  const adjustBet = (amount: number) => {
    if (gameState !== 'betting' && gameState !== 'gameOver') return;
    
    let newBet = betAmount + amount;
    
    // Enforce min/max bet limits
    if (newBet < 0.1) newBet = 0.1;
    if (newBet > 6.8) newBet = 6.8;
    if (newBet > balance) newBet = balance;
    
    setBetAmount(parseFloat(newBet.toFixed(1)));
  };
  
  // Calculate win rate
  const winRate = wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0;
  
  // Modal logic
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showHowToPlay) {
        setShowHowToPlay(false);
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    if (showHowToPlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [showHowToPlay]);
  
  const handleOpenModal = () => {
    setShowHowToPlay(true);
  };
  
  const handleCloseModal = () => {
    setShowHowToPlay(false);
  };
  
  // Handle continuing after warning
  const handleContinuePlaying = () => {
    setShowWarningModal(false);
  };
  
  // Handle exit after warning
  const handleExitGame = () => {
    setShowWarningModal(false);
    window.history.back();
  };
  
  return (
    <div className="game-page">
      <a href="#" className="exit-link" onClick={(e) => {
        e.preventDefault();
        window.history.back();
      }}>
        Exit Game
      </a>
      
      <div className="game-stats-panel">
        <div className="stats-section">
          <div className="stat-item">
            <span className="stat-label">BALANCE</span>
            <span className="stat-value">{balance.toFixed(2)} SOL</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">WINS</span>
            <span className="stat-value">{wins}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">LOSSES</span>
            <span className="stat-value">{losses}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">WIN RATE</span>
            <span className="stat-value">{winRate}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">PROFIT</span>
            <span className="stat-value">{profit.toFixed(2)} SOL</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">STREAK</span>
            <span className="stat-value streak-value">{currentStreak}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">BEST STREAK</span>
            <span className="stat-value">{bestStreak}</span>
          </div>
        </div>

        <div className="game-rules">
          <div className="rule-item">BLACKJACK PAYS 3:2</div>
          <div className="rule-item">MIN BET 0.1 SOL</div>
          <div className="rule-item">MAX BET 6.8 SOL</div>
          <button
            onClick={handleOpenModal}
            className="help-button"
          >
            HOW TO PLAY
          </button>
        </div>
      </div>
      
      <div className="blackjack-game">
        <div className="player-section">
          <div className="player-label">Your Hand: {gameState !== 'betting' ? playerScore : ''}</div>
          <div className="cards player-cards">
            {playerHand.map((card, index) => (
              <div 
                key={`player-${index}`} 
                className={`card ${card.suit === '♥' || card.suit === '♦' ? 'red' : 'black'}`}
              >
                <div className="card-value-top">{card.value}</div>
                <div className="card-suit">{card.suit}</div>
                <div className="card-value-bottom">{card.value}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="dealer-section">
          <div className="dealer-label">Dealer: {gameState !== 'betting' ? dealerScore : ''}</div>
          <div className="cards dealer-cards">
            {dealerHand.map((card, index) => (
              <div 
                key={`dealer-${index}`} 
                className={`card ${card.suit === '♥' || card.suit === '♦' ? 'red' : 'black'} ${index === 1 && gameState === 'playing' ? 'card-back' : ''}`}
              >
                {index === 1 && gameState === 'playing' ? (
                  <div className="card-back-design">
                    <img src="/images/s.png" alt="Logo" className="card-back-logo" />
                  </div>
                ) : (
                  <>
                    <div className="card-value-top">{card.value}</div>
                    <div className="card-suit">{card.suit}</div>
                    <div className="card-value-bottom">{card.value}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="game-controls">
          <div className={`message ${result}`}>{message}</div>
          
          {gameState === 'betting' || gameState === 'gameOver' ? (
            <div className="betting-controls">
              <div className="bet-amount">
                <span>BET: {betAmount.toFixed(1)} SOL</span>
              </div>
              <div className="bet-adjusters">
                <button onClick={() => adjustBet(-0.1)} className="bet-btn">-</button>
                <button onClick={() => adjustBet(0.1)} className="bet-btn">+</button>
              </div>
              <button 
                onClick={startGame} 
                className="action-btn deal-btn"
                disabled={balance < betAmount}
              >
                DEAL
              </button>
            </div>
          ) : gameState === 'playing' ? (
            <div className="action-controls">
              <button onClick={handleHit} className="action-btn hit-btn">HIT</button>
              <button onClick={handleStand} className="action-btn stand-btn">STAND</button>
            </div>
          ) : (
            <div className="next-game-controls">
              <button onClick={() => setGameState('betting')} className="action-btn next-btn">
                NEXT GAME
              </button>
            </div>
          )}
        </div>
      </div>

      {/* How to Play Modal */}
      {showHowToPlay && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            <h3 className="modal-title">HOW TO PLAY</h3>
            
            <div className="modal-rules">
              <div className="modal-rule">
                <span className="rule-number">1</span>
                <span className="rule-text">Place your bet between 0.1 and 6.8 SOL</span>
              </div>
              <div className="modal-rule">
                <span className="rule-number">2</span>
                <span className="rule-text">Get dealt two cards, dealer shows one</span>
              </div>
              <div className="modal-rule">
                <span className="rule-number">3</span>
                <span className="rule-text">Choose to Hit or Stand (Double if confident)</span>
              </div>
              <div className="modal-rule">
                <span className="rule-number">4</span>
                <span className="rule-text">Beat dealer's hand without going over 21</span>
              </div>
              
              <div className="modal-special-notes">
                <div className="modal-rule special">
                  <div className="rule-bullet"></div>
                  <span className="rule-text special">Blackjack (21) pays 3:2</span>
                </div>
                <div className="modal-rule special">
                  <div className="rule-bullet"></div>
                  <span className="rule-text special">Dealer must hit on 16, stand on 17</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Warning Modal - After 4 Games */}
      {showWarningModal && (
        <div className="modal-overlay">
          <div className="modal-content warning-modal">
            <h3 className="modal-title">Time for a Break?</h3>
            
            <div className="warning-content">
              <p className="warning-text">You've been playing for a while. Remember to play responsibly and take breaks when needed.</p>
              
              <div className="warning-stats">
                <div className="warning-stat">
                  <span className="warning-label">Games Played</span>
                  <span className="warning-value">{gamesPlayed}</span>
                </div>
                <div className="warning-stat">
                  <span className="warning-label">Current Profit</span>
                  <span className={`warning-value ${profit >= 0 ? 'positive' : 'negative'}`}>
                    {profit.toFixed(2)} SOL
                  </span>
                </div>
              </div>
              
              <div className="warning-actions">
                <button onClick={handleExitGame} className="warning-btn exit-btn">
                  Exit Game
                </button>
                <button onClick={handleContinuePlaying} className="warning-btn continue-btn">
                  Continue Playing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlackJackGame; 