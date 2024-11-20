// Select the canvas element and set up 2D rendering context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game configuration
const config = {
    screenWidth: 1200, // Grid width
    screenHeight: 800, // Grid height
    unitSize: 25, // Size of each grid cell
    snakeColor: '#00ff00', // Color of the snake
    appleColor: '#ff9900', // Color of the apple
    obstacleColor: 'gray', // Color of obstacles
    gridColor: '#444', // Grid line color
    delay: 200, // Initial game speed (milliseconds per frame)
    minSpeed: 25, // Minimum speed (max game difficulty)
    maxSpeed: 500 // Maximum speed (easy game)
};

// Canvas setup
canvas.width = config.screenWidth;
canvas.height = config.screenHeight;

// Game variables
let snake = [{ x: 4 * config.unitSize, y: 4 * config.unitSize }];
let direction = { x: 1, y: 0 }; // Initial movement direction
let apple = { x: 0, y: 0 }; // Position of the apple
let obstacles = []; // Array to hold obstacles
let running = false; // Game running state
let paused = false; // Pause state
let speed = config.delay;// Current speed
let score = 0; // Player's score
let lives = 3;
let gameInterval; // Variable to store the interval


// Place the first apple randomly
function placeApple() {
    apple.x = Math.floor(Math.random() * (config.screenWidth / config.unitSize)) * config.unitSize;
    apple.y = Math.floor(Math.random() * (config.screenHeight / config.unitSize)) * config.unitSize;
}

// Place obstacles randomly on the grid (max 10 obstacles)
function placeObstacle() {
    if (obstacles.length == 5) obstacles.splice(0, 1);
    if (obstacles.length < 5) {
        const obstacle = {
            x: Math.floor(Math.random() * (config.screenWidth / config.unitSize)) * config.unitSize,
            y: Math.floor(Math.random() * (config.screenHeight / config.unitSize)) * config.unitSize
        };
        obstacles.push(obstacle);
    }
}

function resetSnakePosition() {
    // Keep the snake's current length
    const snakeLength = snake.length;

    // Reset the snake's position but maintain its size
    snake = [];
    for (let i = 0; i < snakeLength; i++) {
        snake.push({
            x: 4 * config.unitSize - i * config.unitSize, // Place segments horizontally
            y: 4 * config.unitSize
        });
    }

    // Reset the direction to moving right
    direction = { x: 1, y: 0 };
}

function checkCollisions() {
    const head = snake[0];

    // Check self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            lives--; // Reduce lives
            resetSnakePosition(); // Reset the snake position
            return lives <= 0; // End game if lives are 0
        }
    }

    // Check obstacle collision
    for (let obstacle of obstacles) {
        if (head.x === obstacle.x && head.y === obstacle.y) {
            lives--; // Reduce lives
            resetSnakePosition(); // Reset the snake position
            return lives <= 0; // End game if lives are 0
        }
    }

    return false; // No collision
}

// Reset the game to its initial state
function resetGame() {
    snake = [{ x: 4 * config.unitSize, y: 4 * config.unitSize }];
    direction = { x: 1, y: 0 };
    obstacles = [];
    running = true;
    paused = false;
    speed = config.delay;
    score = 0;
    lives = 3;
    placeApple();
}

// Function to show the welcome screen with game instructions
function showWelcomeScreen() {
    ctx.fillStyle = '#100040';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f8fff';
    ctx.font = '30px Arial';
    ctx.fillText(`Welcome to Snake Game!`, canvas.width / 2 - 180, canvas.height / 2 - 100);
    ctx.font = '20px Arial';
    ctx.fillText('Controls:', canvas.width / 2 - 130, canvas.height / 2 - 50);
    ctx.font = '15px Arial';
    ctx.fillStyle = '#ff00ff';
    ctx.fillText('Arrow Keys   - Move Snake', canvas.width / 2 - 90, canvas.height / 2 - 20);
    ctx.fillText('Space           - Pause/Resume', canvas.width / 2 - 90, canvas.height / 2 + 10);
    ctx.fillText('R                   - Restart Game', canvas.width / 2 - 90, canvas.height / 2 + 40);
    ctx.fillText('F                   - Increase Speed', canvas.width / 2 - 90, canvas.height / 2 + 70);
    ctx.fillText('S                   - Decrease Speed', canvas.width / 2 - 90, canvas.height / 2 + 100);
    ctx.fillStyle = '#90a0cc';
    ctx.font = '20px Arial';
    ctx.fillText('Hit yourself or an obstacle to lose!', canvas.width / 2 - 130, canvas.height / 2 + 150);
    ctx.fillStyle = 'red';
    ctx.fillText('You have 3 lives ...', canvas.width / 2 - 90, canvas.height / 2 + 180);
    ctx.fillStyle = 'yellow';
    ctx.fillText('Press R to start the game.', canvas.width / 2 - 130, canvas.height / 2 + 230);
}

// Update the game state
function update() {
    if (!running || paused) return; // Skip if the game is not running or paused

    // Move the snake
    const head = {
        x: snake[0].x + direction.x * config.unitSize,
        y: snake[0].y + direction.y * config.unitSize
    };

    // Wrap around edges
    if (head.x < 0) head.x = config.screenWidth - config.unitSize;
    if (head.x >= config.screenWidth) head.x = 0;
    if (head.y < 0) head.y = config.screenHeight - config.unitSize;
    if (head.y >= config.screenHeight) head.y = 0;

    snake.unshift(head); // Add the new head to the snake

    // Check if the snake eats the apple
    if (head.x === apple.x && head.y === apple.y) {
        score += 10;
        placeApple(); // Place a new apple
    } else {
        snake.pop(); // Remove the tail if no apple is eaten
    }

    // Check for collisions
    if (checkCollisions()) {
        running = false; // End the game
    }

    // Place obstacles periodically
    if (Math.random() < 0.01) {
        placeObstacle();
    }
}
// Function to clear the canvas before each frame
function clearCanvas() {
    ctx.fillStyle = 'black'; // Set the background color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas with black
}

