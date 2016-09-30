

var Game = function () {
    var defaultState = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, null]
    ];

    var state = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, null]
    ];

    var LEFT = 0,
        RIGHT = 1,
        UP = 2,
        DOWN = 3;

    var emptyTile = { i: 3, j: 3 };

    var tiles = document.getElementById('gameArea').children;

    function resetState() {
        state = defaultState;
    }

    function swap(i, j, x, y) {
        temp = state[x][y];
        state[x][y] = state[i][j];
        state[i][j] = temp;
    }

    function shuffle() {
        var i, j, x, y, temp;

        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                x = Math.floor(Math.random() * 4);
                y = Math.floor(Math.random() * 4);

                swap(i, j, x, y);
            }
        }
    }

    function setEmptyTile(i, j) {
        emptyTile.i = i;
        emptyTile.j = j;
    }

    function updateElement(element, i, j) {
        var value = state[i][j];
        element.textContent = value || '';
        element.dataset.state = JSON.stringify({ i: i, j: j, value: value });

        if (value) {
            element.classList.remove('empty');
        } else {
            element.classList.add('empty');
            setEmptyTile(i, j);
        }
    }

    function syncState() {
        var i, j;
        var index = 0;
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                updateElement(tiles[index], i, j);
                index++;
            }
        }
    }

    function tileMove(tileState, direction) {
        if (!tileState.value) {
            return false;
        }

        var verticalModifier = 0;
        var horizontalModifier = 0;

        switch (direction) {
            case LEFT:
                horizontalModifier = -1;
                break;
            case RIGHT:
                horizontalModifier = 1;
                break;
            case UP:
                verticalModifier = -1;
                break;
            case DOWN:
                verticalModifier = 1;
                break;
            default:
                break;
        }

        if (tileState.i + verticalModifier !== emptyTile.i) {
            return false;
        }

        if (tileState.j + horizontalModifier !== emptyTile.j) {
            return false;
        }

        swap(tileState.i, tileState.j, emptyTile.i, emptyTile.j);
        return true;
    }

    this.initialize = function () {
        shuffle();
        syncState();
    }

    this.shuffle = function () {
        shuffle();
        syncState();
    };

    this.reset = function () {
        resetState();
        syncState();
    };

    this.moveTile = function (tileState) {
        if (!tileState.value) {
            return;
        }

        if (tileMove(tileState, LEFT) || tileMove(tileState, RIGHT) || tileMove(tileState, UP) || tileMove(tileState, DOWN)) {
            syncState();
        }
    }
};

document.addEventListener('DOMContentLoaded', function () {
    var game = new Game();
    game.initialize();

    var tiles = document.getElementById('gameArea').children;
    for (var i = 0, length = tiles.length; i < length; i++) {
        tiles[i].onclick = function () {
            var tileState = JSON.parse(this.dataset.state);
            game.moveTile(tileState);
        }
    }

    document.getElementById('resetButton').onclick = function () {
        game.reset();
    };

    document.getElementById('shuffleButton').onclick = function () {
        game.shuffle();
    };


});
