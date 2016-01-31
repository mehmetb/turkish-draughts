/**
 * Created by Mehmet Baker on 31.01.2016.
 */

function TurkishDraughts(container, options) {
    var uid;
    var gameContainer;
    var boardObject;
    var defaults = {
        cellWidth:50,
        cellHeight:50
    };

    if (!window.jQuery || !window.$) {
        throw Err("jQuery is not loaded.");
    }

    if (container instanceof window.jQuery == false) {
        throw Err("A jQuery object should be passed as container.");
    }

    $.extend(defaults, options);

    /** Custom Error Function
     * @return {string}
     */
    function Err(message) {
        if (typeof message !== "string") return "";
        return "TurkishDraughts: " + message;
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
        gameContainer = $('<div class="turkish_draughts game-container" id="' + uid + '"></div>');
        container.append(gameContainer);
    }

    /**
     * Virtual Board for easier calculations
     * @constructor
     */
    function Board() {
        var board = {};

        function createBoard() {
            gameContainer.empty();

            for(var k=0;k<8;++k) {
                for(var l=0;l<8;++l) {
                    var cell = cellTemplate(k, l);
                    cell.appendTo(gameContainer);
                }
            }

            for(var i=0;i<8;++i) {
                board[i] = {};

                for(var j=0;j<8;++j) {
                    var piece = null;

                    if([1,2].indexOf(i)>-1) {
                        piece = new Piece(i, j, "black");
                    }else if([5,6].indexOf(i)>-1) {
                        piece = new Piece(i, j, "white");
                    }

                    board[i][j] = {
                        piece:piece
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
            if(typeof board[0] === "undefined") {
                createBoard();
                return;
            }

            for(var i=0;i<8;++i) {
                for(var j=0;j<8;++j) {
                    board[i][j].piece = null;
                }
            }
        }

        function getBoard() {
            return JSON.parse(JSON.stringify(board));
        }

        return {
            createBoard:createBoard,
            movePiece:movePiece,
            getPiece:getPiece,
            clearBoard:clearBoard,
            getBoard:getBoard
        }
    }

    /**
     * An empty cell HTML template
     * @param {number} row
     * @param {number} column
     * @returns {*|jQuery|HTMLElement}
     */
    function cellTemplate(row, column) {
        var cellID = "cell"+row+"_"+column;
        var color = (row+column) % 2 ? "black" : "white";
        var klass = "turkish_draughts board-cell " + color;

        return $('<div class="' + klass + '"' +
                 'id="' + uid + '_' + cellID + '" data-row="' + row + '" ' +
                 'data-column="' + column + '"></div>');
    }

    /**
     * Piece object.
     * @constructor
     */
    function Piece(row, column, clr) {
        var elm = $('<div class="turkish_draughts piece"></div>');
        var color = clr;
        var currentRow = row;
        var currentColumn = column;
        var queen = false;

        elm.css("top", defaults.cellHeight * row +  "px");
        elm.css("left", defaults.cellWidth * column + "px");
        elm.addClass(color);
        elm.bind("click", handleClick);

        gameContainer.append(elm);

        function setColor(c) {
            color = c;
            elm
                .removeClass("black white")
                .addClass(color);
        }

        function getColor() {
            return color;
        }

        function getPosition() {
            return {
                row:currentRow,
                column:currentColumn
            }
        }

        function setPosition(row, column) {
            boardObject.movePiece(currentRow, currentColumn, row, column);
            currentColumn = column;
            currentRow = row;

            elm.css("top", defaults.cellHeight * currentRow +  "px");
            elm.css("left", defaults.cellWidth * currentColumn + "px");
        }

        function setQueen() {
            queen = true;
        }

        function isQueen() {
            return queen;
        }

        function handleClick(e) {

        }

        return {
            setColor:setColor,
            getColor:getColor,
            setQueen:setQueen,
            isQueen:isQueen,
            getPosition:getPosition,
            setPosition:setPosition
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