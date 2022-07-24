// import { board } from './board.js';
import { WHITE, BLACK } from "./constants.js";

const PAWN = 'p';
const KNIGHT = 'n';
const BISHOP = 'b';
const ROOK = 'r';
const KING = 'k';
const QUEEN = 'q';

const BLACK_PAWN = `${BLACK}${PAWN}`;
const BLACK_KNIGHT = `${BLACK}${KNIGHT}`;
const BLACK_BISHOP = `${BLACK}${BISHOP}`;
const BLACK_ROOK = `${BLACK}${ROOK}`;
const BLACK_KING = `${BLACK}${KING}`;
const BLACK_QUEEN = `${BLACK}${QUEEN}`;

const WHITE_PAWN = `${WHITE}${PAWN}`;
const WHITE_KNIGHT = `${WHITE}${KNIGHT}`;
const WHITE_BISHOP = `${WHITE}${BISHOP}`;
const WHITE_ROOK = `${WHITE}${ROOK}`;
const WHITE_KING = `${WHITE}${KING}`;
const WHITE_QUEEN = `${WHITE}${QUEEN}`;

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
  // evaluateCanditateMoves: (boardData, squareId) => {
  //   // should return [] if it is not that player's turn
  //   // should return [] if squareId points to a piece other than the selected one
  //   // should store candidates inside boardData
  // }
};
