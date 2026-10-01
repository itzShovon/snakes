// Game Configuration
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

// Game State
let gameLoop;
let gameRunning = false;
let gamePaused = false;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
highScoreElement.textContent = highScore;

// Canvas Setup - Responsive
function setupCanvas() {
    const container = canvas.parentElement;
    const size = Math.min(container.clientWidth - 40, 600);
    canvas.width = size;
    canvas.height = size;
}

setupCanvas();
window.addEventListener('resize', setupCanvas);

// Game Constants
const GRID_SIZE = 20;
const CELL_SIZE = canvas.width / GRID_SIZE;
const INITIAL_SPEED = 200; // Slower starting speed (higher = slower)
const MIN_SPEED = 60; // Maximum speed limit
let gameSpeed = INITIAL_SPEED;

// Snake
let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };

// Food
let food = { x: 15, y: 15 };

// Touch/Swipe Support
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Initialize Game
function initGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    gameSpeed = INITIAL_SPEED;
    updateScore();
    placeFood();
    gameOverScreen.classList.add('hidden');
}

// Generate Food
function placeFood() {
    do {
        food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

// Draw Functions
function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);
}

function drawSnake() {
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Snake head - brighter color
            ctx.fillStyle = '#4CAF50';
        } else {
            // Snake body - gradient effect
            const opacity = 1 - (index / snake.length) * 0.5;
            ctx.fillStyle = `rgba(76, 175, 80, ${opacity})`;
        }
        ctx.fillRect(
            segment.x * CELL_SIZE + 1,
            segment.y * CELL_SIZE + 1,
            CELL_SIZE - 2,
            CELL_SIZE - 2
        );
        
        // Add eyes to head
        if (index === 0) {
            ctx.fillStyle = '#fff';
            const eyeSize = CELL_SIZE / 6;
            const eyeOffset = CELL_SIZE / 4;
            
            if (direction.x === 1) { // Right
                ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset, segment.y * CELL_SIZE + eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset, segment.y * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
            } else if (direction.x === -1) { // Left
                ctx.fillRect(segment.x * CELL_SIZE + eyeOffset - eyeSize, segment.y * CELL_SIZE + eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * CELL_SIZE + eyeOffset - eyeSize, segment.y * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
            } else if (direction.y === 1) { // Down
                ctx.fillRect(segment.x * CELL_SIZE + eyeOffset, segment.y * CELL_SIZE + CELL_SIZE - eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, segment.y * CELL_SIZE + CELL_SIZE - eyeOffset, eyeSize, eyeSize);
            } else { // Up
                ctx.fillRect(segment.x * CELL_SIZE + eyeOffset, segment.y * CELL_SIZE + eyeOffset - eyeSize, eyeSize, eyeSize);
                ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, segment.y * CELL_SIZE + eyeOffset - eyeSize, eyeSize, eyeSize);
            }
        }
    });
}

function drawFood() {
    // Draw apple-like food
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Add shine effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE / 3,
        food.y * CELL_SIZE + CELL_SIZE / 3,
        CELL_SIZE / 6,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid();
    
    // Draw game objects
    drawFood();
    drawSnake();
}

// Game Logic
function update() {
    if (gamePaused) return;
    
    // Update direction
    direction = nextDirection;
    
    // Calculate new head position
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };
    
    // Check wall collision
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        gameOver();
        return;
    }
    
    // Check self collision
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOver();
        return;
    }
    
    // Add new head
    snake.unshift(newHead);
    
    // Check food collision
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        updateScore();
        placeFood();
        
        // Gradually increase speed as score increases (every 30 points)
        if (gameSpeed > MIN_SPEED && score % 30 === 0) {
            gameSpeed -= 10;
            clearInterval(gameLoop);
            gameLoop = setInterval(gameUpdate, gameSpeed);
        }
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
}

function gameUpdate() {
    update();
    draw();
}

function updateScore() {
    scoreElement.textContent = score;
    
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
    }
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// Controls - Keyboard
function changeDirection(newDirection) {
    // Prevent reversing
    if (newDirection.x === -direction.x && newDirection.y === -direction.y) {
        return;
    }
    nextDirection = newDirection;
}

document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    switch (e.key) {
        case 'ArrowUp':
            e.preventDefault();
            changeDirection({ x: 0, y: -1 });
            break;
        case 'ArrowDown':
            e.preventDefault();
            changeDirection({ x: 0, y: 1 });
            break;
        case 'ArrowLeft':
            e.preventDefault();
            changeDirection({ x: -1, y: 0 });
            break;
        case 'ArrowRight':
            e.preventDefault();
            changeDirection({ x: 1, y: 0 });
            break;
        case ' ':
            e.preventDefault();
            togglePause();
            break;
    }
});

// Controls - Touch Buttons
document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (!gameRunning) return;
        
        const dir = e.target.dataset.direction;
        switch (dir) {
            case 'up':
                changeDirection({ x: 0, y: -1 });
                break;
            case 'down':
                changeDirection({ x: 0, y: 1 });
                break;
            case 'left':
                changeDirection({ x: -1, y: 0 });
                break;
            case 'right':
                changeDirection({ x: 1, y: 0 });
                break;
        }
    });
});

// Controls - Swipe Gestures
canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, false);

canvas.addEventListener('touchend', (e) => {
    if (!gameRunning) return;
    
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, false);

function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    const threshold = 30;
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                changeDirection({ x: 1, y: 0 }); // Right
            } else {
                changeDirection({ x: -1, y: 0 }); // Left
            }
        }
    } else {
        // Vertical swipe
        if (Math.abs(diffY) > threshold) {
            if (diffY > 0) {
                changeDirection({ x: 0, y: 1 }); // Down
            } else {
                changeDirection({ x: 0, y: -1 }); // Up
            }
        }
    }
}

// Game Control Buttons
function startGame() {
    if (gameRunning) return;
    
    initGame();
    gameRunning = true;
    gamePaused = false;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    pauseBtn.textContent = 'Pause';
    
    draw();
    gameLoop = setInterval(gameUpdate, gameSpeed);
}

function togglePause() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
}

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', startGame);

// Initial Draw
draw();
