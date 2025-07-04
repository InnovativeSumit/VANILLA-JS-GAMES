document.addEventListener('DOMContentLoaded', function() {
    const coin = document.getElementById('coin');
    const flipButton = document.getElementById('flip-button');
    const result = document.getElementById('result');
    const predictionResult = document.getElementById('prediction-result');
    const headsCount = document.getElementById('heads-count');
    const tailsCount = document.getElementById('tails-count');
    const correctCount = document.getElementById('correct-count');
    const successRate = document.getElementById('success-rate');
    const stats = document.getElementById('stats');
    const predictionStats = document.getElementById('prediction-stats');
    const lastFlips = document.getElementById('last-flips');
    const flipHistory = document.getElementById('flip-history');
    const predictHeadsBtn = document.getElementById('predict-heads');
    const predictTailsBtn = document.getElementById('predict-tails');
    const predictionText = document.getElementById('prediction-text');
    
    let heads = 0;
    let tails = 0;
    let correctPredictions = 0;
    let totalPredictions = 0;
    let isFlipping = false;
    let flipResults = [];
    let currentPrediction = null;
    
    // Initialize the flip button as disabled
    flipButton.disabled = true;
    
    // Set up prediction buttons
    predictHeadsBtn.addEventListener('click', () => {
        resetPredictionButtons();
        predictHeadsBtn.classList.add('active');
        currentPrediction = 'Heads';
        predictionText.textContent = 'You predicted: Heads';
        flipButton.disabled = false;
        flipButton.classList.remove('opacity-50', 'cursor-not-allowed');
    });
    
    predictTailsBtn.addEventListener('click', () => {
        resetPredictionButtons();
        predictTailsBtn.classList.add('active');
        currentPrediction = 'Tails';
        predictionText.textContent = 'You predicted: Tails';
        flipButton.disabled = false;
        flipButton.classList.remove('opacity-50', 'cursor-not-allowed');
    });
    
    function resetPredictionButtons() {
        predictHeadsBtn.classList.remove('active');
        predictTailsBtn.classList.remove('active');
    }
    
    flipButton.addEventListener('click', () => {
        if (isFlipping || !currentPrediction) return;
        
        // Reset classes and result
        coin.classList.remove('coin-flip-heads', 'coin-flip-tails');
        result.textContent = '';
        predictionResult.innerHTML = '';
        isFlipping = true;
        
        // Disable button during animation
        flipButton.disabled = true;
        flipButton.classList.add('opacity-50', 'cursor-not-allowed');
        resetPredictionButtons();
        
        // Random result (0 for heads, 1 for tails)
        const random = Math.floor(Math.random() * 2);
        const flipResult = random === 0 ? 'Heads' : 'Tails';
        
        // Add sound effect
        const audio = new Audio();
        audio.src = 'https://cdn.jsdelivr.net/gh/avicon/coin-sounds@main/coin-flip.mp3';
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio play failed:', e));
        
        // Start flipping animation
        setTimeout(() => {
            if (random === 0) {
                coin.classList.add('coin-flip-heads');
                setTimeout(() => {
                    result.textContent = 'Heads!';
                    heads++;
                    headsCount.textContent = heads;
                    updateFlipHistory('H');
                    checkPrediction('Heads');
                }, 2900);
            } else {
                coin.classList.add('coin-flip-tails');
                setTimeout(() => {
                    result.textContent = 'Tails!';
                    tails++;
                    tailsCount.textContent = tails;
                    updateFlipHistory('T');
                    checkPrediction('Tails');
                }, 2900);
            }
            
            // Show stats after first flip
            stats.classList.add('show');
            predictionStats.classList.add('show');
            
            // Re-enable prediction after animation
            setTimeout(() => {
                isFlipping = false;
                predictionText.textContent = '';
                currentPrediction = null;
            }, 3000);
        }, 100);
    });
    
    function checkPrediction(actualResult) {
        totalPredictions++;
        
        if (currentPrediction === actualResult) {
            correctPredictions++;
            predictionResult.innerHTML = '<span class="prediction-result prediction-correct">Correct!</span>';
            createConfetti();
        } else {
            predictionResult.innerHTML = '<span class="prediction-result prediction-incorrect">Wrong!</span>';
        }
        
        correctCount.textContent = correctPredictions;
        const rate = Math.round((correctPredictions / totalPredictions) * 100);
        successRate.textContent = `${rate}%`;
    }
    
    function updateFlipHistory(result) {
        flipResults.unshift(result);
        if (flipResults.length > 5) {
            flipResults.pop();
        }
        
        // Show history section
        if (flipResults.length > 0) {
            lastFlips.classList.remove('hidden');
        }
        
        // Update history display
        flipHistory.innerHTML = '';
        flipResults.forEach(flip => {
            const coin = document.createElement('div');
            coin.className = `w-8 h-8 rounded-full flex items-center justify-center ${flip === 'H' ? 'bg-yellow-400' : 'bg-yellow-500'}`;
            coin.innerHTML = `<span class="font-bold text-xs">${flip}</span>`;
            flipHistory.appendChild(coin);
        });
    }
    
    // Add fun confetti effect on correct prediction
    function createConfetti() {
        const confettiCount = 50;
        const container = document.body;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = getRandomColor();
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.top = '-10px';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.zIndex = '-1';
            
            container.appendChild(confetti);
            
            // Animate confetti
            anime({
                targets: confetti,
                top: window.innerHeight + 'px',
                left: '+=' + (Math.random() * 200 - 100) + 'px',
                rotate: '+=' + (Math.random() * 360) + 'deg',
                opacity: [1, 0],
                duration: Math.random() * 3000 + 2000,
                easing: 'easeOutExpo',
                complete: function() {
                    confetti.remove();
                }
            });
        }
    }
    
    function getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#FF9F1C'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
});