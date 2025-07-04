const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown'];
    let cards = colors.concat(colors); // Duplicate colors to create pairs
    let flippedCards = [];
    let matchedCards = [];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createGameBoard() {
        const shuffledCards = shuffle(cards);
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
        shuffledCards.forEach(color => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.style.backgroundColor = 'gray';
            card.onclick = () => flipCard(card, color);
            gameBoard.appendChild(card);
        });
    }

    function flipCard(card, color) {
        if (flippedCards.length < 2 && !flippedCards.includes(card)) {
            card.style.backgroundColor = color;
            flippedCards.push(card);
            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 1000);
            }
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        if (card1.style.backgroundColor === card2.style.backgroundColor) {
            matchedCards.push(card1, card2);
            if (matchedCards.length === cards.length) {
                alert('CONGRATULATIONS! YOU WIN');
            }
        } else {
            card1.style.backgroundColor = card2.style.backgroundColor = 'gray';
        }
        flippedCards = [];
    }

    function resetGame() {
        flippedCards = [];
        matchedCards = [];
        createGameBoard();
    }

    createGameBoard();