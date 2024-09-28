const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Sizes and speeds
const heroSize = 50, villainSize = 50, heroSpeed = 5, webSpeed = 10, webSize = 20;
const healthBarWidth = 50, healthBarHeight = 5;

// Images
const heroImg1 = new Image(), heroImg2 = new Image(), villainImg = new Image(), webImg = new Image();
const heroSelectImg1 = new Image(), heroSelectImg2 = new Image(); // New images for selecting characters
const spidermanSuit1 = new Image(), spidermanSuit2 = new Image(); // Suits for Spider-Man
const batmanSuit1 = new Image(), batmanSuit2 = new Image(); // Suits for Batman

// Load images
heroImg1.src = 'spiderman.png'; // Hero 1
heroSelectImg1.src = 'spiderman2.webp'; // New selection image for Spiderman
heroImg2.src = 'batman.png'; // Hero 2 (You can replace this with any image)
heroSelectImg2.src = 'batman_select.webp'; // New selection image for Batman
villainImg.src = 'venom.webp'; 
webImg.src = 'web.png';

spidermanSuit1.src = 'spiderman_suit1.png'; // Spider-Man Suit 1
spidermanSuit2.src = 'spiderman_suit2.png'; // Spider-Man Suit 2
batmanSuit1.src = 'batman_suit1.png'; // Batman Suit 1
batmanSuit2.src = 'batman_suit2.png'; // Batman Suit 2

// Game state
let gameStarted = false;
let characterSelected = null;
let suitSelected = null; // New variable to track the selected suit
let hero; // Declare hero here

// Load the custom font dynamically
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Sedgwick+Ave&display=swap'; // Sedgwick Ave font
link.rel = 'stylesheet';
document.head.appendChild(link);

// Classes
class GameObject {
    constructor(x, y, width, height, image) {
        this.x = x; this.y = y; this.width = width; this.height = height; this.image = image;
    }
    draw() { ctx.drawImage(this.image, this.x, this.y, this.width, this.height); }
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
const hero2 = new GameObject((canvas.width * 3) / 4 - heroSize, canvas.height / 2, heroSize * 1.5, heroSize * 1.5, heroImg2); // Wider and taller for Batman
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

    // Check if the Spiderman image was clicked
    if (mouseX >= hero1.x && mouseX <= hero1.x + heroSize &&
        mouseY >= hero1.y && mouseY <= hero1.y + heroSize) {
        characterSelected = hero1;
        hero = hero1; // Set the hero to the selected character
        suitSelected = null; // Reset suit selection
    }

    // Check if the Batman image was clicked
    if (mouseX >= hero2.x && mouseX <= hero2.x + hero2.width &&
        mouseY >= hero2.y && mouseY <= hero2.y + hero2.height) {
        characterSelected = hero2;
        hero = hero2; // Set the hero to the selected character
        suitSelected = null; // Reset suit selection
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

// Suit selection screen
function drawSuitSelect() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px "Sedgwick Ave", cursive';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Select Your Suit', canvas.width / 2, 50);

    if (hero === hero1) { // Spider-Man selected
        ctx.drawImage(spidermanSuit1, canvas.width / 4, canvas.height / 2, heroSize, heroSize);
        ctx.drawImage(spidermanSuit2, canvas.width / 2, canvas.height / 2, heroSize, heroSize);
    } else { // Batman selected
        ctx.drawImage(batmanSuit1, canvas.width / 4, canvas.height / 2, heroSize, heroSize);
        ctx.drawImage(batmanSuit2, canvas.width / 2, canvas.height / 2, heroSize, heroSize);
    }
}

// Character selection screen
function drawCharacterSelect() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 50px "Sedgwick Ave", cursive'; // Using Sedgwick Ave font
    ctx.fillStyle = 'red'; // Base color for Spiderman
    ctx.textAlign = 'center';
    ctx.shadowColor = 'black'; // Shadow color
    ctx.shadowBlur = 10; // Blurred shadow for depth
    ctx.shadowOffsetX = 5; // Horizontal shadow offset
    ctx.shadowOffsetY = 5; // Vertical shadow offset
    ctx.fillText('Spiderman', canvas.width / 4, hero1.y - 20); // Position the text above Spiderman

    // Reset shadow for other elements
    ctx.shadowColor = 'transparent';

    // Draw a border around the Spiderman selection image (always present)
    ctx.strokeStyle = 'red'; // Set border color
    ctx.lineWidth = 5; // Set border width
    ctx.strokeRect(hero1.x, hero1.y, heroSize, heroSize); // Draw the border around the Spiderman image

    // Draw the Spiderman image with the original size
    ctx.drawImage(heroSelectImg1, hero1.x, hero1.y, heroSize, heroSize);

    // Batman selection
    ctx.fillStyle = 'black'; // Change color for Batman text to black
    ctx.fillText('Batman', (canvas.width * 3) / 4, hero2.y - 20); // Position Batman text above the image
    
    // Draw a black border around the Batman selection image
    ctx.strokeStyle = 'black'; // Set border color for Batman
    ctx.lineWidth = 5
