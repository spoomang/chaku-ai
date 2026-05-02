import { useState } from 'react';
import { PLAYER_COLORS, MAX_PLAYERS } from '../constants/game';

export default function PlayerSetup({ onAddPlayer, playerCount }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const canAdd = playerCount < MAX_PLAYERS;
  const nextColor = PLAYER_COLORS[playerCount]?.head ?? PLAYER_COLORS[0].head;

  function handleAdd(type) {
    const playerName = type === 'auto'
      ? 'AutoBot'
      : (name.trim() || `Player ${playerCount + 1}`);
    const ok = onAddPlayer(playerName, type);
    if (ok) {
      setName('');
      setError('');
    } else {
      setError('Name already taken or max players reached.');
    }
  }

  return (
    <div className="sg-panel">
      <h2 className="sg-panel-title">Add Player</h2>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && canAdd && handleAdd('manual')}
        placeholder="Enter name…"
        disabled={!canAdd}
        className="sg-input"
      />
      {error && <p className="sg-error">{error}</p>}
      <button onClick={() => handleAdd('manual')} disabled={!canAdd} className="sg-add-btn">
        <span className="sg-color-dot" style={{ backgroundColor: nextColor }} />
        Add Manual Player
      </button>
      <button onClick={() => handleAdd('auto')} disabled={!canAdd} className="sg-add-btn">
        <span className="sg-color-dot" style={{ backgroundColor: nextColor }} />
        Add AI Player
      </button>
      {!canAdd && <p className="sg-max-msg">Max {MAX_PLAYERS} players reached</p>}
    </div>
  );
}
