import { forwardRef } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/game';

const GameCanvas = forwardRef(function GameCanvas(_, ref) {
  return (
    <div className="sg-canvas-wrap">
      <canvas
        ref={ref}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ display: 'block', imageRendering: 'pixelated' }}
      />
    </div>
  );
});

export default GameCanvas;
