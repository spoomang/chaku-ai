import { useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import GameCanvas from './components/GameCanvas'
import Dashboard from './components/Dashboard'
import { useGameEngine } from './hooks/useGameEngine'
import './snake.css'

export default function SnakeGame() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const playerName = state?.user?.name ?? 'Player 1'

  const canvasRef = useRef(null)
  const { status, players, scores, winner, startGame, stopGame, addPlayer, handleKeyDown } =
    useGameEngine(canvasRef)

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Auto-add the selected user as the manual player on mount
  useEffect(() => {
    addPlayer(playerName, 'manual')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleStart() {
    // Auto-add AI as second player if not already present
    if (players.length < 2) addPlayer('AutoBot', 'auto')
    startGame()
  }

  return (
    <div className="sg-page">
      <header className="sg-header">
        <div className="sg-logo">S</div>
        <h1 className="sg-title">
          <span className="sg-green">Snake</span>
          <span className="sg-dim"> Game</span>
        </h1>
        <button className="sg-back" onClick={() => navigate('/users')}>← Back to Users</button>
      </header>
      <main className="sg-main">
        <GameCanvas ref={canvasRef} />
        <Dashboard
          status={status}
          players={players}
          scores={scores}
          winner={winner}
          onStart={handleStart}
          onStop={stopGame}
        />
      </main>
    </div>
  )
}
