import { board } from './board.js';
import { boardEvents } from './board-events.js';
import { fen } from './fen.js';
import { addGlobalEventListener } from './utils/dom-utils.js';

board.buildBoard();
fen.load(fen.STARTING_POSITION);
fen.renderFenData(board, fen.data);

addGlobalEventListener(
  "click",
  "#flipBoard",
  () => {
    board.flipBoard();
  }
);

addGlobalEventListener(
  "click",
  "#loadFen",
  () => {
    fen.load();
    fen.renderFenData(board, fen.data);
  }
);

addGlobalEventListener(
  "click",
  "#resetGame",
  () => {
    if(confirm('Are you sure? All game progress will be lost.')) {
      window.location.reload();
    }
  }
);

addGlobalEventListener(
  "click",
  ".square",
  boardEvents.spawnPiece
);

addGlobalEventListener(
  "click",
  ".square",
  boardEvents.deletePiece
);

addGlobalEventListener(
  "click",
  ".square",
  boardEvents.squareClicked
);

addGlobalEventListener(
  "click",
  ".square[data-piece^=w]:not(.selected)",
  board.events.startMove
);

addGlobalEventListener(
  "click",
  ".square.selected",
  board.events.cancelMove
);
