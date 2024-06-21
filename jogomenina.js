document.addEventListener('DOMContentLoaded', function () {
    const character = document.getElementById('character');
    const gameContainer = document.getElementById('game-container');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');

    const gameDuration = 30000; // 30 segundos
    let score = 0;
    let isGameOver = false;
    let timeRemaining = gameDuration / 1000;

    function updateScore(points) {
        if (isGameOver) return;
        
        score += points;
        scoreElement.innerText = 'Pontos: ' + score;
    }

    function createFallingElement() {
        if (isGameOver) return;

        const element = document.createElement('div');
        element.classList.add('element');
        
        const isPositive = Math.random() < 0.5;
        if (isPositive) {
            element.classList.add('positive');
        } else {
            element.classList.add('negative');
        }

        const position = Math.floor(Math.random() * (gameContainer.clientWidth - 20));
        element.style.left = position + 'px';

        gameContainer.appendChild(element);

        let currentPosition = 0;
        const fallInterval = setInterval(() => {
            if (isGameOver) {
                clearInterval(fallInterval);
                return;
            }

            currentPosition += 5;
            element.style.top = currentPosition + 'px';

            const characterRect = character.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            if (
                elementRect.bottom >= characterRect.top &&
                elementRect.right >= characterRect.left &&
                elementRect.left <= characterRect.right
            ) {
                if (element.classList.contains('positive')) {
                    updateScore(2.5);
                } else {
                    updateScore(-2.5);
                }
                gameContainer.removeChild(element);
                clearInterval(fallInterval);
            }

            if (currentPosition >= gameContainer.clientHeight) {
                gameContainer.removeChild(element);
                clearInterval(fallInterval);
            }
        }, 14);
    }

    document.addEventListener('keydown', function (event) {
        if (isGameOver) return;

        const characterPosition = parseInt(window.getComputedStyle(character).getPropertyValue('left'));
        const containerWidth = parseInt(window.getComputedStyle(gameContainer).getPropertyValue('width'));

        if (event.key === 'ArrowLeft') {
            if (characterPosition > 0) {
                character.style.left = (characterPosition - 10) + 'px';
            }
        } else if (event.key === 'ArrowRight') {
            if (characterPosition < containerWidth - character.clientWidth) {
                character.style.left = (characterPosition + 10) + 'px';
            }
        }
    });

    function showMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.innerText = message;
        messageElement.style.position = 'absolute';
        messageElement.style.top = '50%';
        messageElement.style.left = '50%';
        messageElement.style.transform = 'translate(-50%, -50%)';
        messageElement.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        messageElement.style.padding = '20px';
        messageElement.style.borderRadius = '5px';
        
        document.body.appendChild(messageElement);
    
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 3000);
    }

    function endGame() {
        isGameOver = true;
        clearInterval(gameInterval);
        clearInterval(timerInterval);

        let message = 'Sua pontuação final é: ' + score + '. ';
        if (score < 10) {
            message += 'Você pode melhorar!';
        } else if (score >= 10 && score < 15) {
            meninadez
            message += 'Bom trabalho!';
    
        } else if (score >= 15 && score < 45) {
            message += 'Ótimo trabalho!';
        } else {
            message += 'Excelente! Você é um mestre!';
        }

        showMessage(message);
    }

    const timerInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(timerInterval);
            return;
        }

        timerElement.innerText = 'Tempo: ' + timeRemaining + 's';
        timeRemaining--;

        if (timeRemaining < 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);

    const gameInterval = setInterval(createFallingElement, 2000);

    setTimeout(() => {
        clearInterval(timerInterval);
        clearInterval(gameInterval);
        endGame();
    }, gameDuration);
});
