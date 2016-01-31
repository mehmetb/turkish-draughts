/**
 * Created by Mehmet Baker on 31.01.2016.
 */

function TurkishDraughts(container, options) {
    var uid;
    var gameContainer;
    var virtualBoard = {};

    if (!window.jQuery || !window.$) {
        throw Err("jQuery is not loaded.");
    }

    if (container instanceof window.jQuery == false) {
        throw Err("A jQuery object should be passed as container.");
    }

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

    function cellTemplate(row, column) {
        var cellID = "cell"+row+"_"+column;
        var color = (row+column) % 2 ? "black" : "white";
        var klass = "turkish_draughts board-cell " + color;
        return $('<div class="' + klass + '"' +
                 'id="' + uid + '_' + cellID + '" data-row="' + row + '" ' +
                 'data-column="' + column + '"></div>');
    }

    /**
     * Draws a 8x8 board
     */
    function drawBoard() {
        gameContainer.empty();

        for(var i=0;i<8;++i) {
            for(var j=0;j<8;++j) {
                var cell = cellTemplate(i, j);
                cell.appendTo(gameContainer);
            }
        }
    }

    function init() {
        uid = GUID();

        createGameContainer();
        drawBoard();
    }

    init();
}