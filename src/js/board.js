import { qs, qsa, createElement } from './utils/dom-utils.js';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const board = {
  buildBoard() {
    const board = qs('.board');
    if (!board) {
      return;
    }

    ranks.forEach((rank, j) => {
      files.forEach((file, i) => {
        const cell = createElement('div', {
          class: 'cell',
          id: `${file}${rank}`,
          text: `${file}${rank}`
        });

        if ((i + j) % 2 === 1) {
          cell.classList.add('black-cell');
        }

        board.append(cell);
      });
    })
  },
  flipBoard() {
    const board = qs('.board');
    if (!board) {
      return;
    }

    const cells = qsa('.cell');
    if (!cells?.length) {
      return;
    }

    board.innerHtml = '';

    Array.from(cells)
      .reverse()
      .forEach(cell => board.append(cell));
  },
  loadFEN() {
    let fen = prompt('FEN');
    if (!fen) {
      alert('No FEN string provided');
      return;
    }

    console.log('FEN validation stage 1 complete');

    let segments = fen.split(' ').filter(s => s.length > 0);
    if (segments.length !== 6) {
      alert(`Invalid FEN string provided - incorrect number of segments - provided ${segments.length}, expected 6`);
      return;
    }

    console.log('FEN validation stage 2 complete');

    let [piecePlacement, activeColor, castlingAvailability, enPassantTargetSquare, halfMoveCount, fullMoveCount] = segments;

    let ranks = piecePlacement.split('/').filter(s => s.length > 0);
    if (ranks.length !== 8) {
      alert(`Invalid FEN string provided - incorrect number of ranks in piece placement - provided ${ranks.length}, expected 8`);
      return;
    }

    console.log('FEN validation stage 3 complete');

    const RANK_SYMBOLS = 'pnbrkqPNBRKQ12345678';
    let invalidRankPos = ranks.findIndex(r => {
      console.log(`checking rank "${r}"`);
      let invalid = false;
      let filesChecked = 0;
      for (let i = 0; i < r.length; i++) {
        if (!RANK_SYMBOLS.includes(r[i])) {
          invalid = true;
          console.log(`symbols are NOT valid`);
          break;
        }

        console.log(`symbols are valid`);

        filesChecked += isNaN(r[i]) ? 1 : +r[i];
      }

      if (filesChecked !== 8) {
        invalid = true;
        console.error(filesChecked < 8 ? 'rank doesn\'s cover all 8 files' : 'rank covers more than 8 files');
      }

      return invalid;
    });
    if (invalidRankPos !== -1) {
      alert(`Invalid FEN string provided - rank ${invalidRankPos} ("${ranks[invalidRankPos]}") is invalid`);
      return;
    }
  }

};