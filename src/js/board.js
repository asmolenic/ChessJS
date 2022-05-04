import { qs, qsa, createElement } from './utils/dom-utils.js';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const board = {
  files,
  ranks,
  buildBoard() {

    console.log(this);
    const board = qs('.board');
    if (!board) {
      return;
    }

    ranks.forEach((rank, j) => {
      files.forEach((file, i) => {
        const cell = createElement('div', {
          class: 'cell',
          id: `${file}${rank}`,
          text: `${file}${rank}`
        });

        if ((i + j) % 2 === 1) {
          cell.classList.add('black-cell');
        }

        board.append(cell);
      });
    })
  },
  flipBoard() {
    const board = qs('.board');
    if (!board) {
      return;
    }

    const cells = qsa('.cell');
    if (!cells?.length) {
      return;
    }

    board.innerHtml = '';

    Array.from(cells)
      .reverse()
      .forEach(cell => board.append(cell));
  }
};