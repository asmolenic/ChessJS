import { board } from './board.js';
import { fen } from './fen.js';
import { addGlobalEventListener } from './utils/dom-utils.js';

board.buildBoard();
fen.load(fen.STARTING_POSITION);
board.renderFenData(fen.data);

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
    board.renderFenData(fen.data);
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
  board.events.spawnPiece
);
