import React, { useState } from 'react';
import '../styles/Roadmap.css';

const Roadmap: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  
  const phases = [
    {
      title: "Launch Day",
      status: "Completed",
      description: "Official launch of the Salty Sol platform with the following targets:",
      milestones: [
        "Achieve 5,000 token holders",
        "Leverage Solana influencers and launch announcements to attract organic interest",
        "Utilize the referral system to boost rapid adoption",
        "Reach Trending Position on Dexscreener",
        "Coordinate high-volume buy-ins during peak hours to optimize algorithm visibility",
        "Engage with the community to push real-time trading and sustain engagement",
        "Utilize social media and trading groups to drive traffic towards the launch",
        "Ensure the trial version is accessible to all users for early exploration"
      ],
      achievementNote: "Milestone achieved"
    },
    {
      title: "First Week",
      status: "In Progress",
      description: "Key milestones for the first week after launch:",
      milestones: [
        "Deploy Salty Sol's native token on Solana",
        "Execute successful platform launch",
        "Introduce lottery-based and rewards-driven betting tokens to increase engagement",
        "Activate referral-based incentives for early adopters to expand the user base",
        "Offer early-stage betting pools for selected projects",
        "Roll out Private Access invitations to top referrers, early adopters, and strategic partners",
        "Implement a gated entry system where Private Access members receive exclusive benefits"
      ],
      achievementNote: "Milestone achieved"
    },
    {
      title: "Phase 1 Expansion",
      status: "In Progress",
      description: "Expanding our reach and enhancing platform capabilities:",
      milestones: [
        "Open additional Private Access slots based on referral milestones",
        "Target 10,000+ token holders through community campaigns",
        "Implement buyback & burn mechanics to stabilize token valuation",
        "Optimize trading pairs for higher volume and visibility",
        "Enable user-created betting pools for private groups",
        "Add multiple new game types to increase player engagement",
        "Increase payout potential across all platform games"
      ]
    },
    {
      title: "Phase 2: Advanced Betting Options",
      status: "Planned",
      description: "Expanding our betting capabilities with new features:",
      milestones: [
        "Implement parlays and multi-bet options",
        "Add prop bets for various events",
        "Enable custom wager creation",
        "Introduce dynamic odds based on market conditions",
        "Launch special event betting pools"
      ]
    },
    {
      title: "Phase 2: Mobile Beta",
      status: "Planned",
      description: "Extending our platform to mobile devices:",
      milestones: [
        "Release the first mobile beta version for iOS & Android",
        "Implement core betting mechanics & real-time market integration",
        "Optimize wallet connections (Phantom, Solflare, and more) for seamless mobile use",
        "Conduct private beta testing with select Private Access users"
      ]
    },
    {
      title: "Salty Sol Mobile App Public Launch",
      status: "Planned",
      description: "Bringing our platform to mobile users worldwide:",
      milestones: [
        "Roll out the full mobile version with live betting, market tracking, and notifications",
        "Optimize user acquisition via targeted mobile ad campaigns",
        "Begin feature expansion planning for mobile-exclusive betting modes"
      ]
    }
  ];

  const goToPhase = (index: number) => {
    setCurrentPhase(index);
  };

  const nextPhase = () => {
    setCurrentPhase(prev => (prev === phases.length - 1 ? 0 : prev + 1));
  };

  const prevPhase = () => {
    setCurrentPhase(prev => (prev === 0 ? phases.length - 1 : prev - 1));
  };

  const currentStatus = phases[currentPhase].status.toLowerCase().replace(' ', '-');

  return (
    <main className="roadmap-page">
      <h1 className="page-title">Roadmap</h1>
      
      <nav className="roadmap-nav">
        <button className="nav-arrow prev" onClick={prevPhase} aria-label="Previous phase">←</button>
        
        <div className="phase-indicators">
          {phases.map((phase, index) => (
            <button 
              key={index} 
              className={`phase-indicator ${index === currentPhase ? 'active' : ''}`}
              onClick={() => goToPhase(index)}
              aria-label={`Phase ${index + 1}`}
            />
          ))}
        </div>
        
        <button className="nav-arrow next" onClick={nextPhase} aria-label="Next phase">→</button>
      </nav>

      <article className="phase-card">
        <h2 className="phase-title">{phases[currentPhase].title}</h2>
        <span className={`status-tag ${currentStatus}`}>{phases[currentPhase].status}</span>
        <p className="phase-description">{phases[currentPhase].description}</p>
        
        <ul className="milestones">
          {phases[currentPhase].milestones.map((milestone, index) => (
            <li key={index} className="milestone-item">{milestone}</li>
          ))}
        </ul>
        
        {phases[currentPhase].achievementNote && (
          <div className="achievement-note">{phases[currentPhase].achievementNote}</div>
        )}
        
        <div className="phase-counter">
          {currentPhase + 1} / {phases.length}
        </div>
      </article>
    </main>
  );
};

export default Roadmap; 