// Function to draw the grid
function drawGrid() {
    ctx.strokeStyle = config.gridColor; // Set the grid line color
    for (let x = 0; x <= config.screenWidth; x += config.unitSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, config.screenHeight);
        ctx.stroke();
    }
    for (let y = 0; y <= config.screenHeight; y += config.unitSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(config.screenWidth, y);
        ctx.stroke();
    }
}

// Function to draw the snake
function drawSnake() {
    // Loop through each segment of the snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Draw the snake's head
            ctx.fillStyle = 'yellow'; // White head
            ctx.beginPath();
            ctx.arc(
                segment.x + config.unitSize / 2, // Center X
                segment.y + config.unitSize / 2, // Center Y
                config.unitSize / 2, // Radius
                0,
                Math.PI * 2
            );
            ctx.fill();

            // Draw eyes on the head
            ctx.fillStyle = 'black';
            const eyeOffset = config.unitSize / 4;
            ctx.beginPath();
            ctx.arc(
                segment.x + config.unitSize / 2 - eyeOffset, // Left eye
                segment.y + config.unitSize / 2 - eyeOffset,
                2, // Eye size
                0,
                Math.PI * 2
            );
            ctx.fill();

            ctx.beginPath();
            ctx.arc(
                segment.x + config.unitSize / 2 + eyeOffset, // Right eye
                segment.y + config.unitSize / 2 - eyeOffset,
                2,
                0,
                Math.PI * 2
            );
            ctx.fill();
        } else {
            // Draw the snake's body
            ctx.fillStyle = config.snakeColor; // Same color for body
            ctx.fillRect(segment.x, segment.y, config.unitSize, config.unitSize);
        }
    });
}

// Function to draw the apple
function drawApple() {
    ctx.fillStyle = config.appleColor; // Set the color to red
    ctx.beginPath();
    ctx.arc(
        apple.x + config.unitSize / 2, // Center X
        apple.y + config.unitSize / 2, // Center Y
        config.unitSize / 2, // Radius
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Function to draw obstacles
// function drawObstacles() {
//     ctx.fillStyle = config.obstacleColor; // Set the color to gray
//     obstacles.forEach(obstacle => {
//         ctx.fillRect(obstacle.x, obstacle.y, config.unitSize, config.unitSize);
//     });
// }

// Function to draw spiky obstacles
function drawObstacles() {
    ctx.fillStyle = config.obstacleColor; // Set color for obstacles
    obstacles.forEach(obstacle => {
        const centerX = obstacle.x + config.unitSize / 2;
        const centerY = obstacle.y + config.unitSize / 2;
        const radius = config.unitSize / 2;

        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
            const angle = (Math.PI / 5) * i;
            const x = centerX + (i % 2 === 0 ? radius : radius / 2) * Math.cos(angle);
            const y = centerY + (i % 2 === 0 ? radius : radius / 2) * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    });
}

// Function to draw the score
function drawScore() {
    ctx.fillStyle = 'white'; // Set the text color to white
    ctx.font = '20px Arial'; // Set the font style and size
    ctx.fillText(`Score: ${score}`, 10, 20); // Display the score
    ctx.fillText(`Speed Level: ${Math.ceil((500 - speed) / 25) + 1}`, 10, 50);
    ctx.fillText(`Lives: ${lives}`, 10, 80); // Display lives count

}


// Render the game state
function render() {
    clearCanvas(); // Clear the canvas at the start of each frame
    drawGrid(); // Draw the grid
    drawSnake(); // Draw the snake
    drawApple(); // Draw the apple
    drawObstacles(); // Draw obstacles
    drawScore(); // Draw the score

    if (!running) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 75, canvas.height / 2);
    }

    if (paused) {
        ctx.fillStyle = 'yellow';
        ctx.font = '30px Arial';
        ctx.fillText('Paused', canvas.width / 2 - 50, canvas.height / 2);
    }
}

// Event listener for keyboard controls
document.addEventListener('keydown', e => {
    // console.log(e.key); // Log the detected key code    
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
        case ' ': // Pause/Resume the game
            paused = !paused;
            break;
        case 'r': // Restart the game
            resetGame();
            startGameLoop();
            break;
            case 'f': // Increase speed
            if (speed > config.minSpeed) {
                speed -= 25;
                //console.log(`Speed increased: ${speed}ms per frame`);
                startGameLoop(); // Restart the game loop with the new speed
            }
            break;
        case 's': // Decrease speed
            if (speed < config.maxSpeed) {
                speed += 25;
                //console.log(`Speed decreased: ${speed}ms per frame`);
                startGameLoop(); // Restart the game loop with the new speed
            }
            break;
    }
});

// // Game loop
// function gameLoop() {
//     if (running) {
//         update();
//         render();
//     }
// }



function startGameLoop() {
    clearInterval(gameInterval); // Clear the previous interval
    gameInterval = setInterval(() => {
        if (running) {
            update();
            render();
        }
    }, speed);
}

// Start the game
showWelcomeScreen(); // Show welcome screen
startGameLoop();

// // Use a dynamic interval for the game loop
// setInterval(gameLoop, speed);