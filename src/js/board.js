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
        const square = createElement('div', {
          class: 'square',
          id: `${file}${rank}`,
          text: `${file}${rank}`
        });

        if ((i + j) % 2 === 1) {
          square.classList.add('black-square');
        }

        board.append(square);
      });
    })
  },
  flipBoard() {
    const board = qs('.board');
    if (!board) {
      return;
    }

    const squares = qsa('.square');
    if (!squares?.length) {
      return;
    }

    board.innerHtml = '';

    Array.from(squares)
      .reverse()
      .forEach(square => board.append(square));
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
      pos += 1;

      const selector = `#${files[pos]}${ranks[index]}`;
      const square = qs(selector);
      if (!square) {
        console.error(`[renderFenRank] square '${selector}' not found`);
        continue;
      }

      square.dataset.piece = PIECE_MAPPING[rank[i]];

      continue;
    }

    // empty square, simply advance
    pos += +rank[i];
  }
}