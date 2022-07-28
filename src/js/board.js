import { qs, qsa, createElement } from './utils/dom-utils.js';
import { Pieces } from './pieces.js';
import { files, ranks } from './config.js';
import { TURN_STAGES, WHITE, BLACK } from './constants.js';


export const board = {
  boardData: { squares: {}, candidateMoves: [] },

  buildBoard() {
    const board = qs('.board');
    if (!board) {
      return;
    }

    board.innerHtml = '';
    this.boardData = { squares: {} };

    ranks.forEach((rank, j) => {
      files.forEach((file, i) => {
        const id = `${file}${rank}`;

        const square = createElement('div', {
          class: 'square',
          id,
          text: id
        });

        if ((i + j) % 2 === 1) {
          square.classList.add('black-square');
        }

        square.dataset.file = i + 1;
        square.dataset.rank = rank;

        let squareData = {
          element: square
        }

        this.boardData.squares[id] = this.boardData.squares[`${i + 1}${rank}`] = squareData;

        board.append(square);
      });
    });

    this.setTurnStage(TURN_STAGES.ZERO);
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

  setTurnStage(stage) {
    if (stage !== TURN_STAGES.ZERO && stage !== TURN_STAGES.ONE) {
      console.error('Invalid turn!');

      return;
    }

    // TODO: at this point we could "paint" specified stage in UI

    this.boardData.turnStage = stage;
  },

  computeCandidateMoves(square) {
    // console.log('computeCandidateMoves', square);

    const piece = square?.dataset?.piece;
    if (!piece) {
      return [];
    }

    switch (piece) {
      case Pieces.WHITE_PAWN:
        return this.getWhitePawnMoves(square);
      case Pieces.BLACK_PAWN:
        return this.getBlackPawnMoves(square);
      case Pieces.WHITE_KNIGHT:
      case Pieces.BLACK_KNIGHT:
        return this.getKnightMoves(square);
      case Pieces.WHITE_BISHOP:
      case Pieces.BLACK_BISHOP:
        return this.getBishopMoves(square);
      case Pieces.WHITE_ROOK:
      case Pieces.BLACK_ROOK:
        return this.getRookMoves(square);
      default:
        return [];
    }
  },

  spotlightCanditateMoves(candidateMoves = undefined) {
    // console.log('spotlightCanditateMoves', moves);

    const moves = candidateMoves || this.boardData.candidateMoves;

    moves.forEach(move => {
      // console.log('spotlightCanditateMoves', move, this.boardData.squares[move]);

      this.boardData.squares[move.squareId]?.element?.classList.add(move.isCapture ? 'candidate-capture' : 'candidate');
    });
  },

  clearCandidateMoves() {
    let square;
    this.boardData.candidateMoves.forEach(move => {
      square = this.boardData.squares[move.squareId];
      if (square) {
        square.element.classList.remove('candidate');
        square.element.classList.remove('candidate-capture');
      }
    });

    this.boardData.candidateMoves = [];
  },

  setSelectedSquare(square) {
    square.classList.add('selected');
    board.boardData.selectedSquare = square;
  },

  clearSquareSelection() {
    this.boardData.selectedSquare?.classList.remove('selected');
    board.boardData.selectedSquare = undefined;
  },

  isEmptySquare(square) {
    return !square.dataset.piece;
  },

  getPieceColor(square) {
    // console.log('getPieceColor', square);

    if (this.isEmptySquare(square)) {
      return undefined;
    }

    const color = square.dataset.piece.charAt(0);
    if (color !== WHITE && color !== BLACK) {
      console.error('getPieceColor() found unknown color', color, square);
    }

    return color;
  },

  isCandidateSquare(square) {
    // console.log('isCandidateSquare', square, square.classList);
    return square.classList.contains('candidate') || square.classList.contains('candidate-capture');
  },

  togglePlayerTurn() {
    this.boardData.activeColor = this.boardData.activeColor === WHITE ? BLACK : WHITE;
  },

  //#region PIECE MOVEMENT
  getWhitePawnMoves(square) {
    // console.log(`getWhitePawnMoves`, square);
    const moves = [];

    const file = +square.dataset.file;
    const rank = +square.dataset.rank;

    if (!file || isNaN(file) || !rank || isNaN(rank)) {
      console.error('file/rank info missing on specified square', square);

      return moves;
    }

    if (rank === 1) {
      console.warn(`Shady white pawn detected on ${square.id}!`);

      return moves;
    }

    let targetSquare;

    // if square directly in front of the pawn is empty then it is a valid move
    const firstSquareKey = `${file}${rank + 1}`;
    // console.log('getWhitePawnMoves first square key', firstSquareKey);
    targetSquare = this.boardData.squares[firstSquareKey]?.element;
    // console.log('getWhitePawnMoves first square', targetSquare);
    if (targetSquare && this.isEmptySquare(targetSquare)) {
      moves.push({ squareId: targetSquare.id, isCapture: false });

      if (rank === 2) {
        // for their first move pawns can advance two squares
        const secondSquareKey = `${file}${rank + 2}`;
        targetSquare = this.boardData.squares[secondSquareKey]?.element;
        // console.log('getWhitePawnMoves second square', targetSquare);
        if (targetSquare && this.isEmptySquare(targetSquare)) {
          moves.push({ squareId: targetSquare.id, isCapture: false });
        }
      }
    }

    const leftCaptureSquareKey = `${file - 1}${rank + 1}`;
    targetSquare = this.boardData.squares[leftCaptureSquareKey]?.element;
    // console.log('getWhitePawnMoves left capture square', targetSquare);
    if (targetSquare && this.getPieceColor(targetSquare) === BLACK) {
      moves.push({ squareId: targetSquare.id, isCapture: true });
    }

    const rightCaptureSquareKey = `${file + 1}${rank + 1}`;
    targetSquare = this.boardData.squares[rightCaptureSquareKey]?.element;
    // console.log('getWhitePawnMoves right capture square', targetSquare);
    if (targetSquare && this.getPieceColor(targetSquare) === BLACK) {
      moves.push({ squareId: targetSquare.id, isCapture: true });
    }

    return moves;
  },

  getBlackPawnMoves(square) {
    // console.log(`getBlackPawnMoves`, square);
    const moves = [];

    const file = +square.dataset.file;
    const rank = +square.dataset.rank;

    if (!file || isNaN(file) || !rank || isNaN(rank)) {
      console.error('file/rank info missing on specified square', square);

      return moves;
    }

    if (rank === 8) {
      console.warn(`Shady black pawn detected on ${square.id}!`);

      return moves;
    }

    let targetSquare;

    // if square directly in front of the pawn is empty then it is a valid move
    const firstSquareKey = `${file}${rank - 1}`;
    // console.log('getBlackPawnMoves first square key', firstSquareKey);
    targetSquare = this.boardData.squares[firstSquareKey]?.element;
    // console.log('getBlackPawnMoves first square', targetSquare);
    if (targetSquare && this.isEmptySquare(targetSquare)) {
      moves.push({ squareId: targetSquare.id, isCapture: false });

      if (rank === 7) {
        // for their first move pawns can advance two squares
        const secondSquareKey = `${file}${rank - 2}`;
        targetSquare = this.boardData.squares[secondSquareKey]?.element;
        // console.log('getBlackPawnMoves second square', targetSquare);
        if (targetSquare && this.isEmptySquare(targetSquare)) {
          moves.push({ squareId: targetSquare.id, isCapture: false });
        }
      }
    }

    const leftCaptureSquareKey = `${file + 1}${rank - 1}`;
    targetSquare = this.boardData.squares[leftCaptureSquareKey]?.element;
    // console.log('getBlackPawnMoves left capture square', targetSquare);
    if (targetSquare && this.getPieceColor(targetSquare) === WHITE) {
      moves.push({ squareId: targetSquare.id, isCapture: true });
    }

    const rightCaptureSquareKey = `${file - 1}${rank - 1}`;
    targetSquare = this.boardData.squares[rightCaptureSquareKey]?.element;
    // console.log('getBlackPawnMoves right capture square', targetSquare);
    if (targetSquare && this.getPieceColor(targetSquare) === WHITE) {
      moves.push({ squareId: targetSquare.id, isCapture: true });
    }

    return moves;
  },

  getKnightMoves(square) {
    // console.log(`getKnightMoves`, square);
    const moves = [];

    const file = +square.dataset.file;
    const rank = +square.dataset.rank;

    if (!file || isNaN(file) || !rank || isNaN(rank)) {
      console.error('file/rank info missing on specified square', square);

      return moves;
    }

    const possibilities = [
      { file: file - 2, rank: rank + 1 },
      { file: file - 2, rank: rank - 1 },
      { file: file - 1, rank: rank + 2 },
      { file: file - 1, rank: rank - 2 },
      { file: file + 1, rank: rank + 2 },
      { file: file + 1, rank: rank - 2 },
      { file: file + 2, rank: rank + 1 },
      { file: file + 2, rank: rank - 1 }
    ];

    let squareKey;
    let targetSquare;
    let targetSquarePieceColor;
    possibilities.forEach(p => {
      squareKey = `${p.file}${p.rank}`;
      targetSquare = this.boardData.squares[squareKey]?.element;
      if (!targetSquare) {
        return;
      }

      if (this.isEmptySquare(targetSquare)) {
        moves.push({ squareId: targetSquare.id, isCapture: false });

        return;
      }

      targetSquarePieceColor = this.getPieceColor(targetSquare);
      if (!targetSquarePieceColor) {
        return;
      }

      if (targetSquarePieceColor === this.boardData.activeColor) {
        return;
      }

      moves.push({ squareId: targetSquare.id, isCapture: true });
    });

    return moves;
  },

  getBishopMoves(square) {
    // console.log('getBishopMoves', square);
    const moves = [];

    const file = +square.dataset.file;
    const rank = +square.dataset.rank;

    if (!file || isNaN(file) || !rank || isNaN(rank)) {
      console.error('file/rank info missing on specified square', square);

      return moves;
    }

    const directions = [
      { file: -1, rank: 1 },
      { file: -1, rank: -1 },
      { file: 1, rank: 1 },
      { file: 1, rank: -1 },
    ];

    directions.forEach(d => moves.push(...this.getLaserMoves({ file, rank }, d)));

    console.log('getBishopMoves returning', moves);
    return moves;
  },

  getRookMoves(square) {
    // console.log('getRookMoves', square);
    const moves = [];

    const file = +square.dataset.file;
    const rank = +square.dataset.rank;

    if (!file || isNaN(file) || !rank || isNaN(rank)) {
      console.error('file/rank info missing on specified square', square);

      return moves;
    }

    const directions = [
      { file: 0, rank: 1 },
      { file: 1, rank: 0 },
      { file: 0, rank: -1 },
      { file: -1, rank: 0 },
    ];

    directions.forEach(d => moves.push(...this.getLaserMoves({ file, rank }, d)));

    console.log('getRookMoves returning', moves);
    return moves;
  },

  getLaserMoves(source, direction) {
    const moves = [];
    let multiplier;
    let squareKey;
    let targetSquare;
    let targetSquarePieceColor;
    multiplier = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      squareKey = `${source.file + direction.file * multiplier}${source.rank + direction.rank * multiplier}`;
      console.log('squareKey', squareKey);
      targetSquare = this.boardData.squares[squareKey]?.element;
      if (!targetSquare) {
        break;
      }

      if (!this.isEmptySquare(targetSquare)) {
        targetSquarePieceColor = this.getPieceColor(targetSquare);
        if (targetSquarePieceColor !== this.boardData.activeColor) {
          moves.push({ squareId: targetSquare.id, isCapture: true });
        }

        break;
      }

      moves.push({ squareId: targetSquare.id, isCapture: false });
      multiplier++;
    }

    console.log('getLaserMoves returning', moves);
    return moves;
  }
  //#endregion

};

window.board = board;
