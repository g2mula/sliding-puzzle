

document.addEventListener('DOMContentLoaded', function () {
    var slidingGame = new SlidingGame();
    slidingGame.initialize();

    var tiles = document.getElementById('gameArea').children;
    for (var i = 0, length = tiles.length; i < length; i++) {
        tiles[i].onclick = function () {
            var tileState = JSON.parse(this.dataset.state);
            slidingGame.moveTile(tileState);
        }
    }

    document.getElementById('resetButton').onclick = function () {
        slidingGame.reset();
    };

    document.getElementById('shuffleButton').onclick = function () {
        slidingGame.shuffle();
    };


});
