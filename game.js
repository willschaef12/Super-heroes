const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Sizes and speeds
const heroSize = 50, villainSize = 50, heroSpeed = 5, webSpeed = 10, webSize = 20;
const healthBarWidth = 50, healthBarHeight = 5;

// Images
const heroImg1 = new Image(), heroImg2 = new Image(), villainImg = new Image(), webImg = new Image();
const heroSelectImg1 = new Image(), heroSelectImg2 = new Image(); // Character selection images
heroImg1.src = 'spiderman.png'; // Hero 1 (Spiderman)
heroSelectImg1.src = 'spiderman2.webp'; // Selection image for Spiderman
heroImg2.src = 'batman.png'; // Hero 2 (Batman)
heroSelectImg2.src = 'batman.webp'; // Selection image for Batman
villainImg.src = 'venom.webp'; 
webImg.src = 'web.png';

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
        this.alive = true;
    }

    drawHealthBar() {
        if (this.alive) {
            const healthRatio = this.health / this.maxHealth;
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y - 10, healthBarWidth, healthBarHeight);
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y - 10, healthBarWidth * healthRatio, healthBarHeight);
        }
    }

    takeDamage() {
        this.health = Math.max(0, this.health - 1);
        if (this.health === 0) {
            this.alive = false;
        }
    }
}

class Web extends GameObject {
    constructor(x, y, direction) {
        super(x, y, webSize, webSize, webImg);
        this.direction = direction;
    }
    update() {
        this.x += webSpeed * Math.cos(this.direction);
        this.y += webSpeed * Math.sin(this.direction);
    }
}

// Create objects
const hero1 = new GameObject(canvas.width / 4, canvas.height / 2, heroSize, heroSize, heroImg1);
const hero2 = new GameObject((canvas.width * 3) / 4 - heroSize, canvas.height / 2, heroSize * 1.5, heroSize * 1.5, heroImg2);
const villain = new Villain(canvas.width / 2, canvas.height / 4, 5);
let webs = [], keys = {};

// Input handling
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

// Mouse click handling for character selection
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (mouseX >= hero1.x && mouseX <= hero1.x + heroSize && mouseY >= hero1.y && mouseY <= hero1.y + heroSize) {
        characterSelected = hero1;
        hero = hero1;
    }
    if (mouseX >= hero2.x && mouseX <= hero2.x + hero2.width && mouseY >= hero2.y && mouseY <= hero2.y + hero2.height) {
        characterSelected = hero2;
        hero = hero2;
    }
});

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
    const suitBoxSize = 80; // Reduced the box size to create more space
    const suitTextYOffset = 110; // Text offset to avoid cutting off text

    suits.forEach((suit, index) => {
        const x = (canvas.width / 5) * (index + 1) - 60; // Adjust spacing between boxes
        const y = canvas.height / 2;

        ctx.fillStyle = 'gray';
        ctx.fillRect(x, y, suitBoxSize, suitBoxSize);

        ctx.font = '20px "Sedgwick Ave", cursive';
        ctx.fillStyle = 'black';
        ctx.fillText(suit, x + suitBoxSize / 2, y + suitTextYOffset);
    });
}

// Movement and shooting
let lastShotTime = 0;
const webCooldown = 300;

function update() {
    let currentTime = Date.now();

    if (keys['ArrowUp']) hero.y -= heroSpeed;
    if (keys['ArrowDown']) hero.y += heroSpeed;
    if (keys['ArrowLeft']) hero.x -= heroSpeed;
    if (keys['ArrowRight']) hero.x += heroSpeed;

    if (keys['Space'] && currentTime - lastShotTime > webCooldown) {
        let dir = Math.atan2(keys['ArrowDown'] ? 1 : keys['ArrowUp'] ? -1 : 0, keys['ArrowRight'] ? 1 : keys['ArrowLeft'] ? -1 : 0);
        webs.push(new Web(hero.x + heroSize / 2, hero.y + heroSize / 2, dir));
        lastShotTime = currentTime;
    }

    webs.forEach(web => web.update());
    webs = webs.filter(web => web.x >= 0 && web.x <= canvas.width && web.y >= 0 && web.y <= canvas.height);

    webs.forEach((web, i) => {
        if (web.x < villain.x + villain.width && web.x + web.width > villain.x && web.y < villain.y + villain.height && web.y + web.height > villain.y) {
            villain.takeDamage();
            webs.splice(i, 1);
        }
    });
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hero.draw();
    villain.draw();
    villain.drawHealthBar();
    webs.forEach(web => web.draw());
}

// Main game loop
function gameLoop() {
    if (characterSelected === null) {
        drawCharacterSelect();
    } else if (suitSelected === null) {
        drawSuitSelect();
    } else if (gameStarted) {
        update();
        drawGame();
    } else {
        drawStartScreen();
    }
    requestAnimationFrame(gameLoop);
}

// Start the game
window.addEventListener('keydown', e => {
    if (e.code === 'Space' && characterSelected !== null && suitSelected !== null) {
        gameStarted = true;
    }
});

// Start the game loop
gameLoop();
