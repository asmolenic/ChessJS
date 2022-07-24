import { Pieces } from './pieces.js';
import { BLACK, TURN_STAGES, WHITE } from './constants.js';

export const boardEvents = {

  squareClicked(event) {
    const boardData = window.board.boardData;
    if (!boardData) {
      return;
    }

    switch (boardData.turnStage) {
      case TURN_STAGES.ZERO:
        handleTurnStageZero(boardData, event.target)
        break;
      case TURN_STAGES.ONE:
        handleTurnStageOne(boardData, event.target)
        break;
      default:
        break;
    }
  },

  //#region Admin Events
  spawnPiece(event) {
    if (!(event.ctrlKey && !event.shiftKey && !event.altKey)) {
      console.log('bailing from spawnPiece() #1');

      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    if (!event.target.classList.contains('square')) {
      console.log('bailing from spawnPiece() #2');

      return;
    }

    let piece = window.prompt(`What piece must be spawned?
  bp -> black pawn . . . . . . wp -> white pawn
  bn -> black knight . . . . . wn -> white knight
  bb -> black bishop . . . . .wb -> white bishop
  br -> black rook . . . . . . . wr -> white rook
  bk -> black king . . . . . . . wk -> white king
  bq -> black queen . . . . . wq -> white queen`);
    if (!piece) {
      return;
    }

    piece = piece.trim();

    if (!Pieces.LIST.includes(piece)) {
      return;
    }

    event.target.dataset.piece = piece;
  },

  deletePiece(event) {
    if (!(event.ctrlKey && event.shiftKey)) {
      console.log('bailing from deletePiece() #1');

      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    if (!event.target.classList.contains('square')) {
      console.log('bailing from deletePiece() #2');

      return;
    }

    delete event.target.dataset.piece;
  }
  //#endregion

}

function handleTurnStageZero(boardData, square) {
  console.log('turn stage 0', boardData, isEmptySquare(square), square);
  const bailMsg = 'bailing from handleTurnStageZero() #';

  if (isEmptySquare(square)) {
    console.log(bailMsg + 1);

    return;
  }

  if (getPieceColor(square) !== boardData.activeColor) {
    console.log(bailMsg + 2);

    return;
  }
}

function handleTurnStageOne(boardData, square) {
  console.log('turn stage 1', boardData, square);
}

function isEmptySquare(square) {
  return !square.dataset.piece;
}

function getPieceColor(square) {
  if (isEmptySquare(square)) {
    return undefined;
  }

  const color = square.dataset.piece.charAt(0);
  if (color !== WHITE && color !== BLACK) {
    console.error('getPieceColor() found unknown color', color, square);
  }

  return color;
}