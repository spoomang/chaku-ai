import { PLAYER_COLORS } from '../constants/game';

export default function ScoreBoard({ players, scores }) {
  const sorted = [...players].sort(
    (a, b) => (scores[b.name] ?? 0) - (scores[a.name] ?? 0)
  );

  return (
    <div className="sg-panel">
      <h2 className="sg-panel-title">Scoreboard</h2>
      <div className="sg-score-list">
        {sorted.map((player, rank) => {
          const colors = PLAYER_COLORS[player.colorIdx];
          const score = scores[player.name] ?? 0;
          return (
            <div key={player.name} className="sg-score-row">
              <span className="sg-score-rank">{rank + 1}</span>
              <span className="sg-color-dot" style={{ backgroundColor: colors.head }} />
              <span className="sg-score-name">{player.name}</span>
              <span className="sg-score-type">{player.type === 'auto' ? '🤖' : '🎮'}</span>
              <span className="sg-score-val" style={{ color: colors.head }}>{score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
