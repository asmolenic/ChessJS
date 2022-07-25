// https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation

import { Pieces } from './pieces.js';
import { files, ranks } from './config.js';

const RANK_SYMBOLS = `pnbrkqPNBRKQ12345678`;
const STARTING_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const PIECE_MAPPING = {
  ['p']: Pieces.BLACK_PAWN,
  ['n']: Pieces.BLACK_KNIGHT,
  ['b']: Pieces.BLACK_BISHOP,
  ['r']: Pieces.BLACK_ROOK,
  ['k']: Pieces.BLACK_KING,
  ['q']: Pieces.BLACK_QUEEN,
  ['P']: Pieces.WHITE_PAWN,
  ['N']: Pieces.WHITE_KNIGHT,
  ['B']: Pieces.WHITE_BISHOP,
  ['R']: Pieces.WHITE_ROOK,
  ['K']: Pieces.WHITE_KING,
  ['Q']: Pieces.WHITE_QUEEN
};

const CASTLING_VALUES = ['-', 'K', 'Q', 'KQ', 'Kk', 'Kq', 'Kkq', 'Qk', 'Qq', 'Qkq', 'KQk', 'KQq', 'KQkq', 'k', 'q', 'kq'];

function parse(fen) {
  // console.log('Parsing FEN:', fen);

  if (typeof fen !== 'string') {
    return { error: `parseFEN requires 'string' input but ${typeof fen} was provided` };
  }

  if (!fen) {
    return { error: `No FEN string provided` };
  }

  // console.log(`FEN validation stage 1 complete`);
  const baseErr = 'Invalid FEN string provided';

  let segments = fen.split(' ').filter((s) => s.length > 0);
  if (segments.length !== 6) {
    return {
      error: `${baseErr} - incorrect number of segments - provided ${segments.length}, expected 6`,
    };
  }

  // console.log(`FEN validation stage 2 complete`);

  let [
    piecePlacement,
    // eslint-disable-next-line no-unused-vars
    activeColor,
    // eslint-disable-next-line no-unused-vars
    castlingAvailability,
    // eslint-disable-next-line no-unused-vars
    enPassantTargetSquare,
    // eslint-disable-next-line no-unused-vars
    halfMoveCount,
    // eslint-disable-next-line no-unused-vars
    fullMoveCount,
  ] = segments;

  let ranks = piecePlacement.split('/').filter((s) => s.length > 0);
  if (ranks.length !== 8) {
    return {
      error: `${baseErr} - incorrect number of ranks in piece placement - provided ${ranks.length}, expected 8`
    };
  }

  // console.log(`FEN validation stage 3 complete`);

  let invalidRankPos = ranks.findIndex((rank) => !isRankValid(rank));
  if (invalidRankPos !== -1) {
    return {
      error: `${baseErr} - rank ${invalidRankPos} ("${ranks[invalidRankPos]}") is invalid`
    };
  }

  if (activeColor !== 'w' && activeColor !== 'b') {
    return {
      error: `${baseErr} - incorrect active color - provided '${activeColor}', expected 'w' or 'b'`
    };
  }

  if (!CASTLING_VALUES.includes(castlingAvailability)) {
    return {
      error: `${baseErr} - incorrect castling availability - provided '${castlingAvailability}', expected one of [${CASTLING_VALUES.join(', ')}]`
    };
  }

  const length = enPassantTargetSquare?.length ?? 0;
  if ((length !== 1 && length !== 2) || (length === 1 && enPassantTargetSquare !== '-')) { // THIS DOESN'T TAKE INTO ACCOUNT THE '-' VALUE
    return {
      error: `${baseErr} - en passant target square validation failed on stage 1 (${enPassantTargetSquare})`
    };
  }

  const file = enPassantTargetSquare[0];
  const rank = enPassantTargetSquare[1];
  if (length === 2 && (!files.includes(file) || !ranks.includes(rank))) {
    return {
      error: `${baseErr} - en passant target square validation failed on stage 2 (${enPassantTargetSquare})`
    };
  }

  return { ranks, activeColor, castlingAvailability, enPassantTargetSquare };
}

function isRankValid(rank) {
  if (typeof rank !== 'string') {
    console.error(`isRankValid requires 'string' input but '${typeof rank}' was provided`, rank);
    return false;
  }

  if (!rank) {
    return false;
  }

  let filesChecked = 0;
  for (let i = 0; i < rank.length; i++) {
    if (!RANK_SYMBOLS.includes(rank[i])) {
      // console.log(`symbols are NOT valid`);

      return false;
    }

    // console.log(`symbols are valid`);

    filesChecked += isNaN(rank[i]) ? 1 : +rank[i];
  }

  if (filesChecked !== 8) {
    console.error(filesChecked < 8 ? `rank doesnt's cover all 8 files` : `rank covers more than 8 files`);

    return false;
  }

  return true;
}

let data = undefined;

export const fen = {
  RANK_SYMBOLS,
  data,
  STARTING_POSITION,
  load(fenStr = '') {
    this.data = undefined;

    const fenData = parse(fenStr || prompt(`FEN`));
    if (fenData.error) {
      alert(fenData.error);
      return;
    }

    this.data = fenData;

    console.table(this.data);
  },

  // FIXME: this function must clear board first
  renderFenData(board, fenData) {
    // console.log('[renderFenData] rendering ...', fenData);

    if (!fenData) {
      return;
    }

    renderFenRanks(board, fenData?.ranks);
    board.boardData.activeColor = fenData.activeColor;
  },
};

function renderFenRanks(board, ranks) {
  if (!Array.isArray(ranks)) {
    console.error(`[renderFenRanks] ranks expected as 'Array' but it is a '${typeof ranks}'`, ranks);
    return;
  }

  ranks.forEach((rank, index) => renderFenRank(board, rank, index));
}


function renderFenRank(board, rank, index) {
  if (typeof rank !== 'string') {
    console.error(`[renderFenRank] rank expected as 'string' but it is a '${typeof rank}'`, rank);
    return;
  }

  let pos = -1;
  for (let i = 0; i < rank.length; i++) {
    if (isNaN(rank[i])) {
      // we've encountered a piece so we must render it
      pos += 1;

      const squareKey = `${files[pos]}${ranks[index]}`;
      const square = board?.boardData?.squares[squareKey].element;
      if (!square) {
        console.error(`[renderFenRank] square '${squareKey}' not found`);
        continue;
      }

      square.dataset.piece = PIECE_MAPPING[rank[i]];

      continue;
    }

    // empty square, simply advance
    pos += +rank[i];
  }
}
