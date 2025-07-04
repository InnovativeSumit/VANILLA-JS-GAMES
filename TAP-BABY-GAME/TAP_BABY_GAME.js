
        const gameContainer = document.getElementById('game-container');
        let score = 0;

        function createCircle() {
            const circle = document.createElement('div');
            circle.classList.add('circle');
            circle.style.left = Math.random() * (gameContainer.offsetWidth - 50) + 'px';
            circle.style.top = Math.random() * (gameContainer.offsetHeight - 50) + 'px';

            gameContainer.appendChild(circle);

            circle.addEventListener('click', () => {
                score++;
                updateScore();
                gameContainer.removeChild(circle);
            });

            setTimeout(() => gameContainer.removeChild(circle), 800);
        }

        function updateScore() {
            document.getElementById('score').textContent = 'Score: ' + score;
        }

        document.getElementById('start').addEventListener('click', () => {
            score = 0; // Reset score
            updateScore(); // Update the score display
            setInterval(createCircle, 500);
        });

        updateScore();
    