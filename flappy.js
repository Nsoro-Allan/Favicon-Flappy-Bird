const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const favicon = document.getElementById('favicon');
const scoreDisplay = document.getElementById('score');
const highestScoreDisplay = document.getElementById('highestScore');

let bird = { x: 4, y: 8, width: 2, height: 2, velocity: 0, gravity: 0.15 };
let pipe = { x: 16, y: Math.floor(Math.random() * 8), width: 2, height: 4, gap: 6 };
let score = 0;
let highestScore = localStorage.getItem('highestScore') || 0;
let gameInterval;

function drawBackground() {
    ctx.fillStyle = '#87CEEB'; // Sky blue background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipe() {
    ctx.fillStyle = 'green';
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.y);
    ctx.fillRect(pipe.x, pipe.y + pipe.gap, pipe.width, 16 - pipe.y - pipe.gap);
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y > 16 - bird.height) {
        bird.y = 16 - bird.height;
        bird.velocity = 0;
    } else if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
}

function updatePipe() {
    pipe.x -= 1;
    if (pipe.x < -pipe.width) {
        pipe.x = 16;
        pipe.y = Math.floor(Math.random() * 8);
        score++;
        scoreDisplay.textContent = score;
        document.title = `Score: ${score}`;

        if (score > highestScore) {
            highestScore = score;
            highestScoreDisplay.textContent = highestScore;
            localStorage.setItem('highestScore', highestScore);
        }
    }
}

function checkCollision() {
    if (bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipe.gap)) {
        clearInterval(gameInterval);
        alert(`Game Over! Your score is ${score}`);
        score = 0;
        scoreDisplay.textContent = score;
        document.title = 'Flappy Bird';
        bird.y = 8;
        pipe.x = 16;
        gameInterval = setInterval(gameLoop, 100);
    }
}

function updateFavicon() {
    const faviconData = canvas.toDataURL();
    favicon.href = faviconData;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawBird();
    drawPipe();
    updateBird();
    updatePipe();
    checkCollision();
    updateFavicon();
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        bird.velocity = -1.5;
    }
});

highestScoreDisplay.textContent = highestScore;
gameInterval = setInterval(gameLoop, 100);
