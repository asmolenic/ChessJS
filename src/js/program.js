import { board } from './board.js';
import { fen } from './fen.js';
import { addGlobalEventListener } from './utils/dom-utils.js';

board.buildBoard();

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
