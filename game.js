const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Sizes and speeds
const heroSize = 50, villainSize = 50, heroSpeed = 5, webSpeed = 10, webSize = 20;
const healthBarWidth = 50, healthBarHeight = 5;

// Images
const heroImg = new Image(), villainImg = new Image(), webImg = new Image();
heroImg.src = 'spiderman.png'; villainImg.src = 'venom.webp'; webImg.src = 'web.png';

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
        this.maxHealth = health; // Store max health for scaling
        this.health = health;
    }
    
    drawHealthBar() {
        const barWidth = 50;  // Fixed width for health bar
        const barHeight = 5;
        const healthRatio = this.health / this.maxHealth; // Calculate health ratio

        // Draw red background (full bar)
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y - 10, barWidth, barHeight);
        
        // Draw green foreground (remaining health)
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y - 10, barWidth * healthRatio, barHeight);
    }

    takeDamage() {
        this.health = Math.max(0, this.health - 1); // Decrease health, ensure it doesn't go below 0
    }
}


class Web extends GameObject {
    constructor(x, y, direction) { super(x, y, webSize, webSize, webImg); this.direction = direction; }
    update() { this.x += webSpeed * Math.cos(this.direction); this.y += webSpeed * Math.sin(this.direction); }
}

// Create objects
const hero = new GameObject(canvas.width / 2, canvas.height / 2, heroSize, heroSize, heroImg);
const villain = new Villain(canvas.width / 2, canvas.height / 4, 5);
let webs = [], keys = {};

// Input handling
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

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


// Drawing
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial'; ctx.fillStyle = 'black'; ctx.textAlign = 'center';
    ctx.fillText('VS Venom', canvas.width / 2, 50); // Draw text
    hero.draw(); villain.draw(); villain.drawHealthBar(); // Draw hero, villain, and health bar
    webs.forEach(web => web.draw()); // Draw webs
}

// Game loop
function gameLoop() {
    update(); draw(); requestAnimationFrame(gameLoop);
}

// Start game after images are loaded
heroImg.onload = villainImg.onload = webImg.onload = gameLoop;
