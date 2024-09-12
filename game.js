const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const heroSize = 150; // Assuming images are 50x50 pixels
const villainSize = 150;
const heroSpeed = 5;

// Load images
const heroImage = new Image();
const villainImage = new Image();
heroImage.src = 'spiderman.png'; // Path to your superhero image
villainImage.src = 'venom.webp'; // Path to your villain image

// Define Hero class
class Hero {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = heroSize;
        this.height = heroSize;
        this.image = heroImage;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}

// Define Villain class
class Villain {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = villainSize;
        this.height = villainSize;
        this.image = villainImage;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

// Create instances
const hero = new Hero(canvas.width / 2 - heroSize / 2, canvas.height / 2 - heroSize / 2);
const villain = new Villain(canvas.width / 2 - villainSize / 2, canvas.height / 4);

// Handle keyboard input
const keys = {};

window.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});

window.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

function update() {
    // Movement logic
    let dx = 0;
    let dy = 0;

    if (keys['ArrowUp']) dy = -heroSpeed;
    if (keys['ArrowDown']) dy = heroSpeed;
    if (keys['ArrowLeft']) dx = -heroSpeed;
    if (keys['ArrowRight']) dx = heroSpeed;

    hero.move(dx, dy);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    hero.draw();
    villain.draw();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Ensure images are loaded before starting the game loop
heroImage.onload = function() {
    villainImage.onload = function() {
        gameLoop();
    }
};
