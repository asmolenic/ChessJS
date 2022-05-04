import { qs, qsa, createElement } from './utils/dom-utils.js';
import { PIECE_MAPPING } from './fen.js';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const board = {
  buildBoard() {
    const board = qs('.board');
    if (!board) {
      return;
    }

    board.innerHtml = '';

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
  renderFenData(data) {
    console.log('[renderFenData] rendering ...', data);
    if (!data) {
      return;
    }

    renderFenRanks(data?.ranks);
  }
};

function renderFenRanks(ranks) {
  if (!Array.isArray(ranks)) {
    console.error(`[renderFenRanks] ranks expected as 'Array' but it is a '${typeof ranks}'`, ranks);
    return;
  }

  ranks.forEach((rank, index) => renderFenRank(rank, index));
}


function renderFenRank(rank, index) {
  if (typeof rank !== 'string') {
    console.error(`[renderFenRank] rank expected as 'string' but it is a '${typeof rank}'`, rank);
    return;
  }

  let pos = -1;
  for (let i = 0; i < rank.length; i++) {
    if (isNaN(rank[i])) {
      // we've encountered a piece so we must render it
      pos+=1;

      const selector = `#${files[pos]}${ranks[index]}`;
      const cell = qs(selector);
      if (!cell) {
        console.error(`[renderFenRank] cell '${selector}' not found`);
        continue;
      }

      const pieceClass = `piece-${PIECE_MAPPING[rank[i]]}`;
      cell.classList.remove(pieceClass);
      cell.classList.add(pieceClass);

      continue;
    }

    // empty cell, simply advance
    pos += +rank[i];
  }
}