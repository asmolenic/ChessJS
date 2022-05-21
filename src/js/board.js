import { qs, qsa, createElement } from './utils/dom-utils.js';
import { PIECE_MAPPING } from './fen.js';
import * as Pieces from './pieces.js';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

export const board = {
  events: { startMove, cancelMove },
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
  },

};

window.board = board;

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

// function isSquareIdValid(squareId) {
//   if (typeof squareId !== 'string' || squareId.length !== 2) {
//     return false;
//   }

//   if (!files.includes(squareId.charAt(0))) {
//     return false;
//   }

//   return ranks.includes(+squareId.charAt(1));
// }

// idea for renaming: intializeTurnForWhite
function startMove(event) {
  event.stopImmediatePropagation();

  const candidateMoves = getCandidateMoves(event.target);
  console.log('candidate moves', candidateMoves);

  // store candidate moves so we can clear them when completing the move
  event.target.dataset.candidates = JSON.stringify(candidateMoves);

  // mark the square/piece as selected
  event.target.classList.add('selected');

  spotlightCanditateMoves(candidateMoves);
}

function getCandidateMoves(square) {
  const squareId = square?.getAttribute('id');
  if (!squareId) {
    return [];
  }

  const piece = square?.dataset.piece;

  switch (piece) {
    case Pieces.WHITE_PAWN:
      return getWhitePawnMoves(squareId);
    default:
      return [];
  }
}

function getWhitePawnMoves(squareId) {
  let file = squareId.charAt(0);
  const rank = +squareId.charAt(1);

  const moves = [];

  if (rank === 1) {
    console.warn(`Shady pawn detected on ${squareId}!`);
    return moves;
  }

  let targetSquare;

  // if square directly in front of the pawn is empty then it is a valid move
  const firstSquareId = `${file}${rank + 1}`;
  targetSquare = qs(`#${firstSquareId}`);
  if (targetSquare && !targetSquare.dataset.piece) {
    moves.push({ squareId: firstSquareId, isCapture: false });

    if (rank === 2) {
      // for their first move pawns can advance two squares
      const secondSquareId = `${file}${rank + 2}`;
      targetSquare = qs(`#${secondSquareId}`);
      if (targetSquare && !targetSquare.dataset.piece) {
        moves.push({ squareId: secondSquareId, isCapture: false });
      }
    }
  }

  const leftCaptureSquare = `${getOffsettedFile(file, -1)}${rank + 1}`;
  targetSquare = qs(`#${leftCaptureSquare}`);
  if (targetSquare && targetSquare.dataset.piece?.charAt(0) === 'b') {
    moves.push({ squareId: leftCaptureSquare, isCapture: true });
  }

  const rightCaptureSquare = `${getOffsettedFile(file, +1)}${rank + 1}`;
  targetSquare = qs(`#${rightCaptureSquare}`);
  if (targetSquare && targetSquare.dataset.piece?.charAt(0) === 'b') {
    moves.push({ squareId: rightCaptureSquare, isCapture: true });
  }

  return moves;
}

function getOffsettedFile(file = ' ', offset = 0) {
  if (typeof file !== 'string' || file.length === 0) {
    return ' ';
  }

  return String.fromCharCode(file.charCodeAt(0) + offset);
}

function spotlightCanditateMoves(moves) {
  moves.forEach(move => {
    qs(`#${move.squareId}`)?.classList.add(move.isCapture ? 'candidate-capture' : 'candidate');
  });
}

function cancelMove(event) {
  event.target.classList.remove('selected');
  const canditates = JSON.parse(event.target.dataset.candidates);
  canditates.forEach(candidate => {
    qs(`#${candidate.squareId}`)?.classList?.remove(candidate.isCapture ? 'candidate-capture' : 'candidate')
  });

  delete event.target.dataset.candidates;
}
