import { useRef, useState, useCallback, useEffect } from 'react';
import {
  CANVAS_WIDTH, CANVAS_HEIGHT, CELL_SIZE,
  TICK_MS, MAX_PLAYERS, WIN_SCORE, PLAYER_COLORS,
  BG_COLOR, GRID_COLOR, FOOD_COLOR,
  KEY_DIRECTION_MAP,
} from '../constants/game';
import {
  createSnake, getNextHead, moveSnake,
  ateFood, generateFood, canChangeDirection, getAutoDirection,
} from '../utils/gameLogic';

function fillRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
  ctx.fill();
}

function drawEyes(ctx, px, py, size, direction) {
  const r = 2;
  const eyePositions = {
    RIGHT: [{ ex: size - 6, ey: 5 }, { ex: size - 6, ey: size - 7 }],
    LEFT:  [{ ex: 5, ey: 5 }, { ex: 5, ey: size - 7 }],
    UP:    [{ ex: 5, ey: 5 }, { ex: size - 7, ey: 5 }],
    DOWN:  [{ ex: 5, ey: size - 7 }, { ex: size - 7, ey: size - 7 }],
  };
  const eyes = eyePositions[direction] ?? eyePositions.RIGHT;
  eyes.forEach(({ ex, ey }) => {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(px + ex, py + ey, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(px + ex + 0.5, py + ey + 0.5, r - 1, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function useGameEngine(canvasRef) {
  const [status, setStatus] = useState('idle');
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});
  const [winner, setWinner] = useState(null);

  const stateRef = useRef({ snakes: [], food: null, running: false, scores: {}, winner: null });
  const intervalRef = useRef(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { snakes, food } = stateRef.current;

    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= CANVAS_WIDTH; x += CELL_SIZE) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_HEIGHT); ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += CELL_SIZE) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y); ctx.stroke();
    }

    if (food) {
      const cx = food.x * CELL_SIZE + CELL_SIZE / 2;
      const cy = food.y * CELL_SIZE + CELL_SIZE / 2;
      ctx.save();
      ctx.shadowColor = FOOD_COLOR;
      ctx.shadowBlur = 20;
      ctx.fillStyle = FOOD_COLOR;
      ctx.beginPath();
      ctx.arc(cx, cy, CELL_SIZE / 2 - 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    snakes.forEach(snake => {
      const colors = PLAYER_COLORS[snake.colorIdx];
      snake.body.forEach((seg, i) => {
        const px = seg.x * CELL_SIZE + 1;
        const py = seg.y * CELL_SIZE + 1;
        const size = CELL_SIZE - 2;
        if (i === 0) {
          ctx.save();
          ctx.fillStyle = colors.head;
          ctx.shadowColor = colors.head;
          ctx.shadowBlur = 10;
          fillRoundRect(ctx, px, py, size, size, 5);
          ctx.restore();
          drawEyes(ctx, px, py, size, snake.direction);
        } else {
          ctx.fillStyle = colors.body;
          fillRoundRect(ctx, px + 1, py + 1, size - 2, size - 2, 3);
        }
      });
    });

    if (snakes.length === 0) {
      ctx.fillStyle = 'rgba(148,163,184,0.45)';
      ctx.font = '13px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Add a player to get started →', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }

    if (stateRef.current.winner) {
      ctx.fillStyle = 'rgba(2,6,23,0.78)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 30px ui-monospace, monospace';
      ctx.fillText(`${stateRef.current.winner} wins!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 14);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px ui-monospace, monospace';
      ctx.fillText('First to 10 food — press Start to play again', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 18);
    }
  }, [canvasRef]);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s.running) return;

    s.snakes.forEach(snake => {
      if (snake.type === 'auto' && s.food) {
        snake.direction = getAutoDirection(snake.body[0], s.food, snake.direction);
      }
      const nextHead = getNextHead(snake.body[0], snake.direction);
      const eats = s.food ? ateFood(nextHead, s.food) : false;
      snake.body = moveSnake(snake.body, snake.direction, eats);
      if (eats) {
        s.food = null;
        const newScore = (s.scores[snake.name] ?? 0) + 1;
        s.scores[snake.name] = newScore;
        setScores({ ...s.scores });
        if (newScore >= WIN_SCORE) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          s.running = false;
          s.winner = snake.name;
          setStatus('won');
          setWinner(snake.name);
        }
      }
    });

    if (s.winner) { render(); return; }
    if (!s.food) s.food = generateFood(s.snakes);
    render();
  }, [render]);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    if (s.running || s.snakes.length === 0) return;
    const resetScores = {};
    s.snakes.forEach(sn => {
      resetScores[sn.name] = 0;
      const startX = sn.type === 'auto' ? 20 : 4;
      const startY = sn.type === 'auto' ? 17 : 4;
      sn.direction = sn.type === 'auto' ? 'LEFT' : 'RIGHT';
      sn.body = createSnake(startX, startY);
    });
    s.scores = resetScores;
    s.winner = null;
    setScores(resetScores);
    setWinner(null);
    if (!s.food) s.food = generateFood(s.snakes);
    s.running = true;
    setStatus('running');
    intervalRef.current = setInterval(tick, TICK_MS);
  }, [tick]);

  const stopGame = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    stateRef.current.running = false;
    setStatus('idle');
  }, []);

  const addPlayer = useCallback((name, type) => {
    const s = stateRef.current;
    if (s.snakes.length >= MAX_PLAYERS) return false;
    if (s.snakes.find(sn => sn.name === name)) return false;
    const colorIdx = s.snakes.length;
    const startX = type === 'auto' ? 20 : 4;
    const startY = type === 'auto' ? 17 : 4;
    const direction = type === 'auto' ? 'LEFT' : 'RIGHT';
    s.snakes.push({ name, type, colorIdx, direction, body: createSnake(startX, startY) });
    s.scores[name] = 0;
    setPlayers(prev => [...prev, { name, type, colorIdx }]);
    setScores(prev => ({ ...prev, [name]: 0 }));
    render();
    return true;
  }, [render]);

  const handleKeyDown = useCallback((e) => {
    const newDir = KEY_DIRECTION_MAP[e.key];
    if (!newDir) return;
    e.preventDefault();
    const manual = stateRef.current.snakes.find(sn => sn.type === 'manual');
    if (manual && canChangeDirection(manual.direction, newDir)) {
      manual.direction = newDir;
    }
  }, []);

  useEffect(() => { render(); }, [render]);
  useEffect(() => () => clearInterval(intervalRef.current), []);

  return { status, players, scores, winner, startGame, stopGame, addPlayer, handleKeyDown };
}
