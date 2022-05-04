// https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation

// import { board } from './board';

const RANK_SYMBOLS = `pnbrkqPNBRKQ12345678`;

const pieceMapping = {};
pieceMapping['p'] = 'bp';
pieceMapping['n'] = 'bn';
pieceMapping['b'] = 'bb';
pieceMapping['r'] = 'br';
pieceMapping['k'] = 'bk';
pieceMapping['q'] = 'bq';
pieceMapping['P'] = 'wp';
pieceMapping['N'] = 'wn';
pieceMapping['B'] = 'wb';
pieceMapping['R'] = 'wr';
pieceMapping['K'] = 'wk';
pieceMapping['Q'] = 'wq';
export const PIECE_MAPPING = pieceMapping;

function parse(fen) {
  if (typeof fen !== 'string') {
    console.error(`parseFEN requires 'string' input but ${typeof fen} was provided`, fen);
    return false;
  }

  if (!fen) {
    return { error: `No FEN string provided` };
  }

  console.log(`FEN validation stage 1 complete`);

  let segments = fen.split(" ").filter((s) => s.length > 0);
  if (segments.length !== 6) {
    return {
      error: `Invalid FEN string provided - incorrect number of segments - provided ${segments.length}, expected 6`,
    };
  }

  console.log(`FEN validation stage 2 complete`);

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

  let ranks = piecePlacement.split("/").filter((s) => s.length > 0);
  if (ranks.length !== 8) {
    return {
      error: `Invalid FEN string provided - incorrect number of ranks in piece placement - provided ${ranks.length}, expected 8`,
    };
  }

  console.log(`FEN validation stage 3 complete`);

  let invalidRankPos = ranks.findIndex((rank) => !isRankValid(rank));
  if (invalidRankPos !== -1) {
    return {
      error: `Invalid FEN string provided - rank ${invalidRankPos} ("${ranks[invalidRankPos]}") is invalid`,
    };
  }

  return { ranks };
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
      console.log(`symbols are NOT valid`);
      return false;
    }

    console.log(`symbols are valid`);

    filesChecked += isNaN(rank[i]) ? 1 : +rank[i];
  }

  if (filesChecked !== 8) {
    console.error(
      filesChecked < 8
        ? `rank doesnt's cover all 8 files`
        : `rank covers more than 8 files`
    );

    return false;
  }

  return true;
}

let data = undefined;

export const fen = {
  RANK_SYMBOLS,
  data,
  load() {
    this.data = undefined;

    const fenData = parse(prompt(`FEN`));
    if (fenData.error) {
      alert(fenData.error);
      return;
    }

    this.data = fenData;

    console.table(this.data);
  },
};
