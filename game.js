const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Sizes and speeds
const heroSize = 50, villainSize = 50, heroSpeed = 5, webSpeed = 10, webSize = 20;
const healthBarWidth = 50, healthBarHeight = 5;

// Images
const heroImg1 = new Image(), heroImg2 = new Image(), villainImg = new Image(), webImg = new Image();
const heroSelectImg1 = new Image(), heroSelectImg2 = new Image(); // Character selection images
const suitOneImg = new Image(); // New image for Suit One

heroImg1.src = 'spiderman.png'; // Hero 1 (Spiderman)
heroSelectImg1.src = 'spiderman2.webp'; // Selection image for Spiderman
heroImg2.src = 'batman.png'; // Hero 2 (Batman)
heroSelectImg2.src = 'batman.webp'; // Selection image for Batman
villainImg.src = 'venom.webp'; 
webImg.src = 'web.png';

// Load the Suit One image
suitOneImg.src = 'suit1.png'; // Add the actual image URL for Suit One

// Game state
let gameStarted = false;
let characterSelected = null;
let suitSelected = null;
let hero; // Selected hero

// Load custom font (Sedgwick Ave)
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Sedgwick+Ave&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

// Classes
class GameObject {
    constructor(x, y, width, height, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class Villain extends GameObject {
    constructor(x, y, health) {
        super(x, y, villainSize, villainSize, villainImg);
        this.maxHealth = health;
        this.health = health;
        this.alive = true; // Track if the villain is alive
    }

    drawHealthBar() {
        if (this.alive) {
            const barWidth = 50;
            const barHeight = 5;
            const healthRatio = this.health / this.maxHealth;

            // Draw the red background (empty health bar)
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y - 10, barWidth, barHeight);

            // Draw the green foreground (remaining health)
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y - 10, barWidth * healthRatio, barHeight);
        }
    }

    takeDamage() {
        this.health = Math.max(0, this.health - 1); // Decrease health, but not below 0

        // Check if villain's health is 0, set `alive` to false
        if (this.health === 0) {
            this.alive = false;
        }
    }

    draw() {
        if (this.alive) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}

// Define hero positions
const hero1 = new GameObject(100, canvas.height / 2, heroSize, heroSize, heroImg1);
const hero2 = new GameObject(300, canvas.height / 2, heroSize * 1.5, heroSize * 1.5, heroImg2);

// Start screen
function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Press Space to Start', canvas.width / 2, canvas.height / 2);
}

// Character selection screen
function drawCharacterSelect() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 50px "Sedgwick Ave", cursive';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('Spiderman', canvas.width / 4, hero1.y - 20);
    
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    ctx.strokeRect(hero1.x, hero1.y, heroSize, heroSize);
    ctx.drawImage(heroSelectImg1, hero1.x, hero1.y, heroSize, heroSize);

    ctx.fillStyle = 'black';
    ctx.fillText('Batman', (canvas.width * 3) / 4, hero2.y - 20);
    
    ctx.strokeStyle = 'black';
    ctx.strokeRect(hero2.x, hero2.y, heroSize * 1.5, heroSize * 1.5);
    ctx.drawImage(heroSelectImg2, hero2.x, hero2.y, heroSize * 1.5, heroSize * 1.5);
}

// Suit selection screen
function drawSuitSelect() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 40px "Sedgwick Ave", cursive';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Select Your Suit', canvas.width / 2, canvas.height / 4);

    const suits = ['Suit One', 'Suit Two', 'Suit Three', 'Suit Four'];
    const suitBoxSize = 80; // Suit box size
    const suitTextYOffset = 110; // Text offset

    suits.forEach((suit, index) => {
        const x = (canvas.width / 5) * (index + 1) - 60; // Adjusted spacing
        const y = canvas.height / 2;

        ctx.fillStyle = 'gray';
        ctx.fillRect(x, y, suitBoxSize, suitBoxSize);

        // Display the image for "Suit One"
        if (index === 0) {
            ctx.drawImage(suitOneImg, x, y, suitBoxSize, suitBoxSize); // Draw suit one image inside the box
        }

        ctx.font = '20px "Sedgwick Ave", cursive';
        ctx.fillStyle = 'black';
        ctx.fillText(suit, x + suitBoxSize / 2, y + suitTextYOffset);
    });
}

// Main game loop
function gameLoop() {
    if (characterSelected === null) {
        drawCharacterSelect();
    } else if (suitSelected === null) {
        drawSuitSelect();
    } else if (gameStarted) {
        // Game logic
    } else {
        drawStartScreen();
    }
    requestAnimationFrame(gameLoop);
}

// Input handling
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !gameStarted && characterSelected !== null && suitSelected !== null) {
        gameStarted = true; // Set game to started
    }
});

// Start the game loop
gameLoop();
