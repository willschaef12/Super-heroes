// Create and configure the canvas
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

// Ensure the canvas fills the screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawStartScreen(); // Redraw after resizing
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Initial resize to fit the screen

const heroSize = 100; // Adjusted for better scaling
const villainSize = 100;
const webSize = 20;

// Game state
let gameStarted = false;
let characterSelected = null;
let suitSelected = null;
let availableSuits = [];
let hero;

// Heroes and images
const heroNames = ["Spiderman", "Wolverine", "Batman", "Deadpool", "Gambit"];
const imageFilenames = heroNames.flatMap((heroName) => {
  const heroKey = heroName.toLowerCase();
  return [
    `${heroKey}.png`,
    `${heroKey}_select.png`,
    ...Array.from({ length: 3 }, (_, i) => `${heroKey}_suit${i + 1}.png`),
  ];
});
const loadedImages = {};
let imagesLoaded = 0;

// Load images
function loadImages() {
  imageFilenames.forEach((filename) => {
    const img = new Image();
    img.src = `assets/${filename}`;
    img.onload = () => {
      loadedImages[filename] = img;
      imagesLoaded++;
      if (imagesLoaded === imageFilenames.length) {
        buildHeroData();
        drawStartScreen();
      }
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${filename}`);
      imagesLoaded++;
      if (imagesLoaded === imageFilenames.length) {
        buildHeroData();
        drawStartScreen();
      }
    };
  });
}

// Hero data
const heroData = [];
function buildHeroData() {
  heroNames.forEach((heroName) => {
    const heroKey = heroName.toLowerCase();
    const mainImage = loadedImages[`${heroKey}.png`];
    const selectImage = loadedImages[`${heroKey}_select.png`];
    const suits = Array.from({ length: 3 }, (_, i) => loadedImages[`${heroKey}_suit${i + 1}.png`]);
    heroData.push({ name: heroName, mainImage, selectImage, suits });
  });
}

// Draw start screen
function drawStartScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 40px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("Heroes Unleashed", canvas.width / 2, canvas.height / 4);
  ctx.font = "20px Arial";
  ctx.fillText("Welcome to the Game!", canvas.width / 2, canvas.height / 4 + 50);

  ctx.fillStyle = "green";
  ctx.fillRect(canvas.width / 2 - 75, canvas.height / 2 - 25, 150, 50);
  ctx.fillStyle = "white";
  ctx.font = "25px Arial";
  ctx.fillText("Start", canvas.width / 2, canvas.height / 2 + 10);
}

// Draw character selection screen
function drawCharacterSelect() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "30px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("Select Your Character", canvas.width / 2, 50);

  const spacing = 40;
  const heroWidth = heroSize * 1.5;
  const totalHeroes = heroData.length;
  const totalWidth = totalHeroes * heroWidth + (totalHeroes - 1) * spacing;
  const startX = (canvas.width - totalWidth) / 2;

  heroData.forEach((hero, index) => {
    const x = startX + index * (heroWidth + spacing);
    const y = 100;

    ctx.drawImage(hero.selectImage, x, y, heroWidth, heroWidth);
    ctx.font = "16px Arial";
    ctx.fillText(hero.name, x + heroWidth / 2, y + heroWidth + 20);
  });
}

// Draw suit selection screen
function drawSuitSelect() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "30px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("Choose Your Suit", canvas.width / 2, 50);

  const spacing = 30;
  const suitWidth = heroSize;
  const startX = (canvas.width - (availableSuits.length * (suitWidth + spacing) - spacing)) / 2;

  availableSuits.forEach((suitImage, index) => {
    const x = startX + index * (suitWidth + spacing);
    const y = 100;
    ctx.drawImage(suitImage, x, y, suitWidth, suitWidth);
  });
}

// Click handler
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (!gameStarted && mouseX >= canvas.width / 2 - 75 && mouseX <= canvas.width / 2 + 75 && mouseY >= canvas.height / 2 - 25 && mouseY <= canvas.height / 2 + 25) {
    gameStarted = true;
    drawCharacterSelect();
    return;
  }

  if (gameStarted && !characterSelected) {
    heroData.forEach((hero, index) => {
      const spacing = 40;
      const heroWidth = heroSize * 1.5;
      const startX = (canvas.width - (heroData.length * heroWidth + (heroData.length - 1) * spacing)) / 2;
      const x = startX + index * (heroWidth + spacing);
      const y = 100;

      if (mouseX >= x && mouseX <= x + heroWidth && mouseY >= y && mouseY <= y + heroWidth) {
        characterSelected = hero;
        availableSuits = hero.suits.filter((suit) => suit);
        drawSuitSelect();
      }
    });
    return;
  }

  if (characterSelected && !suitSelected) {
    const suitWidth = heroSize;
    const spacing = 30;
    const startX = (canvas.width - (availableSuits.length * (suitWidth + spacing) - spacing)) / 2;

    availableSuits.forEach((suitImage, index) => {
      const x = startX + index * (suitWidth + spacing);
      const y = 100;

      if (mouseX >= x && mouseX <= x + suitWidth && mouseY >= y && mouseY <= y + suitWidth) {
        suitSelected = suitImage;
        console.log("Suit selected:", suitSelected);
        // Add game logic here
      }
    });
  }
});

// Load images and start the game
loadImages();
