import { COLS, ROWS } from '../constants/game';

export function createSnake(startX, startY, length = 3) {
  return Array.from({ length }, (_, i) => ({ x: startX - i, y: startY }));
}

export function getNextHead(head, direction) {
  switch (direction) {
    case 'RIGHT': return { x: (head.x + 1) % COLS, y: head.y };
    case 'LEFT':  return { x: (head.x - 1 + COLS) % COLS, y: head.y };
    case 'UP':    return { x: head.x, y: (head.y - 1 + ROWS) % ROWS };
    case 'DOWN':  return { x: head.x, y: (head.y + 1) % ROWS };
    default: return head;
  }
}

export function moveSnake(body, direction, grow) {
  const newHead = getNextHead(body[0], direction);
  return grow ? [newHead, ...body] : [newHead, ...body.slice(0, -1)];
}

export function ateFood(head, food) {
  return head.x === food.x && head.y === food.y;
}

export function generateFood(snakes) {
  const occupied = new Set(
    snakes.flatMap(s => s.body.map(p => `${p.x},${p.y}`))
  );
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (occupied.has(`${pos.x},${pos.y}`));
  return pos;
}

const OPPOSITES = { RIGHT: 'LEFT', LEFT: 'RIGHT', UP: 'DOWN', DOWN: 'UP' };

export function canChangeDirection(current, next) {
  return OPPOSITES[current] !== next;
}

export function getAutoDirection(head, food, currentDir) {
  const dx = food.x - head.x;
  const dy = food.y - head.y;
  const opposite = OPPOSITES[currentDir];

  const candidates = [];
  if (Math.abs(dx) >= Math.abs(dy)) {
    if (dx > 0) candidates.push('RIGHT');
    else if (dx < 0) candidates.push('LEFT');
    if (dy > 0) candidates.push('DOWN');
    else if (dy < 0) candidates.push('UP');
  } else {
    if (dy > 0) candidates.push('DOWN');
    else if (dy < 0) candidates.push('UP');
    if (dx > 0) candidates.push('RIGHT');
    else if (dx < 0) candidates.push('LEFT');
  }

  const valid = candidates.filter(d => d !== opposite);
  return valid[0] ?? currentDir;
}
