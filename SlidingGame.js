var SlidingGame = function () {
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

    var SHUFFLE_MAX = 256;

    var emptyTile = { i: 3, j: 3 };

    var tiles = document.getElementById('gameArea').children;

    function resetState() {
        state = defaultState.map(function (row) {
            return row.slice();
        });
    }

    function swap(i, j, x, y) {
        temp = state[x][y];
        state[x][y] = state[i][j];
        state[i][j] = temp;
    }

    function getSorroundingTiles(i, j) {
        var tiles = [];
        if (i !== 3) {
            tiles.push({
                i: i + 1,
                j: j,
                value: state[i + 1][j]
            });
        }

        if (i !== 0) {
            tiles.push({
                i: i - 1,
                j: j,
                value: state[i - 1][j]
            });
        }

        if (j !== 3) {
            tiles.push({
                i: i,
                j: j + 1,
                value: state[i][j + 1]
            });
        }

        if (j !== 0) {
            tiles.push({
                i: i,
                j: j - 1,
                value: state[i][j - 1]
            });
        }

        return tiles;
    }

    function shuffle() {
        var i,
            direction,
            tile,
            sorroundingTiles = [];

        for (i = 0; i < SHUFFLE_MAX; i++) {
            sorroundingTiles = getSorroundingTiles(emptyTile.i, emptyTile.j);
            tile = sorroundingTiles[Math.floor(Math.random() * sorroundingTiles.length)];

            swap(emptyTile.i, emptyTile.j, tile.i, tile.j);
            setEmptyTile(tile.i, tile.j);
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

