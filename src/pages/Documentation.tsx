import React, { useState, useEffect } from 'react';
import '../styles/Documentation.css';

const Documentation: React.FC = () => {
  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'what-is-salty-sol', title: 'What is Salty Sol?' },
    { id: 'web3', title: 'Web3 Explained' },
    { id: 'mission', title: 'Our Mission' },
    { id: 'games', title: 'Games' },
    { id: 'jackpot', title: 'Jackpot Mechanics' },
    { id: 'private-access', title: 'Private Access' },
    { id: 'sustainability', title: 'Platform Sustainability' },
    { id: 'faq', title: 'FAQ' }
  ];

  const [activeSection, setActiveSection] = useState('introduction');
  const [currentPage, setCurrentPage] = useState(0);
  const [showAllSections, setShowAllSections] = useState(true);

  useEffect(() => {
    // Find the index of the current section
    const sectionIndex = sections.findIndex(section => section.id === activeSection);
    if (sectionIndex !== -1) {
      setCurrentPage(sectionIndex);
    }
  }, [activeSection]);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToPage = (index: number) => {
    if (index >= 0 && index < sections.length) {
      scrollToSection(sections[index].id);
    }
  };

  // Toggle between paginated view and all sections view
  const toggleView = () => {
    setShowAllSections(!showAllSections);
    // Reset scroll position when changing view mode
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  // Get section title from index
  const getSectionTitle = (index: number) => {
    return index >= 0 && index < sections.length ? sections[index].title : '';
  };

  return (
    <div className="documentation-container">
      <div className="documentation-sidebar">
        <div className="sidebar-header">
          <img src="/images/s.png" alt="Salty Sol Logo" className="sidebar-logo" />
          <h3>Salty Sol Docs</h3>
        </div>
        <nav className="sidebar-nav">
          {sections.map((section) => (
            <button 
              key={section.id}
              className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => scrollToSection(section.id)}
            >
              {section.title}
            </button>
          ))}
        </nav>
        <div className="view-toggle">
          <button onClick={toggleView} className="toggle-button">
            {showAllSections ? "View Page by Page" : "View All Sections"}
          </button>
        </div>
      </div>

      <div className="documentation-content">
        {showAllSections ? (
          // Show all sections
          <>
            <section id="introduction" className="doc-section">
              <h1>Salty Sol Documentation</h1>
              <p className="intro-text">
                Welcome to the official documentation for Salty Sol, a decentralized, Web3-powered pay-to-play platform built on the Solana blockchain. This guide provides detailed information on our mission, how our games work, and the core principles behind our platform.
              </p>
            </section>

            <section id="what-is-salty-sol" className="doc-section">
              <h2>What is Salty Sol?</h2>
              <div className="content-block">
                <p>
                  Salty Sol is an innovative platform where players enjoy classic games—Blackjack and Racing—in a completely decentralized environment. Powered by Web3 technology on the Solana blockchain, our platform ensures transparency, fairness, and community-driven rewards. Salty Sol operates on a pay-to-play model where every wager fuels the jackpot pool, and every win is derived solely from that pool.
                </p>
                
                <h3>Why We Made It</h3>
                <p>Salty Sol was born out of a desire to revolutionize digital gaming by:</p>
                <ul>
                  <li>Empowering the Community: Creating a platform where every player's bet contributes to a collective jackpot.</li>
                  <li>Promoting Transparency: Leveraging blockchain technology to ensure all transactions and outcomes are publicly verifiable.</li>
                  <li>Fostering Innovation: Pioneering a new form of decentralized entertainment that blends traditional gaming with cutting-edge Web3 principles.</li>
                  <li>Educating Users: Offering a hands-on experience in decentralized gaming, demonstrating the potential of Web3 technologies in everyday entertainment.</li>
                </ul>

                <h3>Getting Started</h3>
                <p>To use Salty Sol, you'll need:</p>
                <ul>
                  <li>A Solana wallet (such as Phantom, Solflare, or Backpack)</li>
                  <li>Some SOL for transactions and gameplay</li>
                  <li>A modern web browser</li>
                </ul>
              </div>
            </section>

            <section id="web3" className="doc-section">
              <h2>Web3 Explained</h2>
              <div className="content-block">
                <p>
                  Web3 refers to the next evolution of the internet—one that is decentralized, transparent, and powered by blockchain technology. Unlike traditional centralized platforms, Web3 empowers users with true ownership of their data and funds. In the context of Salty Sol:
                </p>
                <ul>
                  <li>Decentralization: All game transactions, outcomes, and fund movements are executed by smart contracts on Solana.</li>
                  <li>Transparency: Every bet and payout is recorded on the blockchain, ensuring fairness and verifiability.</li>
                  <li>User Control: Your personal data is never stored; only your public wallet address is used to interact with the platform.</li>
                </ul>

                <h3>Blockchain & Solana</h3>
                <p>Salty Sol is built on the Solana blockchain, chosen for its:</p>
                <ul>
                  <li>High-speed transactions (up to 65,000 TPS)</li>
                  <li>Low transaction fees (fractions of a cent)</li>
                  <li>Energy-efficient proof-of-stake consensus</li>
                  <li>Strong ecosystem of compatible applications</li>
                  <li>Robust security and decentralization</li>
                </ul>

                <h3>Smart Contracts</h3>
                <p>Our games and platform features are powered by smart contracts - self-executing code deployed on the Solana blockchain. These contracts:</p>
                <ul>
                  <li>Execute automatically based on predefined conditions</li>
                  <li>Can't be altered once deployed, ensuring fairness</li>
                  <li>Handle bet placement, outcome verification, and payouts</li>
                  <li>Manage jackpot contributions and distributions</li>
                  <li>Can be audited by anyone for transparency</li>
                </ul>
              </div>
            </section>

            <section id="mission" className="doc-section">
              <h2>Our Mission</h2>
              <div className="content-block">
                <p>
                  Our mission at Salty Sol is to redefine online gaming by creating a fair, transparent, and community-driven platform. We aim to:
                </p>
                <ul>
                  <li>Deliver a Trustless Experience: Ensure that every game is powered by smart contracts and provably fair randomness.</li>
                  <li>Return Value to Players: Operate on a model where all fees and winnings are circulated back to the community.</li>
                  <li>Build a Sustainable Ecosystem: Foster long-term engagement through a decentralized referral program, continuous innovation, and open-source development.</li>
                </ul>
              </div>
            </section>

            <section id="games" className="doc-section">
              <h2>Games</h2>
              <div className="content-block">
                <h3>Blackjack</h3>
                <p>Our decentralized Blackjack game follows standard rules with a few blockchain-specific features:</p>
                <ul>
                  <li>Place bets in SOL</li>
                  <li>Dealer must stand on soft 17</li>
                  <li>All outcomes verified on-chain</li>
                  <li>Blackjack pays 3:2</li>
                  <li>Double down available on any two cards</li>
                </ul>

                <h3>Salty Speedway</h3>
                <p>Our crash-style game with a racing theme:</p>
                <ul>
                  <li>Place your bet and cash out before the speedway crash</li>
                  <li>Higher multiplier the longer you stay in the race</li>
                  <li>Auto cash-out setting available</li>
                  <li>Live multiplier updating in real-time</li>
                  <li>Chat with other players during races</li>
                </ul>
              </div>
            </section>

            <section id="jackpot" className="doc-section">
              <h2>Jackpot Mechanics</h2>
              <div className="content-block">
                <p>
                  The jackpot pool is the heart of Salty Sol's pay-to-play model. Here's how it works:
                </p>
                <ul>
                  <li>Fund Accumulation: Each game round requires a fee that partially contributes to the central jackpot pool.</li>
                  <li>Dynamic Growth: The pool grows as more players participate, and its size is transparently displayed in real-time.</li>
                  <li>Community Benefit: Because the pool is entirely funded by player fees—with no house edge—the system redistributes value back to the community.</li>
                </ul>

                <h3>Jackpot Distribution</h3>
                <p>When a jackpot is triggered:</p>
                <ul>
                  <li>60% goes to the triggering player</li>
                  <li>20% is distributed among active players from the past 24 hours</li>
                  <li>10% seeds the next jackpot</li>
                  <li>10% is allocated to platform development</li>
                </ul>
              </div>
            </section>

            <section id="private-access" className="doc-section">
              <h2>Private Access</h2>
              <div className="content-block">
                <p>
                  During our early release phase, Salty Sol operates in Private Access Mode. This mode is designed to:
                </p>
                <ul>
                  <li>Reward Early Adopters: Provide exclusive access to users who join our community during the initial phase.</li>
                  <li>Enable Controlled Testing: Allow us to gather feedback and ensure stability before a full public launch.</li>
                  <li>Maintain Security and Fairness: Limit access to vetted participants to safeguard the integrity of our decentralized system.</li>
                  <li>Offer Referral Benefits: Early users can join our referral program to earn additional rewards and help shape the future of the platform.</li>
                </ul>

                <h3>Obtaining Private Access</h3>
                <p>To gain Private Access, you can:</p>
                <ul>
                  <li>Join our waitlist and receive an invite code</li>
                  <li>Receive an invitation from an existing member</li>
                  <li>Participate in special promotional events for access</li>
                  <li>Hold specific NFTs that grant platform access</li>
                </ul>
              </div>
            </section>

            <section id="sustainability" className="doc-section">
              <h2>Platform Sustainability & Security</h2>
              <div className="content-block">
                <h3>How We Keep the Site Running</h3>
                <p>Operational Funding: A minimal fee on each game is allocated to cover network fees, oracle services, and ongoing development.</p>
                
                <h3>Security Measures</h3>
                <ul>
                  <li>Non-Custodial Model: Users retain full control over their funds—only their public wallet address interacts with our system.</li>
                  <li>Smart Contract Audits: All platform code undergoes rigorous security reviews.</li>
                  <li>Transparent Operations: All platform functions are verifiable on the blockchain.</li>
                </ul>

                <h3>Community Governance</h3>
                <p>Long-term, we plan to transition to community governance:</p>
                <ul>
                  <li>Active players will have voting rights on platform changes</li>
                  <li>Fee structures can be adjusted through community proposals</li>
                  <li>New game additions will involve community input</li>
                  <li>Transparency reports published regularly</li>
                </ul>
              </div>
            </section>

            <section id="faq" className="doc-section">
              <h2>Frequently Asked Questions</h2>
              <div className="content-block faq-block">
                <div className="faq-item">
                  <h3>Is Salty Sol legally compliant?</h3>
                  <p>Salty Sol operates as a decentralized protocol on the Solana blockchain. We recommend users ensure compliance with their local regulations before participating.</p>
                </div>

                <div className="faq-item">
                  <h3>How do I withdraw my winnings?</h3>
                  <p>Click the "Withdraw" button in your dashboard, enter the amount you wish to withdraw, and confirm the transaction with your connected wallet.</p>
                </div>

                <div className="faq-item">
                  <h3>Are the games provably fair?</h3>
                  <p>Yes, all games use verifiable random functions on the Solana blockchain. Game outcomes can be verified independently through our verification tool.</p>
                </div>

                <div className="faq-item">
                  <h3>What happens if I lose connection during a game?</h3>
                  <p>Games are processed on-chain, so even if your connection drops, the outcome is recorded. You can check your transaction history to see results.</p>
                </div>

                <div className="faq-item">
                  <h3>Is there a minimum or maximum bet?</h3>
                  <p>Yes, each game has specific minimum and maximum bet limits displayed in the game interface. These vary by game type.</p>
                </div>

                <div className="faq-item">
                  <h3>How do I report a bug or issue?</h3>
                  <p>Contact our support team through the "Support" button in the main menu or email directly to support@saltysol.com.</p>
                </div>
              </div>
            </section>
          </>
        ) : (
          // Simplified single page view with just section content and left/right nav
          <>
            {currentPage === 0 && (
              <section id="introduction" className="doc-section">
                <h1>Salty Sol Documentation</h1>
                <p className="intro-text">
                  Welcome to the official documentation for Salty Sol, a decentralized, Web3-powered pay-to-play platform built on the Solana blockchain. This guide provides detailed information on our mission, how our games work, and the core principles behind our platform.
                </p>
              </section>
            )}

            {currentPage === 1 && (
              <section id="what-is-salty-sol" className="doc-section">
                <h2>What is Salty Sol?</h2>
                <div className="content-block">
                  <p>
                    Salty Sol is an innovative platform where players enjoy classic games—Blackjack and Racing—in a completely decentralized environment. Powered by Web3 technology on the Solana blockchain, our platform ensures transparency, fairness, and community-driven rewards. Salty Sol operates on a pay-to-play model where every wager fuels the jackpot pool, and every win is derived solely from that pool.
                  </p>
                  
                  <h3>Why We Made It</h3>
                  <p>Salty Sol was born out of a desire to revolutionize digital gaming by:</p>
                  <ul>
                    <li>Empowering the Community: Creating a platform where every player's bet contributes to a collective jackpot.</li>
                    <li>Promoting Transparency: Leveraging blockchain technology to ensure all transactions and outcomes are publicly verifiable.</li>
                    <li>Fostering Innovation: Pioneering a new form of decentralized entertainment that blends traditional gaming with cutting-edge Web3 principles.</li>
                    <li>Educating Users: Offering a hands-on experience in decentralized gaming, demonstrating the potential of Web3 technologies in everyday entertainment.</li>
                  </ul>

                  <h3>Getting Started</h3>
                  <p>To use Salty Sol, you'll need:</p>
                  <ul>
                    <li>A Solana wallet (such as Phantom, Solflare, or Backpack)</li>
                    <li>Some SOL for transactions and gameplay</li>
                    <li>A modern web browser</li>
                  </ul>
                </div>
              </section>
            )}

            {currentPage === 2 && (
              <section id="web3" className="doc-section">
                <h2>Web3 Explained</h2>
                <div className="content-block">
                  <p>
                    Web3 refers to the next evolution of the internet—one that is decentralized, transparent, and powered by blockchain technology. Unlike traditional centralized platforms, Web3 empowers users with true ownership of their data and funds. In the context of Salty Sol:
                  </p>
                  <ul>
                    <li>Decentralization: All game transactions, outcomes, and fund movements are executed by smart contracts on Solana.</li>
                    <li>Transparency: Every bet and payout is recorded on the blockchain, ensuring fairness and verifiability.</li>
                    <li>User Control: Your personal data is never stored; only your public wallet address is used to interact with the platform.</li>
                  </ul>

                  <h3>Blockchain & Solana</h3>
                  <p>Salty Sol is built on the Solana blockchain, chosen for its:</p>
                  <ul>
                    <li>High-speed transactions (up to 65,000 TPS)</li>
                    <li>Low transaction fees (fractions of a cent)</li>
                    <li>Energy-efficient proof-of-stake consensus</li>
                    <li>Strong ecosystem of compatible applications</li>
                    <li>Robust security and decentralization</li>
                  </ul>

                  <h3>Smart Contracts</h3>
                  <p>Our games and platform features are powered by smart contracts - self-executing code deployed on the Solana blockchain. These contracts:</p>
                  <ul>
                    <li>Execute automatically based on predefined conditions</li>
                    <li>Can't be altered once deployed, ensuring fairness</li>
                    <li>Handle bet placement, outcome verification, and payouts</li>
                    <li>Manage jackpot contributions and distributions</li>
                    <li>Can be audited by anyone for transparency</li>
                  </ul>
                </div>
              </section>
            )}

            {currentPage === 3 && (
              <section id="mission" className="doc-section">
                <h2>Our Mission</h2>
                <div className="content-block">
                  <p>
                    Our mission at Salty Sol is to redefine online gaming by creating a fair, transparent, and community-driven platform. We aim to:
                  </p>
                  <ul>
                    <li>Deliver a Trustless Experience: Ensure that every game is powered by smart contracts and provably fair randomness.</li>
                    <li>Return Value to Players: Operate on a model where all fees and winnings are circulated back to the community.</li>
                    <li>Build a Sustainable Ecosystem: Foster long-term engagement through a decentralized referral program, continuous innovation, and open-source development.</li>
                  </ul>
                </div>
              </section>
            )}

            {currentPage === 4 && (
              <section id="games" className="doc-section">
                <h2>Games</h2>
                <div className="content-block">
                  <h3>Blackjack</h3>
                  <p>Our decentralized Blackjack game follows standard rules with a few blockchain-specific features:</p>
                  <ul>
                    <li>Place bets in SOL</li>
                    <li>Dealer must stand on soft 17</li>
                    <li>All outcomes verified on-chain</li>
                    <li>Blackjack pays 3:2</li>
                    <li>Double down available on any two cards</li>
                  </ul>

                  <h3>Salty Speedway</h3>
                  <p>Our crash-style game with a racing theme:</p>
                  <ul>
                    <li>Place your bet and cash out before the speedway crash</li>
                    <li>Higher multiplier the longer you stay in the race</li>
                    <li>Auto cash-out setting available</li>
                    <li>Live multiplier updating in real-time</li>
                    <li>Chat with other players during races</li>
                  </ul>
                </div>
              </section>
            )}

            {currentPage === 5 && (
              <section id="jackpot" className="doc-section">
                <h2>Jackpot Mechanics</h2>
                <div className="content-block">
                  <p>
                    The jackpot pool is the heart of Salty Sol's pay-to-play model. Here's how it works:
                  </p>
                  <ul>
                    <li>Fund Accumulation: Each game round requires a fee that partially contributes to the central jackpot pool.</li>
                    <li>Dynamic Growth: The pool grows as more players participate, and its size is transparently displayed in real-time.</li>
                    <li>Community Benefit: Because the pool is entirely funded by player fees—with no house edge—the system redistributes value back to the community.</li>
                  </ul>

                  <h3>Jackpot Distribution</h3>
                  <p>When a jackpot is triggered:</p>
                  <ul>
                    <li>60% goes to the triggering player</li>
                    <li>20% is distributed among active players from the past 24 hours</li>
                    <li>10% seeds the next jackpot</li>
                    <li>10% is allocated to platform development</li>
                  </ul>
                </div>
              </section>
            )}

            {currentPage === 6 && (
              <section id="private-access" className="doc-section">
                <h2>Private Access</h2>
                <div className="content-block">
                  <p>
                    During our early release phase, Salty Sol operates in Private Access Mode. This mode is designed to:
                  </p>
                  <ul>
                    <li>Reward Early Adopters: Provide exclusive access to users who join our community during the initial phase.</li>
                    <li>Enable Controlled Testing: Allow us to gather feedback and ensure stability before a full public launch.</li>
                    <li>Maintain Security and Fairness: Limit access to vetted participants to safeguard the integrity of our decentralized system.</li>
                    <li>Offer Referral Benefits: Early users can join our referral program to earn additional rewards and help shape the future of the platform.</li>
                  </ul>

                  <h3>Obtaining Private Access</h3>
                  <p>To gain Private Access, you can:</p>
                  <ul>
                    <li>Join our waitlist and receive an invite code</li>
                    <li>Receive an invitation from an existing member</li>
                    <li>Participate in special promotional events for access</li>
                    <li>Hold specific NFTs that grant platform access</li>
                  </ul>
                </div>
              </section>
            )}

            {currentPage === 7 && (
              <section id="sustainability" className="doc-section">
                <h2>Platform Sustainability & Security</h2>
                <div className="content-block">
                  <h3>How We Keep the Site Running</h3>
                  <p>Operational Funding: A minimal fee on each game is allocated to cover network fees, oracle services, and ongoing development.</p>
                  
                  <h3>Security Measures</h3>
                  <ul>
                    <li>Non-Custodial Model: Users retain full control over their funds—only their public wallet address interacts with our system.</li>
                    <li>Smart Contract Audits: All platform code undergoes rigorous security reviews.</li>
                    <li>Transparent Operations: All platform functions are verifiable on the blockchain.</li>
                  </ul>

                  <h3>Community Governance</h3>
                  <p>Long-term, we plan to transition to community governance:</p>
                  <ul>
                    <li>Active players will have voting rights on platform changes</li>
                    <li>Fee structures can be adjusted through community proposals</li>
                    <li>New game additions will involve community input</li>
                    <li>Transparency reports published regularly</li>
                  </ul>
                </div>
              </section>
            )}

            {currentPage === 8 && (
              <section id="faq" className="doc-section">
                <h2>Frequently Asked Questions</h2>
                <div className="content-block faq-block">
                  <div className="faq-item">
                    <h3>Is Salty Sol legally compliant?</h3>
                    <p>Salty Sol operates as a decentralized protocol on the Solana blockchain. We recommend users ensure compliance with their local regulations before participating.</p>
                  </div>

                  <div className="faq-item">
                    <h3>How do I withdraw my winnings?</h3>
                    <p>Click the "Withdraw" button in your dashboard, enter the amount you wish to withdraw, and confirm the transaction with your connected wallet.</p>
                  </div>

                  <div className="faq-item">
                    <h3>Are the games provably fair?</h3>
                    <p>Yes, all games use verifiable random functions on the Solana blockchain. Game outcomes can be verified independently through our verification tool.</p>
                  </div>

                  <div className="faq-item">
                    <h3>What happens if I lose connection during a game?</h3>
                    <p>Games are processed on-chain, so even if your connection drops, the outcome is recorded. You can check your transaction history to see results.</p>
                  </div>

                  <div className="faq-item">
                    <h3>Is there a minimum or maximum bet?</h3>
                    <p>Yes, each game has specific minimum and maximum bet limits displayed in the game interface. These vary by game type.</p>
                  </div>

                  <div className="faq-item">
                    <h3>How do I report a bug or issue?</h3>
                    <p>Contact our support team through the "Support" button in the main menu or email directly to support@saltysol.com.</p>
                  </div>
                </div>
              </section>
            )}

            <div className="pagination-controls">
              <button 
                className="page-button prev" 
                onClick={() => navigateToPage(currentPage - 1)}
                disabled={currentPage === 0}
              >
                ← Previous
              </button>
              
              <button 
                className="page-button next" 
                onClick={() => navigateToPage(currentPage + 1)}
                disabled={currentPage === sections.length - 1}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Documentation; 