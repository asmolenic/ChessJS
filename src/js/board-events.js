import { Pieces } from './pieces.js';

export const boardEvents = {
  spawnPiece(event) {
    if (!(event.ctrlKey && !event.shiftKey && !event.altKey)) {
      return;
    }

    if (!event.target.classList.contains('square')) {
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
      return;
    }

    if (!event.target.classList.contains('square')) {
      return;
    }

    delete event.target.dataset.piece;
  }
}