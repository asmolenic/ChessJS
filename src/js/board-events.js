import { Pieces } from './pieces.js';
import { TURN_STAGES } from './constants.js';

export const boardEvents = {

  squareClicked(event) {
    const board = window.board;
    if (!board) {
      console.error('board object not found');

      return;
    }

    switch (board.boardData.turnStage) {
      case TURN_STAGES.ZERO:
        handleTurnStageZero(board, event.target)
        break;
      case TURN_STAGES.ONE:
        handleTurnStageOne(board, event.target)
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

function handleTurnStageZero(board, square) {
  console.log('turn stage 0', board.boardData, board.isEmptySquare(square), square);
  const bailMsg = 'bailing from handleTurnStageZero() #';

  if (board.isEmptySquare(square)) {
    console.log(bailMsg + 1);

    return;
  }

  if (board.getPieceColor(square) !== board.boardData.activeColor) {
    console.log(bailMsg + 2);

    return;
  }

  board.boardData.candidateMoves = board.computeCandidateMoves(square);
  if (board.boardData.candidateMoves.length === 0) {
    // console.log(bailMsg + 3);

    return;
  }

  board.setSelectedSquare(square);

  board.spotlightCanditateMoves();

  board.setTurnStage(TURN_STAGES.ONE);
}

function handleTurnStageOne(board, square) {
  // console.log('turn stage 1', board.boardData, square);

  if (!board.isCandidateSquare(square)) {
    board.clearCandidateMoves();
    board.clearSquareSelection();

    board.setTurnStage(TURN_STAGES.ZERO);

    return;
  }

  // proceed with finalizing the move (simple move or capture)
  // ...
}
