const BLACK_PAWN = 'bp';
const BLACK_KNIGHT = 'bn';
const BLACK_BISHOP = 'bb';
const BLACK_ROOK = 'br';
const BLACK_KING = 'bk';
const BLACK_QUEEN = 'bq';

const WHITE_PAWN = 'wp';
const WHITE_KNIGHT = 'wn';
const WHITE_BISHOP = 'wb';
const WHITE_ROOK = 'wr';
const WHITE_KING = 'wk';
const WHITE_QUEEN = 'wq';

const PIECES_LIST = [
  BLACK_PAWN, BLACK_KNIGHT, BLACK_BISHOP, BLACK_ROOK, BLACK_KING, BLACK_QUEEN,
  WHITE_PAWN, WHITE_KNIGHT, WHITE_BISHOP, WHITE_ROOK, WHITE_KING, WHITE_QUEEN
];

export const Pieces = {
  BLACK_PAWN,
  BLACK_KNIGHT,
  BLACK_BISHOP,
  BLACK_ROOK,
  BLACK_KING,
  BLACK_QUEEN,
  WHITE_PAWN,
  WHITE_KNIGHT,
  WHITE_BISHOP,
  WHITE_ROOK,
  WHITE_KING,
  WHITE_QUEEN,
  LIST: PIECES_LIST,
  evaluateCanditateMoves: (boardData, squareId) => {
    // should return [] if it is not that player's turn
    // should return [] if squareId points to a piece other than the selected one
    // should store candidates inside boardData
  }
};
