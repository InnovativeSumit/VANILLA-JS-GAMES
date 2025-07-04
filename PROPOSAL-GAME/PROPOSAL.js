const target = document.getElementById('target');
    
function moveTarget() {
    const maxWidth = 400; // Container width - target width
    const maxHeight = 500; // Container height - target height

    const randomX = Math.floor(Math.random() * maxWidth);
    const randomY = Math.floor(Math.random() * maxHeight);

    target.style.left = randomX + 'px';
    target.style.top = randomY + 'px';
}

target.addEventListener('mouseenter', function() {
    moveTarget();
});

document.getElementById('yes').addEventListener('click', () => {
    alert("Thank you😍 I love you too💓😁");
});

// Initialize target position
moveTarget();