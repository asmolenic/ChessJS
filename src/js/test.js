import { board } from './board.js';
import { addGlobalEventListener, qs, qsa } from './utils/dom-utils.js';

board.buildBoard();

addGlobalEventListener(
  "click",
  "#flipBoard",
  () => {
   board.flipBoard();
  }
)