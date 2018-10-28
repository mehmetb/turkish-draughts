export class Piece {
  /**
   * @param {TurkishDraughts} td 
   * @param {number} row 
   * @param {number} column 
   * @param {string} color 
   */
  constructor(td, row, column, color) {
    this.gameContainer = td.getGameContainer();
    this.board = td.getBoardInstance();
    this.options = td.getOptions();
    this.row = row;
    this.column = column;
    this.color = color;
    this.king = false;
    this.handleClick = this.handleClick.bind(this);

    this.init();
  }

  init() {
    this.elm = document.createElement('div');
    this.elm.className = 'turkish-draughts piece';
    this.elm.style.top = `${this.options.cellHeight * this.row}px`;
    this.elm.style.left = `${this.options.cellWidth * this.column}px`;
    this.elm.classList.add(this.color);
    this.elm.addEventListener("click", this.handleClick, false);
    this.gameContainer.appendChild(this.elm);
  }

  setColor(color) {
    this.color = color;
    this.elm.classList.remove('black', 'white');
    this.elm.classList.add(this.color);
  }

  getColor() {
    return this.color;
  }

  getPosition() {
    const { row, column } = this;

    return { row, column };
  }

  setPosition(row, column) {
    this.board.movePiece(currentRow, currentColumn, row, column);
    currentColumn = column;
    currentRow = row;

    elm.style.top = `${options.cellHeight * currentRow}px`;
    elm.style.left = `${options.cellWidth * currentColumn}px`;
  }

  promote() {
    this.king = true;
  }

  isKing() {
    return this.king;
  }

  handleClick() {
    this.board.drawPossiblePaths(this);
  }
}