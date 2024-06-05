let dragon, game, scoreDisplay, initialScreen, deathScreen, finalScore, recordDisplay, initialScreenRecord;
let backgroundMusic, jumpMusic, endMusic;
let dragonY, gameInterval, pipeInterval, score, backgroundPositionX, gameOver, gameStarted, record;
const gravity = 0.6;
const lift = -8;
let velocity = 0;

document.addEventListener('DOMContentLoaded', () => {
    dragon = document.getElementById('dragon');
    game = document.getElementById('game');
    scoreDisplay = document.getElementById('score');
    initialScreen = document.getElementById('initial-screen');
    deathScreen = document.getElementById('death-screen');
    finalScore = document.getElementById('final-score');
    recordDisplay = document.getElementById('record');
    initialScreenRecord = document.getElementById('initial-record');

    backgroundMusic = document.getElementById('background-music');
    jumpMusic = document.getElementById('jump-music');
    endMusic = document.getElementById('end-music');

    backgroundMusic.volume = 0.5;

    dragonY = window.innerHeight / 2;
    gameInterval;
    pipeInterval;
    score = 0;
    backgroundPositionX = 0;
    gameOver = false;
    gameStarted = false;

    record = localStorage.getItem('record') || 0;
    recordDisplay.textContent = "Record: " + record;
    initialScreenRecord.textContent = "Record: " + record;

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            if (!gameStarted) {
                initialScreen.style.display = 'none';
                gameStarted = true;
                startGame();
            } else if (deathScreen.style.display === 'flex') {
                window.location.reload();
            } else {
                fly();
            }
        }
    });
});

function startGame() {
    gameInterval = setInterval(gameLoop, 20);
    pipeInterval = setInterval(createPipe, 2500);
    backgroundMusic.play();
}

function gameLoop() {
    if (gameOver) return;

    velocity += gravity;
    dragonY += velocity;
    dragon.style.top = dragonY + 'px';

    if (dragonY > window.innerHeight || dragonY < 0) endGame();

    let hitboxBuffer = 10;
    let pipes = document.querySelectorAll('.pipe');
    pipes.forEach(pipe => {
        let pipeRect = pipe.getBoundingClientRect();
        let dragonRect = dragon.getBoundingClientRect();
        let buffer = 5;
        if (
            dragonRect.right - buffer - hitboxBuffer > pipeRect.left &&
            dragonRect.left + buffer + hitboxBuffer < pipeRect.right &&
            ((dragonRect.bottom - buffer - hitboxBuffer > pipeRect.top && pipe.classList.contains('bottom')) ||
            (dragonRect.top + buffer + hitboxBuffer < pipeRect.bottom && pipe.classList.contains('top')))
        ) {
            endGame();
        }

        if (!pipe.passed && dragonRect.right - buffer > pipeRect.right) {
            pipe.passed = true;
            if (pipe.classList.contains('top')) {
                score++;
                scoreDisplay.textContent = score;
                scoreDisplay.classList.remove('deflate');
                scoreDisplay.classList.add('deflate');
            }
        }

        if (pipeRect.right < 0) {
            pipe.remove();
        }
    });

    scoreDisplay.onanimationend = () => {
        scoreDisplay.classList.remove('deflate');
    };

    backgroundPositionX -= 2;
    game.style.backgroundPositionX = backgroundPositionX + 'px';
}

function createPipe() {
    let pipeHeight = Math.floor(Math.random() * (window.innerHeight / 2)) + 50;
    const gap = 200;

    let topPipe = document.createElement('div');
    topPipe.classList.add('pipe', 'top');
    topPipe.style.height = pipeHeight + 'px';
    topPipe.style.left = '100%';
    topPipe.passed = false;
    game.appendChild(topPipe);

    let bottomPipe = document.createElement('div');
    bottomPipe.classList.add('pipe', 'bottom');
    bottomPipe.style.height = (window.innerHeight - pipeHeight - gap) + 'px';
    bottomPipe.style.left = '100%';
    bottomPipe.passed = false;
    game.appendChild(bottomPipe);

    setTimeout(() => {
        if (!gameOver) {
            topPipe.remove();
            bottomPipe.remove();
        }
    }, 4000);
}

function fly() {
    if (gameOver) return;
    velocity = lift;
    jumpMusic.play();
}

function endGame() {
    gameOver = true;
    clearInterval(gameInterval);
    clearInterval(pipeInterval);
    if (score > record) {
        record = score;
        localStorage.setItem('record', record);
        recordDisplay.textContent = "Record: " + record;
        initialScreenRecord.textContent = "Record: " + record;
    }
    finalScore.textContent = score;
    deathScreen.style.display = 'flex';
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    endMusic.play();
    let pipes = document.querySelectorAll('.pipe');
    pipes.forEach(pipe => {
        pipe.classList.add('paused');
    });
}