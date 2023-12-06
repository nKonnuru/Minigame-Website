const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
const canvasSize = 400;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = generateFood();
let specialFood = {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box,
    active: false
};
let score = 0;
let d;
let gameSpeed = 10;
let gamePaused = false;

document.addEventListener('keydown', direction);
document.getElementById('pause-button').addEventListener('click', togglePause);

function gameLoop(currentTime) {
    if (gamePaused) return;
    window.requestAnimationFrame(gameLoop);
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / gameSpeed) return;
    lastRenderTime = currentTime;

    update();
    draw();
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box
    };
}

function update() {
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === 'LEFT') snakeX -= box;
    if (d === 'UP') snakeY -= box;
    if (d === 'RIGHT') snakeX += box;
    if (d === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = generateFood();
        updateHighScore();
        adjustGameSpeed();
    } else if (specialFood.active && snakeX === specialFood.x && snakeY === specialFood.y) {
        score += 5;
        specialFood.active = false;
        food = generateFood();
    } else {
        snake.pop();
    }

    if (Math.random() < 0.05 && !specialFood.active) {
        specialFood = {
            x: Math.floor(Math.random() * (canvasSize / box)) * box,
            y: Math.floor(Math.random() * (canvasSize / box)) * box,
            active: true
        };
    }

    let newHead = { x: snakeX, y: snakeY };
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvasSize || snakeY >= canvasSize || collision(newHead, snake)) {
        return alert('Game over! Your score was: ' + score);
    }
    snake.unshift(newHead);
    document.getElementById('score').textContent = 'Score: ' + score;
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "darkgreen";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    if (specialFood.active) {
        ctx.fillStyle = 'blue';  // Special food is blue
        ctx.fillRect(specialFood.x, specialFood.y, box, box);
    }
}

function direction(event) {
    const key = event.keyCode;
    const dirMap = { 37: 'LEFT', 38: 'UP', 39: 'RIGHT', 40: 'DOWN' };
    if (dirMap[key] && dirMap[key] !== oppositeDirection(d)) {
        d = dirMap[key];
    }
}

function oppositeDirection(direction) {
    const opposites = { 'LEFT': 'RIGHT', 'RIGHT': 'LEFT', 'UP': 'DOWN', 'DOWN': 'UP' };
    return opposites[direction];
}

function togglePause() {
    gamePaused = !gamePaused;
    document.getElementById('pause-button').textContent = gamePaused ? 'Resume' : 'Pause';
    if (!gamePaused) window.requestAnimationFrame(gameLoop);
}

function collision(head, array) {
    return array.some(segment => head.x === segment.x && head.y === segment.y);
}

function updateHighScore() {
    const highScore = localStorage.getItem('highScore') || 0;
    if (score > highScore) {
        localStorage.setItem('highScore', score);
    }
    document.getElementById('high-score').textContent = 'High Score: ' + localStorage.getItem('highScore');
}

function adjustGameSpeed() {
    if (score % 10 === 0) {
        gameSpeed = Math.max(15, gameSpeed + 1);
    }
}

let lastRenderTime = 0;
updateHighScore();
window.requestAnimationFrame(gameLoop);
