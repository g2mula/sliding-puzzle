function slidingGame(state, action) {
    if (typeof state === 'undefined') {
        return reset(state, action);
    }

    switch (action.type) {
        case 'RESET':
            return reset(state, action);
        case 'SHUFFLE':
            return shuffle(state, action);
        case 'MOVE':
            return move(state, action);
        case 'KEY_MOVE':
            return keyMove(state, action);
        default:
            return state;
    }
}

function reset(state, action) {
    var rows = 4,
        columns = 4,
        row = [],
        result = [],
        counter = 1;

    if (action && action.rows && action.rows > 1) {
        rows = action.rows;
    }

    if (action && action.columns && action.columns > 1) {
        columns = action.columns;
    }

    for (var i = 0; i < rows; i++) {
        row = [];
        result.push(row);
        for (var j = 0; j < columns; j++) {
            row.push(counter++);
        }
    }

    result[rows - 1][columns - 1] = null;
    return result;
}

function shuffle(state, action) {
    var rows = state.length,
        columns = state.length ? state[0].length : 0,
        i,
        j,
        randI,
        randJ,
        temp,
        result = state.map(function (row) {
            return row.slice();
        });

    for (i = 0; i < rows; i++) {
        for (j = 0; j < columns; j++) {
            randI = Math.floor(Math.random() * rows);
            randJ = Math.floor(Math.random() * columns);

            temp = result[i][j];
            result[i][j] = result[randI][randJ];
            result[randI][randJ] = temp;
        }
    }

    if (isSolvable(result)) {
        return result;
    }

    temp = result[0][0];
    result[0][0] = result[0][1];
    result[0][1] = temp;

    return result;
}

function keyMove(state, action) {
    var blankTile = findBlank(state),
        isTop = blankTile.i === 0,
        isLeft = blankTile.j === 0,
        isBottom = blankTile.i === state.length - 1,
        isRight = blankTile.j === (state.length && state[0].length - 1),
        tileToMove;

    if (!blankTile) {
        return state;
    }

    switch (action.key) {
        case 'KeyW':
        case 'ArrowUp':
            if (!isBottom) {
                tileToMove = { i: blankTile.i + 1, j: blankTile.j };
            }
            break;
        case 'KeyA':
        case 'ArrowLeft':
            if (!isRight) {
                tileToMove = { i: blankTile.i, j: blankTile.j + 1 };
            }
            break;
        case 'KeyS':
        case 'ArrowDown':
            if (!isTop) {
                tileToMove = { i: blankTile.i - 1, j: blankTile.j };
            }
            break;
        case 'KeyD':
        case 'ArrowRight':
            if (!isLeft) {
                tileToMove = { i: blankTile.i, j: blankTile.j - 1 };
            }
            break;
        default:
            break;
    }

    if (!tileToMove) {
        return state;
    }

    return move(state, {
        type: 'MOVE',
        i: tileToMove.i,
        j: tileToMove.j
    });
}

function move(state, action) {
    var value = state[action.i][action.j],
        distance,
        result,
        found = false,
        blankTile = findBlank(state);

    if (value === null) {
        return state;
    }

    if (!blankTile) {
        return state;
    }

    distance = Math.abs(action.i - blankTile.i) + Math.abs(action.j - blankTile.j);
    if (distance !== 1) {
        return state;
    }

    result = state.map(function (row) {
        return row.slice();
    });

    result[blankTile.i][blankTile.j] = value;
    result[action.i][action.j] = null;

    return result;
}

function isSolvable(state) {
    var rows = state.length,
        columns = state[0].length,
        array = [].concat.apply([], state),
        length = array.length,
        inversions = 0,
        i = 0,
        j = 0,
        blankIndex,
        blankRow;

    for (i = 0; i < length; i++) {
        if (array[i] === null) {
            blankIndex = i;
            continue;
        }

        for (j = i + 1; j < length; j++) {
            if (array[j] === null) {
                blankIndex = j;
                continue;
            }

            if (array[i] > array[j]) {
                inversions++;
            }
        }
    }

    if (columns % 2) {
        return inversions % 2 === 0;
    }

    blankRow = Math.floor(blankIndex / columns);

    if ((rows - blankRow) % 2) {
        return inversions % 2 === 0;
    }

    return inversions % 2 !== 0;
}

function findBlank(state) {
    var rows = state.length,
        columns = state.length ? state[0].length : 0,
        i = 0,
        j = 0;

    for (i = 0; i < rows; i++) {
        for (j = 0; j < columns; j++) {
            if (state[i][j] === null) {
                return { i: i, j: j };
            }
        }
    }

    return undefined;
}