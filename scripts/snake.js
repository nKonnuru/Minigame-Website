const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
const canvasSize = 400;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
};
let score = 0;
let d;

document.addEventListener('keydown', direction);

function direction(event) {
    let key = event.keyCode;
    if (key === 37 && d !== 'RIGHT') d = 'LEFT';
    else if (key === 38 && d !== 'DOWN') d = 'UP';
    else if (key === 39 && d !== 'LEFT') d = 'RIGHT';
    else if (key === 40 && d !== 'UP') d = 'DOWN';
}

function collision(head, array) {
    return array.some(segment => head.x === segment.x && head.y === segment.y);
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "darkgreen";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Move the snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    if (d === 'LEFT') snakeX -= box;
    if (d === 'UP') snakeY -= box;
    if (d === 'RIGHT') snakeX += box;
    if (d === 'DOWN') snakeY += box;

    // Check collision with food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 19) * box,
            y: Math.floor(Math.random() * 19) * box
        };
    } else {
        snake.pop();
    }

    // Check collision with walls or self
    let newHead = { x: snakeX, y: snakeY };
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvasSize || snakeY >= canvasSize || collision(newHead, snake)) {
        clearInterval(game);
        alert('Game over! Your score was: ' + score);
    } else {
        snake.unshift(newHead);
    }

    // Update score
    document.getElementById('score').textContent = 'Score: ' + score;
}

let game = setInterval(draw, 100);
