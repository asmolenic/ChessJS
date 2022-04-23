import { board } from './board.js';
import { addGlobalEventListener, qs } from './utils/dom-utils.js';

board.buildBoard();

addGlobalEventListener(
  "click",
  "#flipBoard",
  () => {
    qs('.board').classList.toggle('flipped');
  }
)