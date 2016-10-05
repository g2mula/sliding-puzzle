document.addEventListener('DOMContentLoaded', function () {
    var gameArea = document.getElementById('gameArea');
    var rowsInput = document.getElementById('rowsInput');
    var columnsInput = document.getElementById('columnsInput');
    var rowsSpan = document.getElementById('rowsSpan');
    var columnsSpan = document.getElementById('columnsSpan');

    var tileSize = 50;

    var store = Redux.createStore(slidingGame);

    function moveTile() {
        var tileState = JSON.parse(this.dataset.state);
        store.dispatch({
            type: 'MOVE',
            i: tileState.i,
            j: tileState.j
        });
    }

    function render() {
        var state = store.getState(),
            rows = state.length,
            columns = state[0].length,
            i = 0,
            j = 0,
            tile,
            value
            ;

        gameArea.innerHTML = '';
        gameArea.style.width = tileSize * columns + 'px';
        gameArea.style.height = tileSize * rows + 'px';

        for (i = 0; i < rows; i++) {
            for (j = 0; j < columns; j++) {
                value = state[i][j];
                tile = document.createElement('div');
                tile.classList.add('tile');
                if (value === null) {
                    tile.classList.add('empty');
                } else {
                    tile.textContent = value;
                }

                gameArea.appendChild(tile);
                tile.dataset.state = JSON.stringify({ i: i, j: j, value: value });
                tile.onclick = moveTile;
            }
        }
    }

    render();

    store.subscribe(render);

    document.getElementById('resetButton').onclick = function () {
        store.dispatch({
            type: 'RESET',
            rows: +rowsInput.value,
            columns: +columnsInput.value
        });
    };

    document.getElementById('shuffleButton').onclick = function () {
        store.dispatch({
            type: 'SHUFFLE'
        });
    };

    rowsInput.oninput = function () {
        rowsSpan.textContent = this.value;
    };

    columnsInput.oninput = function () {
        columnsSpan.textContent = this.value;
    };

});
