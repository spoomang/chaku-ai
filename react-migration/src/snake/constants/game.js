export const COLS = 25;
export const ROWS = 22;
export const CELL_SIZE = 26;
export const CANVAS_WIDTH = COLS * CELL_SIZE;
export const CANVAS_HEIGHT = ROWS * CELL_SIZE;
export const TICK_MS = 150;
export const MAX_PLAYERS = 2;
export const WIN_SCORE = 10;

export const KEY_DIRECTION_MAP = {
  ArrowRight: 'RIGHT',
  ArrowLeft: 'LEFT',
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
};

export const PLAYER_COLORS = [
  { head: '#4ade80', body: '#16a34a' },
  { head: '#fb923c', body: '#ea580c' },
];

export const BG_COLOR = '#020617';
export const GRID_COLOR = '#0f172a';
export const FOOD_COLOR = '#fbbf24';
