// Create and configure the canvas
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = 800; // Set canvas width
canvas.height = 600; // Set canvas height
const ctx = canvas.getContext("2d");

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

// Define a simple list of hero names
const heroNames = ["Spiderman", "Batman", "Deadpool", "Gambit"];

// Generate image filenames dynamically
const imageFilenames = [];

heroNames.forEach((heroName) => {
  const heroKey = heroName.toLowerCase();
  imageFilenames.push(`${heroKey}.png`); // Main image
  imageFilenames.push(`${heroKey}_select.png`); // Selection image
  for (let i = 1; i <= 3; i++) {
    imageFilenames.push(`${heroKey}_suit${i}.png`); // Suit images
  }
});

// Load images
const loadedImages = {};
let imagesLoaded = 0;
const totalImages = imageFilenames.length;

function loadImages() {
  imageFilenames.forEach((filename) => {
    const img = new Image();
    img.src = "assets/" + filename; // Assuming images are in the 'assets' folder
    img.onload = () => {
      loadedImages[filename] = img;
      imagesLoaded++;
      console.log(`Image loaded: ${filename}`);
      if (imagesLoaded === totalImages) {
        buildHeroData(); // Build hero data after images are loaded
        drawStartScreen(); // Draw the start screen
      }
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${filename}`);
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
        buildHeroData(); // Build hero data after images are loaded
        drawStartScreen(); // Draw the start screen
      }
    };
  });
}

// Start loading images
loadImages();

// Data structures
const heroData = [];
const heroObjects = [];

// Build hero data dynamically
function buildHeroData() {
  heroNames.forEach((heroName) => {
    const heroKey = heroName.toLowerCase();
    const mainImage = loadedImages[`${heroKey}.png`];
    const selectImage = loadedImages[`${heroKey}_select.png`];
    const suits = [];
    for (let i = 1; i <= 3; i++) {
      const suitImage = loadedImages[`${heroKey}_suit${i}.png`];
      suits.push(suitImage);
    }
    heroData.push({
      name: heroName,
      heroKey: heroKey,
      mainImage: mainImage,
      selectImage: selectImage,
      suits: suits,
      color: "black", // Default color; you can customize this if needed
    });
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
    super(x, y, villainSize, villainSize, loadedImages["venom.png"]);
    this.maxHealth = health;
    this.health = health;
    this.alive = true;
  }

  drawHealthBar() {
    if (this.alive) {
      const barWidth = 50;
      const barHeight = 5;
      const healthRatio = this.health / this.maxHealth;
      ctx.fillStyle = "red";
      ctx.fillRect(this.x, this.y - 10, barWidth, barHeight);
      ctx.fillStyle = "green";
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
    super(x, y, webSize, webSize, loadedImages["web.png"]);
    this.direction = direction;
  }

  update() {
    this.x += webSpeed * Math.cos(this.direction);
    this.y += webSpeed * Math.sin(this.direction);
  }
}

// Create villain
const villain = new Villain(canvas.width / 2, canvas.height / 4, 5);
let webs = [];
let keys = {};

// Input handling
window.addEventListener("keydown", (e) => (keys[e.code] = true));
window.addEventListener("keyup", (e) => (keys[e.code] = false));

// Mouse click handling for buttons
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Check if the "Start" button is clicked
  if (
    !gameStarted &&
    mouseX >= canvas.width / 2 - 100 &&
    mouseX <= canvas.width / 2 + 100 &&
    mouseY >= 130 &&
    mouseY <= 180
  ) {
    // Updated y-coordinates to match the button
    gameStarted = true; // Set the game started flag
    drawCharacterSelect(); // Show character selection screen
    return;
  }

  // Character selection logic
  if (gameStarted && !characterSelected) {
    for (let heroObj of heroObjects) {
      const gameObject = heroObj.gameObject;
      if (
        mouseX >= gameObject.x &&
        mouseX <= gameObject.x + gameObject.width &&
        mouseY >= gameObject.y &&
        mouseY <= gameObject.y + gameObject.height
      ) {
        characterSelected = heroObj;
        hero = new GameObject(
          canvas.width / 2,
          canvas.height - heroSize - 10,
          heroSize,
          heroSize,
          heroObj.hero.mainImage
        );
        availableSuits = heroObj.hero.suits.filter(
          (suitImage) => suitImage !== undefined
        );
        drawSuitSelect();
        break;
      }
    }
  } else if (characterSelected && !suitSelected) {
    availableSuits.forEach((suitImage, index) => {
      const suitX =
        (canvas.width / (availableSuits.length + 1)) * (index + 1) -
        heroSize / 2;
      if (
        mouseX >= suitX &&
        mouseX <= suitX + heroSize &&
        mouseY >= 90 &&
        mouseY <= 90 + heroSize
      ) {
        suitSelected = suitImage;
        hero.image = suitImage;
        // Proceed to start the main game loop or next step
        // For example:
        // startGame();
        return;
      }
    });
  }
});

// Start screen
function drawStartScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw "Heroes Unleashed" title
  ctx.font = "bold 60px Raleway"; // Use Raleway font
  ctx.fillStyle = "black"; // Title color
  ctx.textAlign = "center"; // Center the text
  ctx.fillText("Heroes Unleashed", canvas.width / 2, 70); // Adjusted position

  ctx.font = "30px Raleway"; // Smaller font for welcome message
  ctx.fillText("Welcome to the Game!", canvas.width / 2, 110); // Adjusted position

  // Draw the "Start" button
  ctx.fillStyle = "green";
  ctx.fillRect(canvas.width / 2 - 100, 130, 200, 50);
  ctx.fillStyle = "black";
  ctx.font = "30px Raleway"; // Ensure consistent font
  ctx.fillText("Start", canvas.width / 2, 165); // Centered text within the button
}

function createHeroObjects() {
  const spacing = 40; // Space between each hero
  const heroWidth = heroSize * 1.5;

  // Calculate the maximum number of heroes that can fit per row
  const numPerRow = Math.floor(
    (canvas.width + spacing) / (heroWidth + spacing)
  );

  heroData.forEach((hero, index) => {
    const row = Math.floor(index / numPerRow);
    const col = index % numPerRow;

    // Calculate the number of heroes in the current row to center it properly
    const currentRowCount = Math.min(
      heroData.length - row * numPerRow,
      numPerRow
    );
    const totalRowWidth =
      currentRowCount * heroWidth + (currentRowCount - 1) * spacing;
    const startX = (canvas.width - totalRowWidth) / 2; // Centering the row

    const x = startX + col * (heroWidth + spacing);
    const y = 150 + row * (heroWidth + spacing); // Adjusted y-position for better spacing

    const width = heroWidth;
    const height = heroWidth; // Keep the aspect ratio square
    const image = hero.selectImage; // Selection image
    const gameObject = new GameObject(x, y, width, height, image);
    heroObjects.push({
      hero: hero,
      gameObject: gameObject,
    });
  });
}

function drawCharacterSelect() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "30px Raleway";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("Select Your Character", canvas.width / 2, 50);

  // Create hero objects if not already created
  if (heroObjects.length === 0) {
    createHeroObjects();
  }

  heroObjects.forEach((heroObj) => {
    const hero = heroObj.hero;
    const gameObject = heroObj.gameObject;

    // Center the character name above each image
    ctx.font = "20px Raleway"; // Adjust the font size for names
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(
      hero.name,
      gameObject.x + gameObject.width / 2,
      gameObject.y - 10 // Position text slightly above the image
    );

    // Draw border and image for each hero
    ctx.strokeStyle = hero.color || "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      gameObject.x,
      gameObject.y,
      gameObject.width,
      gameObject.height
    );
    ctx.drawImage(
      gameObject.image,
      gameObject.x,
      gameObject.y,
      gameObject.width,
      gameObject.height
    );
  });
}

// Suit selection screen
function drawSuitSelect() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "30px Raleway";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("Select a Suit", canvas.width / 2, 50);

  const spacing = 20;
  const suitWidth = heroSize;
  const numPerRow = Math.floor(
    (canvas.width + spacing) / (suitWidth + spacing)
  );

  availableSuits.forEach((suitImage, index) => {
    const row = Math.floor(index / numPerRow);
    const col = index % numPerRow;
    const x = spacing + col * (suitWidth + spacing);
    const y = 90 + row * (suitWidth + spacing);

    ctx.drawImage(suitImage, x, y, suitWidth, suitWidth);
  });
}
