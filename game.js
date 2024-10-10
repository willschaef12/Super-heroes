const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = 800; // Set canvas width
canvas.height = 600; // Set canvas height
const ctx = canvas.getContext('2d');

// Sizes and speeds
const heroSize = 50,
    villainSize = 50,
    heroSpeed = 5,
    webSpeed = 10,
    webSize = 20;

// Game state
let gameStarted = false;
let characterSelected = null;
let suitSelected = null;
let availableSuits = [];
let hero;

// Load images
const images = {
    heroImg1: 'spiderman.png',
    heroImg2: 'batman.webp',
    heroImg3: 'deadpool2.webp',  // Deadpool's main image
    heroImg4: 'gambit.webp',     // Gambit's main image
    villainImg: 'venom.webp',
    webImg: 'web.png',
    heroSelectImg1: 'spiderman2.webp',
    heroSelectImg2: 'batman.webp',
    heroSelectImg3: 'deadpool.png', // Deadpool selection image
    heroSelectImg4: 'gambitselect.jpeg', // Gambit selection image
    spidermanSuit1: 'spiderman_suit1.png',
    spidermanSuit2: 'spiderman_suit2.png',
    spidermanSuit3: 'spiderman_suit3.png',
    batmanSuit1: 'batman_suit1.png',
    batmanSuit2: 'batman_suit2.png',
    batmanSuit3: 'batman_suit3.png',
    deadpoolSuit1: 'deadpool_suit1.png', // Deadpool suit images
    deadpoolSuit2: 'deadpool_suit2.png',
    deadpoolSuit3: 'deadpool_suit3.png',
    gambitSuit1: 'gambit_suit1.png', // Gambit suit images
    gambitSuit2: 'gambit_suit2.gif',
    gambitSuit3: 'gambit_suit3.webp',
};

const loadedImages = {};
let imagesLoaded = 0;
const totalImages = Object.keys(images).length;

function loadImages() {
    Object.keys(images).forEach((key) => {
        const img = new Image();
        img.src = images[key];
        img.onload = () => {
            loadedImages[key] = img;
            imagesLoaded++;
            console.log(`Image loaded: ${key}`); // Log the loaded image key
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
const hero3 = new GameObject((canvas.width * 2) / 4 - heroSize / 2, canvas.height / 2 + 100, heroSize * 1.5, heroSize * 1.5, loadedImages.heroImg3); // Deadpool
const hero4 = new GameObject(canvas.width / 4, canvas.height / 2 + 200, heroSize * 1.5, heroSize * 1.5, loadedImages.heroImg4); // Gambit
const villain = new Villain(canvas.width / 2, canvas.height / 4, 5);
let webs = [];
let keys = {};

// Input handling
window.addEventListener('keydown', (e) => (keys[e.code] = true));
window.addEventListener('keyup', (e) => (keys[e.code] = false));

// Mouse click handling for buttons
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check if the "Start" button is clicked
    if (!gameStarted && mouseX >= canvas.width / 2 - 100 && mouseX <= canvas.width / 2 + 100 &&
        mouseY >= 130 && mouseY <= 180) { // Updated y-coordinates to match the button
        gameStarted = true; // Set the game started flag
        drawCharacterSelect(); // Show character selection screen
        return;
    }

    // Character selection logic
    if (gameStarted && !characterSelected) {
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
        if (mouseX >= hero3.x && mouseX <= hero3.x + hero3.width && mouseY >= hero3.y && mouseY <= hero3.y + hero3.height) { // Deadpool selection
            characterSelected = hero3;
            hero = hero3;
            availableSuits = [loadedImages.deadpoolSuit1, loadedImages.deadpoolSuit2, loadedImages.deadpoolSuit3]; // Deadpool's suits
            drawSuitSelect();
        }
        if (mouseX >= hero4.x && mouseX <= hero4.x + hero4.width && mouseY >= hero4.y && mouseY <= hero4.y + hero4.height) { // Gambit selection
            characterSelected = hero4;
            hero = hero4;
            availableSuits = [loadedImages.gambitSuit1, loadedImages.gambitSuit2, loadedImages.gambitSuit3]; // Gambit's suits
            drawSuitSelect();
        }
    } else if (characterSelected && !suitSelected) {
        availableSuits.forEach((suit, index) => {
            let suitX = canvas.width / (availableSuits.length + 1) * (index + 1);
            if (mouseX >= suitX - heroSize / 2 && mouseX <= suitX + heroSize / 2 &&
                mouseY >= 90 && mouseY <= 90 + heroSize) { // Adjusted y-coordinates
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
    
    // Draw "Heroes Unleashed" title
    ctx.font = 'bold 60px Arial'; // Change font size and style for the title
    ctx.fillStyle = 'black'; // Title color
    ctx.textAlign = 'center'; // Center the text
    ctx.fillText('Heroes Unleashed', canvas.width / 2, 50); // Title position moved up

    ctx.font = '30px Arial'; // Smaller font for welcome message
    ctx.fillText('Welcome to the Game!', canvas.width / 2, 90); // Move this text up

    // Draw the "Start" button
    ctx.fillStyle = 'green';
    ctx.fillRect(canvas.width / 2 - 100, 130, 200, 50);
    ctx.fillStyle = 'black';
    ctx.fillText('Start', canvas.width / 2, 165); // Centered text within the button
}

// Character selection screen
function drawCharacterSelect() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Select Your Character', canvas.width / 2, 50);

    // Spiderman
    ctx.fillText('Spiderman', canvas.width / 4, hero1.y - 20);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    ctx.strokeRect(hero1.x, hero1.y, hero1.width, hero1.height);
    ctx.drawImage(loadedImages.heroSelectImg1, hero1.x, hero1.y, hero1.width, hero1.height);

    // Batman
    ctx.fillText('Batman', (canvas.width * 3) / 4, hero2.y - 20);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 5;
    ctx.strokeRect(hero2.x, hero2.y, hero2.width, hero2.height);
    ctx.drawImage(loadedImages.heroSelectImg2, hero2.x, hero2.y, hero2.width, hero2.height);

    // Deadpool
    ctx.fillText('Deadpool', (canvas.width * 2) / 4, hero3.y - 20);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.strokeRect(hero3.x, hero3.y, hero3.width, hero3.height);
    ctx.drawImage(loadedImages.heroSelectImg3, hero3.x, hero3.y, hero3.width, hero3.height);

    // Gambit
    ctx.fillText('Gambit', canvas.width / 4, hero4.y - 20); // Adjusted text position for Gambit
    ctx.strokeStyle = 'purple'; // Gambit's color
    ctx.lineWidth = 5;
    ctx.strokeRect(hero4.x, hero4.y, hero4.width, hero4.height);
    ctx.drawImage(loadedImages.heroSelectImg4, hero4.x, hero4.y, hero4.width, hero4.height); // Draw Gambit's selection image
}

// Suit selection screen
function drawSuitSelect() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Select a Suit', canvas.width / 2, 50);

    availableSuits.forEach((suit, index) => {
        const suitX = canvas.width / (availableSuits.length + 1) * (index + 1);
        ctx.drawImage(suit, suitX - heroSize / 2, 90, heroSize, heroSize); // Adjusted y-coordinates for the suits
    });
}

