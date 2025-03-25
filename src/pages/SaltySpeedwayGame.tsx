import React, { useState, useEffect, useRef } from 'react';
import '../styles/GamePage.css';
import '../styles/SpeedwayGame.css';
import appFunction from './speedwayg';

// Game state types
type GameState = 'welcome' | 'betting' | 'playing' | 'gameOver';

interface InstructionPage {
  title: string;
  content: string | string[];
}

const SaltySpeedwayGame: React.FC = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [betAmount, setBetAmount] = useState(0.3);
  const [balance, setBalance] = useState(5.0);
  const [multiplier, setMultiplier] = useState(0);
  const [resultMessage, setResultMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [carsPassed, setCarsPassed] = useState(0);
  
  // Stats
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  
  // Refs
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const difficultyRef = useRef<number>(3); // Changed from 1 to 3 for BRUTAL mode
  const gameInitialized = useRef<boolean>(false);
  const observersRef = useRef<{
    score?: MutationObserver;
    replay?: MutationObserver;
  }>({});
  
  // Constants
  const MIN_BET = 0.1;
  const MAX_BET = 2.9;
  
  // Instructions pages
  const instructionPages: InstructionPage[] = [
    {
      title: "Welcome",
      content: "Race through traffic and earn rewards in this exciting speedway game!"
    },
    {
      title: "How to Play",
      content: [
        "Place your bet (0.1 - 2.9 SOL)",
        "Use A and D keys to move left and right"
      ]
    },
    {
      title: "Rewards",
      content: [
        "Dodge traffic to increase your multiplier",
        "Pass 4+ cars to start earning rewards",
        "Each additional car adds 0.04x to your multiplier"
      ]
    }
  ];

  // Handle bet amount change
  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) return;
    
    // Clamp bet amount between min and max
    const clampedValue = Math.min(Math.max(value, MIN_BET), MAX_BET);
    setBetAmount(parseFloat(clampedValue.toFixed(2)));
  };
  
  // Set a quick bet amount
  const setQuickBetAmount = (amount: number) => {
    // Ensure amount doesn't exceed balance
    const maxBet = Math.min(amount, balance);
    setBetAmount(parseFloat(maxBet.toFixed(2)));
  };

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < instructionPages.length) {
      setCurrentPage(prev => prev + 1);
    } else {
      setGameState('betting');
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  // Cleanup function for observers and game
  const cleanupGame = () => {
    // Remove observers
    if (observersRef.current.score) {
      observersRef.current.score.disconnect();
    }
    if (observersRef.current.replay) {
      observersRef.current.replay.disconnect();
    }
    
    // Reset observers
    observersRef.current = {};
    
    // Clean up game container - but don't remove it!
    const gameContainer = gameContainerRef.current;
    if (gameContainer) {
      // Remove only the canvas and three.js elements, keep the UI elements
      const canvases = gameContainer.querySelectorAll('canvas');
      canvases.forEach(canvas => canvas.remove());
    }
    
    // Reset game initialization flag
    gameInitialized.current = false;
  };
  
  // Create event listeners for the game
  useEffect(() => {
    if (gameState === 'playing') {
      try {
        // Create the game container elements
        const gameContainer = gameContainerRef.current;
        if (!gameContainer) return;
        
        // Only set up the game if it's not already initialized
        if (!gameInitialized.current) {
          // Clear any existing content, but don't use innerHTML = '' as it's destructive
          // Instead, we'll focus on creating elements if they don't exist already
          
          // Check if header element exists, if not create it
          let header = gameContainer.querySelector('.score-header');
          if (!header) {
            header = document.createElement('header');
            header.className = 'score-header';
            header.textContent = '0';
            gameContainer.appendChild(header);
          }
          
          // Check if difficulty select exists, if not create it
          let difficultySelect = gameContainer.querySelector('.difficulty-select') as HTMLElement | null;
          if (!difficultySelect) {
            difficultySelect = document.createElement('div');
            difficultySelect.className = 'difficulty-select menu-inactive';
            
            // Add difficulty buttons
            const buttonLabels = ['EASY', 'MEDIUM', 'HARD', 'BRUTAL'];
            buttonLabels.forEach((label, index) => {
              const btn = document.createElement('button');
              btn.setAttribute('data-difficulty', index.toString());
              btn.textContent = label;
              if (difficultySelect) {
                difficultySelect.appendChild(btn);
              }
            });
            
            gameContainer.appendChild(difficultySelect);
          }
          
          // Check if tutorial exists, if not create it
          let tutorial = gameContainer.querySelector('.tutorial');
          if (!tutorial) {
            tutorial = document.createElement('div');
            tutorial.className = 'tutorial';
            tutorial.textContent = 'USE A/D OR LEFT/RIGHT ARROW KEYS TO STEER';
            gameContainer.appendChild(tutorial);
          }
          
          // Check if replay button exists, if not create it
          let replayBtn = gameContainer.querySelector('.replay');
          if (!replayBtn) {
            replayBtn = document.createElement('div');
            replayBtn.className = 'replay';
            replayBtn.textContent = 'PLAY AGAIN';
            (replayBtn as HTMLElement).style.opacity = '0'; // Make it invisible
            (replayBtn as HTMLElement).style.pointerEvents = 'none'; // Disable pointer events
            gameContainer.appendChild(replayBtn);
          }
          
          // Initialize the game with a small delay to ensure DOM is ready
          setTimeout(() => {
            // Ensure the proper access to the header and replayBtn
            const headerElement = gameContainer.querySelector('.score-header') as HTMLElement;
            const replayBtnElement = gameContainer.querySelector('.replay') as HTMLElement;
            
            if (headerElement && replayBtnElement) {
              // Set up MutationObserver to listen for score changes
              const scoreObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                  if (mutation.type === 'characterData' || mutation.type === 'childList') {
                    const score = parseInt(headerElement.textContent || '0', 10);
                    setCarsPassed(score);
                    
                    // Calculate multiplier
                    if (score >= 4) {
                      const baseMultiplier = 1;
                      const additionalMultiplier = (score - 4) * 0.04;
                      setMultiplier(baseMultiplier + additionalMultiplier);
                    } else {
                      setMultiplier(0);
                    }
                  }
                });
              });
              
              scoreObserver.observe(headerElement, { 
                characterData: true, 
                childList: true,
                subtree: true
              });
              
              // Store the observer for cleanup
              observersRef.current.score = scoreObserver;
              
              // Listen for game over
              const replayBtnObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                  if (mutation.type === 'attributes' && 
                     mutation.attributeName === 'class' &&
                     replayBtnElement.classList.contains('replay-active')) {
                    
                    // Game over - calculate winnings
                    handleGameOver();
                  }
                });
              });
              
              replayBtnObserver.observe(replayBtnElement, { attributes: true });
              
              // Store the observer for cleanup
              observersRef.current.replay = replayBtnObserver;
              
              // Initialize the game - directly call the app function
              gameInitialized.current = true;
              console.log("Initializing three.js game...");
              appFunction();
              
              // Directly click the button based on the selected difficulty after a delay
              setTimeout(() => {
                const difficultyButtons = gameContainer.querySelectorAll('.difficulty-select button');
                const btn = difficultyButtons[3] as HTMLButtonElement; // Always use BRUTAL (index 3)
                if (btn) {
                  console.log("Clicking BRUTAL difficulty button");
                  btn.click();
                }
              }, 200);
            }
          }, 100);
        }
        
        // Return cleanup function
        return () => {
          // Only clean up if we're completely leaving the game (not just going to game over)
          if (gameState !== 'playing') {
            cleanupGame();
          }
        };
      } catch (error) {
        console.error('Error starting game:', error);
        setGameState('betting');
      }
    }
  }, [gameState]);
  
  // Handle game over
  const handleGameOver = () => {
    // Calculate winnings
    let winAmount = 0;
    let hasWon = false;
    
    if (carsPassed >= 4) {
      winAmount = betAmount * multiplier;
      hasWon = true;
      
      setBalance(prev => prev + winAmount);
      setWins(prev => prev + 1);
      setResultMessage(`You won ${winAmount.toFixed(2)} SOL!`);
      setTotalProfit(prev => prev + (winAmount - betAmount));
    } else {
      setLosses(prev => prev + 1);
      setResultMessage('NOT ENOUGH CARS PASSED');
      setTotalProfit(prev => prev - betAmount);
    }
    
    setGamesPlayed(prev => prev + 1);
    setGameState('gameOver');
  };

  // Start game
  const startGame = () => {
    if (betAmount > balance) return;
    
    // Deduct bet amount from balance
    setBalance(prevBalance => prevBalance - betAmount);
    
    // Reset game state
    setCarsPassed(0);
    setMultiplier(0);
    setResultMessage('');
    
    // Reset game initialized flag to force re-initialization
    gameInitialized.current = false;
    
    // Clean up any existing observers
    cleanupGame();
    
    // Set game state
    setGameState('playing');
  };
  
  // Play again function
  const playAgain = () => {
    // Clean up any existing game elements and observers
    cleanupGame();
    
    // Reset game state variables
    setCarsPassed(0);
    setMultiplier(0);
    setResultMessage('');
    
    // Set game initialized flag to false to force re-initialization
    gameInitialized.current = false;
    
    // Return to betting state
    setGameState('betting');
  };
  
  // Clean up game on component unmount
  useEffect(() => {
    return cleanupGame;
  }, []);
  
  // Calculate win rate
  const winRate = wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0;

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
            <span className="stat-value">{totalProfit.toFixed(2)} SOL</span>
          </div>
        </div>

        <div className="game-rules">
          <div className="rule-item">MIN BET 0.1 SOL</div>
          <div className="rule-item">MAX BET 2.9 SOL</div>
        </div>
      </div>

      {/* Empty right sidebar */}
      <div className="right-sidebar"></div>

      <div className="speedway-game">
        {/* Welcome modal that appears over the game */}
        {gameState === 'welcome' && (
          <div className="welcome-screen">
            <div className="welcome-content">
              <h2 className="game-title">Salty Sol Speedway</h2>
              
              <div className="game-overview">
                <div className="game-instructions">
                  <h3>{instructionPages[currentPage - 1].title}</h3>
                  {typeof instructionPages[currentPage - 1].content === 'string' ? (
                    <p className="welcome-text">{instructionPages[currentPage - 1].content as string}</p>
                  ) : (
                    <ul>
                      {(instructionPages[currentPage - 1].content as string[]).map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pagination-controls">
                  <div className="pagination-dots">
                    {instructionPages.map((_, index) => (
                      <span 
                        key={index} 
                        className={`pagination-dot ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => setCurrentPage(index + 1)}
                      />
                    ))}
                  </div>
                  <button 
                    className="continue-button"
                    onClick={() => {
                      if (currentPage < instructionPages.length) {
                        setCurrentPage(prev => prev + 1);
                      } else {
                        setGameState('betting');
                      }
                    }}
                  >
                    {currentPage < instructionPages.length ? 'NEXT' : 'START BETTING'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show the game background regardless of state */}
        <div className="game-container" ref={gameContainerRef} style={{ opacity: gameState === 'playing' || gameState === 'gameOver' ? 1 : 0.3 }}>
          {/* The three.js game will be mounted here */}
        </div>

        {gameState === 'betting' && (
          <div className="betting-screen">
            <div className="betting-content">
              <h2 className="betting-title">Place Your Bet</h2>
              
              <div className="bet-input-group">
                <label className="bet-input-label">BET AMOUNT</label>
                <input 
                  type="number"
                  className="bet-input"
                  value={betAmount}
                  onChange={handleBetChange}
                  min={MIN_BET}
                  max={MAX_BET}
                  step={0.1}
                />
              </div>
              
              <input 
                type="range"
                className="bet-slider"
                min={MIN_BET}
                max={Math.min(MAX_BET, balance)}
                step={0.1}
                value={betAmount}
                onChange={handleBetChange}
              />
              
              <div className="bet-quick-amounts">
                <button 
                  className="quick-amount"
                  onClick={() => setQuickBetAmount(0.1)}
                >
                  0.1
                </button>
                <button 
                  className="quick-amount"
                  onClick={() => setQuickBetAmount(0.5)}
                >
                  0.5
                </button>
                <button 
                  className="quick-amount"
                  onClick={() => setQuickBetAmount(1.0)}
                >
                  1.0
                </button>
                <button 
                  className="quick-amount"
                  onClick={() => setQuickBetAmount(2.0)}
                >
                  2.0
                </button>
              </div>

              <div className="reward-rules">
                <p>• Pass 4+ cars to start earning rewards</p>
                <p>• Each additional car adds 0.04x multiplier</p>
              </div>

              <div className="potential-win-container">
                <div className="potential-win">
                  Potential win: <span className="win-amount">{(betAmount * 1.16).toFixed(2)} SOL</span>
                </div>
                <span className="win-condition">Only when 4 cars are passed</span>
              </div>

              <button 
                className="start-button"
                onClick={startGame}
                disabled={betAmount > balance}
              >
                START RACE
              </button>
            </div>
          </div>
        )}
        
        {gameState === 'gameOver' && (
          <div className="game-over" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
            <h2 className="game-over-title">{carsPassed >= 4 ? 'CONGRATULATIONS' : 'GAME OVER'}</h2>
            <p className="game-over-message">{resultMessage}</p>
            
            <div className="game-over-stats">
              <div className="stat-container">
                <div className="stat-label-large">Cars Passed</div>
                <div className="stat-value-large">{carsPassed}</div>
              </div>
              
              <div className="stat-container">
                <div className="stat-label-large">Multiplier</div>
                <div className="stat-value-large">{multiplier.toFixed(2)}x</div>
              </div>
              
              {carsPassed >= 4 && (
                <div className="stat-container">
                  <div className="stat-label-large">Total Received</div>
                  <div className="stat-value-large">{(betAmount * multiplier).toFixed(2)} SOL</div>
                </div>
              )}
            </div>
            
            <button 
              className="play-again-button"
              onClick={playAgain}
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaltySpeedwayGame; 