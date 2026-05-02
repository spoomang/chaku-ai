import ScoreBoard from './ScoreBoard';

export default function Dashboard({ status, players, scores, winner, onStart, onStop }) {
  const isRunning = status === 'running';
  const isWon = status === 'won';
  const hasPlayers = players.length > 0;

  return (
    <div className="sg-dashboard">
      <div className="sg-panel">
        <h2 className="sg-panel-title">Game</h2>
        <div className="sg-btn-row">
          <button onClick={onStart} disabled={isRunning || !hasPlayers} className="sg-btn sg-btn-start">
            ▶ Start
          </button>
          <button onClick={onStop} disabled={!isRunning} className="sg-btn sg-btn-stop">
            ⏹ Stop
          </button>
        </div>
        <div className="sg-status-row">
          <span className={`sg-status-dot${isRunning ? ' running' : isWon ? ' won' : ''}`} />
          <span className="sg-status-label">{status}</span>
        </div>
      </div>

      {isWon && winner && (
        <div className="sg-winner-banner">
          <div className="sg-winner-name">{winner} wins!</div>
          <div className="sg-winner-sub">First to 10 food</div>
        </div>
      )}

      {hasPlayers && <ScoreBoard players={players} scores={scores} />}

      <div className="sg-panel">
        <h2 className="sg-panel-title">How to Play</h2>
        <ul className="sg-howto-list">
          <li>Arrow keys to move</li>
          <li>Eat food to grow &amp; score</li>
          <li>First to eat 10 food wins</li>
          <li>Walls wrap around</li>
          <li>You vs AutoBot AI</li>
        </ul>
      </div>
    </div>
  );
}
