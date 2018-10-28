import { Board } from './Board.js';

export class TurkishDraughts {
  /**
   * @param {HTMLElement} container 
   * @param {object} opts 
   */
  constructor(container, opts = {}) {
    if (!(container instanceof HTMLElement)) {
      throw new Error("container must be a DOM object.");
    }

    const DEFAULTS = {
      cellWidth: 50,
      cellHeight: 50
    };

    container.innerHTML = '';
    container.classList.add('turkish-draughts', 'game-container');

    this.gameContainer = container;
    this.options = { ...DEFAULTS, ...opts };
    this.board = new Board(this);
  }

  getGameContainer() {
    return this.gameContainer;
  }

  getBoardInstance() {
    return this.board;
  }

  getOptions() {
    return this.options;
  }

  start() {
    this.board.createBoard();
  }
}