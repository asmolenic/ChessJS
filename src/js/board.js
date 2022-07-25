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
      if (square)
      {
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
    return square.classList.contains('candidate') || square.classList.contains('capture-candidate');
  },

  //#region PIECE MOVEMENT
  getWhitePawnMoves(square) {
    // console.log(`getWhitePawnMoves(squareId=${squareId})`);
    const moves = [];

    const file = +square.dataset.file;
    const rank = +square.dataset.rank;

    if (!file || isNaN(file) || !rank || isNaN(rank)) {
      console.error('file/rank info missing on specified square', square);

      return;
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
    // console.log(`getBlackPawnMoves(squareId=${squareId})`);
    const moves = [];

    const file = +square.dataset.file;
    const rank = +square.dataset.rank;

    if (!file || isNaN(file) || !rank || isNaN(rank)) {
      console.error('file/rank info missing on specified square', square);

      return;
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
  //#endregion

};

window.board = board;
