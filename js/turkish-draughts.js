/**
 * Created by Mehmet Baker on 31.01.2016.
 */

function TurkishDraughts(container, opts = {}) {
  var uid;
  var gameContainer;
  var boardObject;
  var DEFAULTS = {
    cellWidth: 50,
    cellHeight: 50
  };
  const options = { ...DEFAULTS, ...opts };

  if (!(container instanceof HTMLElement)) {
    throw new Error("container must be a DOM object.");
  }

  /**
   * Generates unique id
   * @return {string}
   */
  function GUID() {
    var id = "";

    for (var i = 0; i < 19; ++i) {
      id += Math.floor(Math.random() * 10) + '';
    }

    return "turkish-draughts_" + id;
  }

  /**
   * A div will be appended to the container object
   */
  function createGameContainer() {
    gameContainer = document.createElement('div');
    gameContainer.id = uid;
    gameContainer.className = "turkish-draughts game-container";
    container.appendChild(gameContainer);
  }

  /**
   * Virtual Board for easier calculations
   * @constructor
   */
  function Board() {
    var board = {};

    function createBoard() {
      gameContainer.innerHTML = '';

      for (var i = 0; i < 8; ++i) {
        board[i] = {};

        for (var j = 0; j < 8; ++j) {
          var piece = null;
          var cell = createCellElement(i, j);

          gameContainer.appendChild(cell);

          if ([1, 2].indexOf(i) > -1) {
            piece = new Piece(i, j, "black");
          } else if ([5, 6].indexOf(i) > -1) {
            piece = new Piece(i, j, "white");
          }

          board[i][j] = {
            piece: piece,
            elm: cell
          }
        }
      }
    }

    function movePiece(currentRow, currentColumn, toRow, toColumn) {
      var piece = board[currentRow][currentColumn].piece;
      var oldPos = piece.getPosition();

      board[oldPos.row][oldPos.column].piece = null;
      board[toRow][toColumn].piece = piece;
    }

    function getPiece(row, column) {
      return board[row][column].piece;
    }

    function clearBoard() {
      if (typeof board[0] === "undefined") {
        createBoard();
        return;
      }

      for (var i = 0; i < 8; ++i) {
        for (var j = 0; j < 8; ++j) {
          board[i][j].piece = null;
        }
      }
    }

    function resetMovableCells() {
      const children = document.querySelectorAll(`#${uid} > .board-cell`);

      for (let element of children) {
        element.classList.remove('movable');
      }
    }

    /**
     * Checks a given direction for available moves
     * @param piece
     * @param direction
     * @returns {object}
     */
    function getPath(piece, direction) {
      var position = piece.getPosition();
      var paths = [];
      var maxJump = 0;
      var path = {
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

            var nextPiece = board[position.row - 1][position.column].piece;

            if (nextPiece == null) {
              path.row = position.row - 1;
              path.column = position.column;
              paths.push(path);
            } else {
              var jumpPath = getJumpPathForMen(piece, "up");

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

            var nextPiece = board[position.row][position.column + 1].piece;

            if (nextPiece == null) {
              path.row = position.row;
              path.column = position.column + 1;
              paths.push(path);
            } else {
              var jumpPath = getJumpPathForMen(piece, "right");

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

            var nextPiece = board[position.row + 1][position.column].piece;

            if (nextPiece == null) {
              path.row = position.row + 1;
              path.column = position.column;
              paths.push(path);
            } else {
              var jumpPath = getJumpPathForMen(piece, "down");

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

            var nextPiece = board[position.row][position.column - 1].piece;

            if (nextPiece == null) {
              path.row = position.row;
              path.column = position.column - 1;
              paths.push(path);
            } else {
              var jumpPath = getJumpPathForMen(piece, "left");

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

      for (var i = 0; i < paths.length; ++i) {
        if (paths[i].jumpCount < maxJump) paths.splice(i, 1);
      }

      return paths;
    }

    /**
     * Get the jump path for the given direction (maximum jumps)
     * @private
     * @param piece
     * @param dir
     * @returns {Array}
     */
    function getJumpPathForMen(piece, dir) {
      var nextPiece;
      var jumpPath = [];
      var position = piece.getPosition();

      switch (dir) {
        case "up":
          nextPiece = board[position.row - 1][position.column].piece;
          if (nextPiece.getColor() == piece.getColor()) break;
          break;

        case "right":
          nextPiece = board[position.row][position.column + 1].piece;
          if (nextPiece.getColor() == piece.getColor()) break;
          break;

        case "down":
          nextPiece = board[position.row + 1][position.column].piece;
          if (nextPiece.getColor() == piece.getColor()) break;
          break;

        case "left":
          nextPiece = board[position.row][position.column - 1].piece;
          if (nextPiece.getColor() == piece.getColor()) break;
          break;
      }

      return jumpPath;
    }

    function pathToWalk(row, column) {
      var piece = board[row][column].piece;
      var directions;

      switch (piece.getColor()) {
        case "white":
          directions = ["up", "left", "right"];
          break;

        case "black":
          directions = ["down", "left", "right"];
          break;
      }

      resetMovableCells();

      for (var i = 0; i < directions.length; ++i) {
        var cp = getPath(piece, directions[i]);

        for (var j = 0; j < cp.length; ++j) {
          makeCellMovable(cp[j].row, cp[j].column);
        }
      }
    }

    function makeCellMovable(row, column) {
      board[row][column].elm.classList.add("movable");
    }

    function getBoard() {
      return JSON.parse(JSON.stringify(board));
    }

    return {
      createBoard: createBoard,
      movePiece: movePiece,
      getPiece: getPiece,
      clearBoard: clearBoard,
      getBoard: getBoard,
      pathToWalk: pathToWalk
    }
  }

  /**
   * An empty cell HTML template
   * @param {number} row
   * @param {number} column
   * @returns {HTMLElement}
   */
  function createCellElement(row, column) {
    const cellId = "cell" + row + "_" + column;
    const color = (row + column) % 2 ? "black" : "white";
    const klass = "turkish-draughts board-cell " + color;
    const cell = document.createElement('div');

    cell.className = klass;
    cell.id = `${uid}_${cellId}`;
    cell.dataset.row = row;
    cell.dataset.column = column;

    return cell;
  }

  /**
   * Piece object.
   * @constructor
   */
  function Piece(row, column, clr) {
    const elm = document.createElement('div');
    var color = clr;
    var currentRow = row;
    var currentColumn = column;
    var king = false;

    elm.className = 'turkish-draughts piece';
    elm.style.top = `${options.cellHeight * row}px`;
    elm.style.left = `${options.cellWidth * column}px`;
    elm.classList.add(color);
    elm.addEventListener("click", handleClick.bind(this), false);

    gameContainer.appendChild(elm);

    function setColor(color) {
      elm.classList.remove('black', 'white');
      elm.classList.add(color);
    }

    function getColor() {
      return color;
    }

    function getPosition() {
      return {
        row: currentRow,
        column: currentColumn
      }
    }

    function setPosition(row, column) {
      boardObject.movePiece(currentRow, currentColumn, row, column);
      currentColumn = column;
      currentRow = row;

      elm.style.top = `${options.cellHeight * currentRow}px`;
      elm.style.left = `${options.cellWidth * currentColumn}px`;
    }

    function promote() {
      king = true;
    }

    function isKing() {
      return king;
    }

    function handleClick(e) {
      boardObject.pathToWalk(currentRow, currentColumn);
    }

    return {
      setColor: setColor,
      getColor: getColor,
      promote: promote,
      isKing: isKing,
      getPosition: getPosition,
      setPosition: setPosition
    }
  }

  function init() {
    uid = GUID();

    createGameContainer();
    boardObject = new Board();
    boardObject.createBoard();
  }

  init();
}