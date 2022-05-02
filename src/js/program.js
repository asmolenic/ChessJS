import { board } from './board.js';
import { addGlobalEventListener, qs, qsa } from './utils/dom-utils.js';

board.buildBoard();
board.loadFEN();

addGlobalEventListener(
  "click",
  "#flipBoard",
  () => {
   board.flipBoard();
  }
)

// need code for FEN reading
// https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation