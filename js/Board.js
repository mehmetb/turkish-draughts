import { Piece } from './Piece.js';

export class Board {
  /**
   * @param {TurkishDraughts} td TurkishDraughts instance
   */
  constructor(td) {
    this.board = {};
    this.gameContainer = td.getGameContainer();
    this.td = td;
  }

  createBoard() {
    this.gameContainer.innerHTML = '';

    for (let i = 0; i < 8; ++i) {
      this.board[i] = {};

      for (let j = 0; j < 8; ++j) {
        const cell = this.createCellElement(i, j);
        let piece = null;

        this.gameContainer.appendChild(cell);

        if ([1, 2].indexOf(i) > -1) {
          piece = new Piece(this.td, i, j, "black");
        } else if ([5, 6].indexOf(i) > -1) {
          piece = new Piece(this.td, i, j, "white");
        }

        this.board[i][j] = {
          piece,
          cell,
        }
      }
    }
  }

  /**
   * An empty cell HTML template
   * @param {number} row
   * @param {number} column
   * @returns {HTMLElement}
   */
  createCellElement(row, column) {
    const color = (row + column) % 2 ? "black" : "white";
    const klass = "turkish-draughts board-cell " + color;
    const cell = document.createElement('div');

    cell.className = klass;

    return cell;
  }

  drawPossiblePaths(piece) {
    let directions;

    switch (piece.getColor()) {
      case "white":
        directions = ["up", "left", "right"];
        break;

      case "black":
        directions = ["down", "left", "right"];
        break;
    }

    this.resetPaths();

    for (let i = 0; i < directions.length; ++i) {
      const paths = this.getPossiblePaths(piece, directions[i]);

      for (var j = 0; j < paths.length; ++j) {
        this.showMoveGuideOnCell(paths[j].row, paths[j].column);
      }
    }
  }

  /**
   * Get the jump path for the given direction (maximum jumps)
   * @param piece
   * @param dir
   * @returns {object[]}
   */
  getPossiblePaths(piece, direction) {
    let maxJump = 0;
    let nextPiece = null;
    const position = piece.getPosition();
    const paths = [];
    const path = {
      row: null,
      column: null,
      jumpCount: 0,
      jumpPath: []
    };

    if (piece.isKing()) {

    } else {
      switch (direction) {
        case "up":
          if (position.row - 1 < 0) {
            break;
          }

          nextPiece = this.board[position.row - 1][position.column].piece;

          if (nextPiece == null) {
            path.row = position.row - 1;
            path.column = position.column;
            paths.push(path);
          } else {
            const jumpPath = this.getJumpPath(piece, "up");

            if (jumpPath.length) {
              path.jumpCount = jumpPath.length;
              path.jumpPath = jumpPath.slice();
              paths.push(path);

              if (maxJump < jumpPath.length) maxJump = jumpPath.length;
            }
          }
          break;

        case "right":
          if (position.column + 1 > 7) {
            break;
          }

          nextPiece = this.board[position.row][position.column + 1].piece;

          if (nextPiece == null) {
            path.row = position.row;
            path.column = position.column + 1;
            paths.push(path);
          } else {
            const jumpPath = this.getJumpPath(piece, "right");

            if (jumpPath.length) {
              path.jumpCount = jumpPath.length;
              path.jumpPath = jumpPath.slice();
              paths.push(path);

              if (maxJump < jumpPath.length) maxJump = jumpPath.length;
            }
          }
          break;

        case "down":
          if (position.row + 1 > 7) {
            break;
          }

          nextPiece = this.board[position.row + 1][position.column].piece;

          if (nextPiece == null) {
            path.row = position.row + 1;
            path.column = position.column;
            paths.push(path);
          } else {
            const jumpPath = this.getJumpPath(piece, "down");

            if (jumpPath.length) {
              path.jumpCount = jumpPath.length;
              path.jumpPath = jumpPath.slice();
              paths.push(path);

              if (maxJump < jumpPath.length) maxJump = jumpPath.length;
            }
          }
          break;

        case "left":
          if (position.column - 1 < 0) {
            break;
          }

          nextPiece = this.board[position.row][position.column - 1].piece;

          if (nextPiece == null) {
            path.row = position.row;
            path.column = position.column - 1;
            paths.push(path);
          } else {
            const jumpPath = this.getJumpPath(piece, "left");

            if (jumpPath.length) {
              path.jumpCount = jumpPath.length;
              path.jumpPath = jumpPath.slice();
              paths.push(path);

              if (maxJump < jumpPath.length) maxJump = jumpPath.length;
            }
          }
          break;
      }
    }

    for (let i = 0; i < paths.length; ++i) {
      if (paths[i].jumpCount < maxJump) paths.splice(i, 1);
    }

    return paths;
  }

  getJumpPath(piece, dir) {
    const jumpPath = [];
    const position = piece.getPosition();
    let nextPiece;

    switch (dir) {
      case "up":
        nextPiece = this.board[position.row - 1][position.column].piece;
        if (nextPiece.getColor() == piece.getColor()) break;
        break;

      case "right":
        nextPiece = this.board[position.row][position.column + 1].piece;
        if (nextPiece.getColor() == piece.getColor()) break;
        break;

      case "down":
        nextPiece = this.board[position.row + 1][position.column].piece;
        if (nextPiece.getColor() == piece.getColor()) break;
        break;

      case "left":
        nextPiece = this.board[position.row][position.column - 1].piece;
        if (nextPiece.getColor() == piece.getColor()) break;
        break;
    }

    return jumpPath;
  }

  resetPaths() {
    const children = this.gameContainer.querySelectorAll(`.board-cell`);

    for (let element of children) {
      element.classList.remove('movable');
    }
  }

  showMoveGuideOnCell(row, column) {
    this.board[row][column].cell.classList.add("movable");
  }

  getPiece(row, column) {
    return this.board[row][column].piece;
  }

  clearBoard() {
    //TODO: Clear board
  }
}