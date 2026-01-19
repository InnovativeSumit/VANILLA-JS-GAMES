 const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const highScoreElement = document.getElementById('highScore');
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const restartBtn = document.getElementById('restartBtn');
        const gameOverDiv = document.getElementById('gameOver');
        const finalScoreElement = document.getElementById('finalScore');
        const newRecordElement = document.getElementById('newRecord');

        const gridSize = 20;
        const tileCount = canvas.width / gridSize;

        let snake = [
            {x: 10, y: 10}
        ];
        let food = {};
        let dx = 0;
        let dy = 0;
        let score = 0;
        let highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
        let gameRunning = false;
        let gamePaused = false;
        let gameLoop;

        // Initialize high score display
        highScoreElement.textContent = highScore;

        function generateFood() {
            food = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
            
            // Make sure food doesn't spawn on snake
            for (let segment of snake) {
                if (segment.x === food.x && segment.y === food.y) {
                    generateFood();
                    return;
                }
            }
        }

        function drawGame() {
            // Clear canvas
            ctx.fillStyle = 'rgba(0, 20, 40, 0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw snake
            ctx.fillStyle = '#4ecdc4';
            for (let i = 0; i < snake.length; i++) {
                const segment = snake[i];
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
                
                // Draw snake head differently
                if (i === 0) {
                    ctx.fillStyle = '#45b7b8';
                    ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 6, gridSize - 6);
                    ctx.fillStyle = '#4ecdc4';
                }
            }

            // Draw food
            ctx.fillStyle = '#ff6b6b';
            ctx.beginPath();
            ctx.arc(
                food.x * gridSize + gridSize / 2,
                food.y * gridSize + gridSize / 2,
                gridSize / 2 - 2,
                0,
                2 * Math.PI
            );
            ctx.fill();
        }

        function moveSnake() {
            const head = {x: snake[0].x + dx, y: snake[0].y + dy};

            // Check wall collision
            if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
                gameOver();
                return;
            }

            // Check self collision
            for (let segment of snake) {
                if (head.x === segment.x && head.y === segment.y) {
                    gameOver();
                    return;
                }
            }

            snake.unshift(head);

            // Check food collision
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                scoreElement.textContent = score;
                scoreElement.parentElement.classList.add('pulse');
                setTimeout(() => scoreElement.parentElement.classList.remove('pulse'), 500);
                generateFood();
            } else {
                snake.pop();
            }
        }

        function gameOver() {
            gameRunning = false;
            clearInterval(gameLoop);
            
            finalScoreElement.textContent = score;
            
            // Check for new high score
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
                localStorage.setItem('snakeHighScore', highScore);
                newRecordElement.style.display = 'block';
            } else {
                newRecordElement.style.display = 'none';
            }
            
            gameOverDiv.style.display = 'block';
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        }

        function startGame() {
            if (gameRunning && !gamePaused) return;
            
            if (!gameRunning) {
                // Reset game state
                snake = [{x: 10, y: 10}];
                dx = 1; // Start moving right
                dy = 0;
                score = 0;
                scoreElement.textContent = score;
                generateFood();
                gameOverDiv.style.display = 'none';
            }
            
            gameRunning = true;
            gamePaused = false;
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            
            gameLoop = setInterval(() => {
                moveSnake();
                drawGame();
            }, 150);
        }

        function pauseGame() {
            if (!gameRunning) return;
            
            if (gamePaused) {
                // Resume
                gamePaused = false;
                pauseBtn.textContent = 'Pause';
                gameLoop = setInterval(() => {
                    moveSnake();
                    drawGame();
                }, 150);
            } else {
                // Pause
                gamePaused = true;
                pauseBtn.textContent = 'Resume';
                clearInterval(gameLoop);
            }
        }

        function restartGame() {
            clearInterval(gameLoop);
            gameRunning = false;
            gamePaused = false;
            gameOverDiv.style.display = 'none';
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            pauseBtn.textContent = 'Pause';
            
            // Reset game state
            snake = [{x: 10, y: 10}];
            dx = 1; // Start moving right
            dy = 0;
            score = 0;
            scoreElement.textContent = score;
            generateFood();
            drawGame();
        }

        // Event listeners
        startBtn.addEventListener('click', startGame);
        pauseBtn.addEventListener('click', pauseGame);
        restartBtn.addEventListener('click', restartGame);

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!gameRunning || gamePaused) return;
            
            const keyPressed = e.key;
            const goingUp = dy === -1;
            const goingDown = dy === 1;
            const goingRight = dx === 1;
            const goingLeft = dx === -1;
            
            if ((keyPressed === 'ArrowLeft' || keyPressed === 'a' || keyPressed === 'A') && !goingRight) {
                dx = -1;
                dy = 0;
            }
            if ((keyPressed === 'ArrowUp' || keyPressed === 'w' || keyPressed === 'W') && !goingDown) {
                dx = 0;
                dy = -1;
            }
            if ((keyPressed === 'ArrowRight' || keyPressed === 'd' || keyPressed === 'D') && !goingLeft) {
                dx = 1;
                dy = 0;
            }
            if ((keyPressed === 'ArrowDown' || keyPressed === 's' || keyPressed === 'S') && !goingUp) {
                dx = 0;
                dy = 1;
            }
        });

        // Spacebar to start/pause
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (!gameRunning) {
                    startGame();
                } else {
                    pauseGame();
                }
            }
        });

        // Initialize game
        generateFood();
        drawGame();