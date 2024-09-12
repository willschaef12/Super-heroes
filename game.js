const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const heroSize = 50; // Width and height of the hero image
const villainSize = 50; // Width and height of the villain image
const heroSpeed = 5;
const spiderwebSpeed = 10;
const spiderwebSize = 20; // Size of the spiderweb image

// Load images
const heroImage = new Image();
const villainImage = new Image();
const spiderwebImage = new Image();

heroImage.src = 'spiderman.png'; // Path to your Spiderman image
villainImage.src = 'venom.webp'; // Path to your Venom image
spiderwebImage.src = 'web.png'; // Path to your spiderweb image

// Define Spiderweb class
class Spiderweb {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction; // Direction of the web
        this.width = spiderwebSize;
        this.height = spiderwebSize;
    }

    draw() {
        ctx.drawImage(spiderwebImage, this.x, this.y, this.width, this.height);
    }

    update() {
        // Move the spiderweb based on its direction
        this.x += spiderwebSpeed * Math.cos(this.direction);
        this.y += spiderwebSpeed * Math.sin(this.direction);
    }
}

// Define Hero class
class Hero {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = heroSize;
        this.height = heroSize;
    }

    draw() {
        ctx.drawImage(heroImage, this.x, this.y, this.width, this.height);
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
    }

    draw() {
        ctx.drawImage(villainImage, this.x, this.y, this.width, this.height);
    }
}

// Create instances
const hero = new Hero(canvas.width / 2 - heroSize / 2, canvas.height / 2 - heroSize / 2);
const villain = new Villain(canvas.width / 2 - villainSize / 2, canvas.height / 4);
let spiderwebs = []; // Initialize spiderwebs array

// Handle keyboard input
const keys = {};
let shootingDirection = 0;

window.addEventListener('keydown', (event) => {
    keys[event.code] = true;

    if (event.code === 'Space') {
        // Calculate the shooting direction based on the hero's current facing direction
        shootingDirection = Math.atan2(keys['ArrowDown'] ? 1 : keys['ArrowUp'] ? -1 : 0, keys['ArrowRight'] ? 1 : keys['ArrowLeft'] ? -1 : 0);
        spiderwebs.push(new Spiderweb(hero.x + heroSize / 2 - spiderwebSize / 2, hero.y + heroSize / 2 - spiderwebSize / 2, shootingDirection));
    }
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

    // Update spiderwebs
    spiderwebs.forEach(web => {
        web.update();
    });

    // Remove spiderwebs that are off-screen
    spiderwebs = spiderwebs.filter(web => web.x >= 0 && web.x <= canvas.width && web.y >= 0 && web.y <= canvas.height);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    hero.draw();
    villain.draw();
    spiderwebs.forEach(web => {
        web.draw();
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop after images have loaded
heroImage.onload = () => {
    villainImage.onload = () => {
        spiderwebImage.onload = () => {
            gameLoop();
        };
    };
};