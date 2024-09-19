const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Sizes and speeds
const heroSize = 50, villainSize = 50, heroSpeed = 5, webSpeed = 10, webSize = 20;
const healthBarWidth = 50, healthBarHeight = 5;

// Images
const heroImg1 = new Image(), heroImg2 = new Image(), villainImg = new Image(), webImg = new Image();
heroImg1.src = 'spiderman.png'; // Hero 1
heroImg2.src = 'batman.png'; // Hero 2 (You can replace this with any image)
villainImg.src = 'venom.webp'; 
webImg.src = 'web.png';

// Game state
let gameStarted = false;
let characterSelected = null;
let hero; // Declare hero here

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
    constructor(x, y, direction) { super(x, y, webSize, webSize, webImg); this.direction = direction; }
    update() { this.x += webSpeed * Math.cos(this.direction); this.y += webSpeed * Math.sin(this.direction); }
}

// Create objects
const hero1 = new GameObject(canvas.width / 4, canvas.height / 2, heroSize, heroSize, heroImg1);
const hero2 = new GameObject((canvas.width * 3) / 4 - heroSize, canvas.height / 2, heroSize, heroSize, heroImg2);
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
    }

    // Check if the Batman image was clicked
    if (mouseX >= hero2.x && mouseX <= hero2.x + heroSize &&
        mouseY >= hero2.y && mouseY <= hero2.y + heroSize) {
        characterSelected = hero2;
        hero = hero2; // Set the hero to the selected character
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
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Select Your Character', canvas.width / 2, 50);

    hero1.draw();
    ctx.fillText('Click Spiderman', canvas.width / 4, canvas.height / 2 + heroSize + 20);

    hero2.draw();
    ctx.fillText('Click Batman', (canvas.width * 3) / 4, canvas.height / 2 + heroSize + 20);
}

// Movement and shooting
let lastShotTime = 0; // Track the last time the web was shot
const webCooldown = 300; // Cooldown period in milliseconds (0.3 seconds)

function update() {
    let currentTime = Date.now(); // Get the current time

    if (keys['ArrowUp']) hero.y -= heroSpeed;
    if (keys['ArrowDown']) hero.y += heroSpeed;
    if (keys['ArrowLeft']) hero.x -= heroSpeed;
    if (keys['ArrowRight']) hero.x += heroSpeed;

    // Only shoot if enough time has passed since the last shot
    if (keys['Space'] && currentTime - lastShotTime > webCooldown) {
        let dir = Math.atan2(keys['ArrowDown'] ? 1 : keys['ArrowUp'] ? -1 : 0, keys['ArrowRight'] ? 1 : keys['ArrowLeft'] ? -1 : 0);
        webs.push(new Web(hero.x + heroSize / 2, hero.y + heroSize / 2, dir));
        lastShotTime = currentTime; // Update the last shot time
    }

    webs.forEach(web => web.update());
    webs = webs.filter(web => web.x >= 0 && web.x <= canvas.width && web.y >= 0 && web.y <= canvas.height);

    // Collision detection with the villain
    webs.forEach((web, i) => {
        if (web.x < villain.x + villain.width && web.x + web.width > villain.x &&
            web.y < villain.y + villain.height && web.y + web.height > villain.y) {
            villain.takeDamage();
            webs.splice(i, 1); // Remove the web upon collision
        }
    });
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial'; ctx.fillStyle = 'black'; ctx.textAlign = 'center';
    ctx.fillText('VS Venom', canvas.width / 2, 50);
    hero.draw();

    if (villain.alive) {
        villain.draw();
        villain.drawHealthBar();
    } else {
        ctx.fillText('Villain Defeated!', canvas.width / 2, canvas.height / 2);
    }

    webs.forEach(web => web.draw());
}

// Game loop
function gameLoop() {
    if (characterSelected === null) {
        drawCharacterSelect();
    } else if (gameStarted) {
        update(); 
        drawGame(); 
    } else {
        drawStartScreen();
    }
    requestAnimationFrame(gameLoop);
}

// Start game after images are loaded
heroImg1.onload = heroImg2.onload = villainImg.onload = webImg.onload = () => {
    gameLoop();
};

// Start the game on spacebar press
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !gameStarted && characterSelected !== null) {
        gameStarted = true;
    }
});
