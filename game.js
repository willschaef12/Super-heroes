const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Sizes and speeds
const heroSize = 50, villainSize = 50, heroSpeed = 5, webSpeed = 10, webSize = 20;

// Game state
let gameStarted = false;
let characterSelected = null;
let suitSelected = null;
let availableSuits = [];
let hero;

// Load images
const images = {
    heroImg1: 'spiderman.png',
    heroImg2: 'batman.png',
    villainImg: 'venom.webp',
    webImg: 'web.png',
    heroSelectImg1: 'spiderman2.webp',
    heroSelectImg2: 'batman.webp',
    spidermanSuit1: 'spiderman_suit1.png',
    spidermanSuit2: 'spiderman_suit2.png',
    spidermanSuit3: 'spiderman_suit3.png',
    batmanSuit1: 'batman_suit1.png',
    batmanSuit2: 'batman_suit2.png',
    batmanSuit3: 'batman_suit3.png',
};

const loadedImages = {};
let imagesLoaded = 0;
const totalImages = Object.keys(images).length;

function loadImages() {
    Object.keys(images).forEach(key => {
        const img = new Image();
        img.src = images[key];
        img.onload = () => {
            loadedImages[key] = img;
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                drawStartScreen(); // Draw the start screen after images are loaded
            }
        };
    });
}

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
        super(x, y, villainSize, villainSize, loadedImages.villainImg);
        this.maxHealth = health;
        this.health = health;
        this.alive = true;
    }

    drawHealthBar() {
        if (this.alive) {
            const barWidth = 50;
            const barHeight = 5;
            const healthRatio = this.health / this.maxHealth;
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y - 10, barWidth, barHeight);
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y - 10, barWidth * healthRatio, barHeight);
        }
    }

    takeDamage() {
        this.health = Math.max(0, this.health - 1);
        if (this.health === 0) this.alive = false;
    }
}

class Web extends GameObject {
    constructor(x, y, direction) {
        super(x, y, webSize, webSize, loadedImages.webImg);
        this.direction = direction;
    }

    update() {
        this.x += webSpeed * Math.cos(this.direction);
        this.y += webSpeed * Math.sin(this.direction);
    }
}

// Create objects
const hero1 = new GameObject(canvas.width / 4, canvas.height / 2, heroSize, heroSize, loadedImages.heroImg1);
const hero2 = new GameObject((canvas.width * 3) / 4 - heroSize, canvas.height / 2, heroSize * 1.5, heroSize * 1.5, loadedImages.heroImg2);
const villain = new Villain(canvas.width / 2, canvas.height / 4, 5);
let webs = [];
let keys = {};

// Input handling
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

// Mouse click handling for character selection
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Character selection logic
    if (!characterSelected) {
        if (mouseX >= hero1.x && mouseX <= hero1.x + heroSize && mouseY >= hero1.y && mouseY <= hero1.y + heroSize) {
            characterSelected = hero1;
            hero = hero1;
            availableSuits = [loadedImages.spidermanSuit1, loadedImages.spidermanSuit2, loadedImages.spidermanSuit3]; // Spiderman's suits
            drawSuitSelect();
        }
        if (mouseX >= hero2.x && mouseX <= hero2.x + hero2.width && mouseY >= hero2.y && mouseY <= hero2.y + hero2.height) {
            characterSelected = hero2;
            hero = hero2;
            availableSuits = [loadedImages.batmanSuit1, loadedImages.batmanSuit2, loadedImages.batmanSuit3]; // Batman's suits
            drawSuitSelect();
        }
    } else if (!suitSelected) {
        availableSuits.forEach((suit, index) => {
            let suitX = canvas.width / (availableSuits.length + 1) * (index + 1);
            if (mouseX >= suitX - heroSize / 2 && mouseX <= suitX + heroSize / 2 &&
                mouseY >= 150 && mouseY <= 150 + heroSize) {
                suitSelected = suit;
                hero.image = suit;
            }
        });
    }
});

// Start loading images
loadImages();

// Start screen
function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Welcome to the Game!', canvas.width / 2, canvas.height / 2 - 40);

    // Draw the "Start" button
    ctx.fillStyle = 'green';
    ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 20, 200, 50);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Start', canvas.width / 2, canvas.height / 2 + 50);
    
    // Draw the "Select Character" button
    ctx.fillStyle = 'blue';
    ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 100, 200, 50);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Select Character', canvas.width / 2, canvas.height / 2 + 120);
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
    ctx.drawImage(loadedImages.heroSelectImg1, hero1.x, hero1.y, heroSize, heroSize);

    ctx.fillStyle = 'black';
    ctx.fillText('Batman', (canvas.width * 3) / 4, hero2.y - 20);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.strokeRect(hero2.x, hero2.y, heroSize * 1.5, heroSize * 1.5);
    ctx.drawImage(loadedImages.heroSelectImg2, hero2.x, hero2.y, heroSize * 1.5, heroSize * 1.5);
}

// Suit selection screen
function drawSuitSelect() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 40px "Sedgwick Ave", cursive';
    ctx.fillStyle = 'blue';
    ctx.textAlign = 'center';
    ctx.fillText('Select a Suit', canvas.width / 2, 100);

    availableSuits.forEach((suit, index) => {
        let suitX = canvas.width / (availableSuits.length + 1) * (index + 1);
        ctx.drawImage(suit, suitX - heroSize / 2, 150, heroSize, heroSize);
    });
}

// Movement and shooting
let lastShotTime = 0;
const webCooldown = 300;

function update() {
    if (hero) {
        if (keys['ArrowUp']) hero.y -= heroSpeed;
        if (keys['ArrowDown']) hero.y += heroSpeed;
        if (keys['ArrowLeft']) hero.x -= heroSpeed;
        if (keys['ArrowRight']) hero.x += heroSpeed;

        // Shooting webs
        if (keys['Space'] && Date.now() - lastShotTime >= webCooldown) {
            webs.push(new Web(hero.x + heroSize / 2, hero.y + heroSize / 2, Math.random() * 2 * Math.PI));
            lastShotTime = Date.now();
        }
    }

    // Update webs
    webs.forEach(web => web.update());
}

// Game loop
function gameLoop() {
    if (!gameStarted) {
        drawStartScreen();
    } else if (!characterSelected) {
        drawCharacterSelect();
    } else if (!suitSelected) {
        drawSuitSelect();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hero.draw();
        villain.draw();
        villain.drawHealthBar();
        webs.forEach(web => web.draw());
        update();
    }
    requestAnimationFrame(gameLoop);
}

// Start game on "Start" button click
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check if the "Start" button is clicked
    if (!gameStarted && mouseX >= canvas.width / 2 - 100 && mouseX <= canvas.width / 2 + 100 &&
        mouseY >= canvas.height / 2 + 20 && mouseY <= canvas.height / 2 + 70) {
        gameStarted = true;
        drawCharacterSelect();
    }

    // Check if the "Select Character" button is clicked
    if (!characterSelected && mouseX >= canvas.width / 2 - 100 && mouseX <= canvas.width / 2 + 100 &&
        mouseY >= canvas.height / 2 + 100 && mouseY <= canvas.height / 2 + 150) {
        drawCharacterSelect();
    }
});

// Start the image loading process
loadImages();
gameLoop(); // Start the game loop
