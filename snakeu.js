let snake = [];
let food = null;
let direction = 'ArrowRight';
let gameInterval = null;
let score = 0;
const gridSize = 20;
const gameSpeed = 150;

function createGameBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        gameBoard.appendChild(cell);
    }
}

function startGame() {
    snake = [{ x: 10, y: 10 }];
    direction = 'ArrowRight';
    score = 0;
    document.getElementById('score').textContent = score;
    
    if (gameInterval) clearInterval(gameInterval);
    
    createGameBoard();
    generateFood();
    
    gameInterval = setInterval(gameLoop, gameSpeed);
}

function gameLoop() {
    const head = { ...snake[0] };
    
    switch (direction) {
        case 'ArrowUp': head.y--; break;
        case 'ArrowDown': head.y++; break;
        case 'ArrowLeft': head.x--; break;
        case 'ArrowRight': head.x++; break;
    }
    
    if (isCollision(head)) {
        gameOver();
        return;
    }
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
    
    updateGameBoard();
}

function isCollision(position) {
    if (position.x < 0 || position.x >= gridSize || 
        position.y < 0 || position.y >= gridSize) {
        return true;
    }
    
    return snake.some(segment => 
        segment.x === position.x && segment.y === position.y
    );
}

function generateFood() {
    while (true) {
        food = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
        
        const foodOnSnake = snake.some(segment => 
            segment.x === food.x && segment.y === food.y
        );
        
        if (!foodOnSnake) break;
    }
}

function updateGameBoard() {
    const cells = document.getElementById('gameBoard').children;
    
    for (let cell of cells) {
        cell.className = '';
    }
    
    snake.forEach(segment => {
        const index = segment.y * gridSize + segment.x;
        cells[index].classList.add('snake');
    });
    
    const foodIndex = food.y * gridSize + food.x;
    cells[foodIndex].classList.add('food');
}

function gameOver() {
    clearInterval(gameInterval);
    document.getElementById('gameOverMessage').textContent = `Game Over! Score: ${score}`;
}

function changeDirection(newDirection) {
    const opposites = {
        'ArrowUp': 'ArrowDown',
        'ArrowDown': 'ArrowUp',
        'ArrowLeft': 'ArrowRight',
        'ArrowRight': 'ArrowLeft'
    };
    
    if (opposites[newDirection] !== direction) {
        direction = newDirection;
    }
}

document.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        changeDirection(event.key);
    }
});

createGameBoard();