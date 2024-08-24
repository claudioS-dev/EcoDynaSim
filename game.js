// Constants and configurations
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;
const EEVEE_SIZE = 60;
const EEVEE_MARGIN = 10;
const GROWTH_RATE = 0.15;
const CARRYING_CAPACITY = 200;

// Get the canvas and its context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load images
const backgroundImage = new Image();
backgroundImage.src = "img/background.png";
const eeveeImage = new Image();
eeveeImage.src = "img/evee.png";
const shinyEeveeImage = new Image();
shinyEeveeImage.src = "img/eveeShiny.png";

// Game state
let eevees = [];
let startTime;
let currentTime = 0;
let lastUpdateTime = 0;

// Eevee class
class Eevee {
  constructor(x, y, isShiny) {
    this.x = x;
    this.y = y;
    this.isShiny = isShiny;
  }

  move() {
    this.x += Math.random() * 2 - 1;
    this.y += Math.random() * 2 - 1;
    this.x = Math.max(
      EEVEE_MARGIN,
      Math.min(CANVAS_WIDTH - EEVEE_MARGIN - EEVEE_SIZE, this.x)
    );
    this.y = Math.max(
      EEVEE_MARGIN,
      Math.min(CANVAS_HEIGHT - EEVEE_MARGIN - EEVEE_SIZE, this.y)
    );
  }

  draw() {
    ctx.drawImage(
      this.isShiny ? shinyEeveeImage : eeveeImage,
      this.x,
      this.y,
      EEVEE_SIZE,
      EEVEE_SIZE
    );
  }
}

// Game functions
function addEevees(quantity) {
  for (let i = 0; i < quantity; i++) {
    const x =
      Math.random() * (CANVAS_WIDTH - EEVEE_SIZE - 2 * EEVEE_MARGIN) +
      EEVEE_MARGIN;
    const y =
      Math.random() * (CANVAS_HEIGHT - EEVEE_SIZE - 2 * EEVEE_MARGIN) +
      EEVEE_MARGIN;
    const isShiny = Math.random() < 0.1;
    eevees.push(new Eevee(x, y, isShiny));
  }
}

function updateEeveePopulation() {
  const P = eevees.length;
  const dPdt = GROWTH_RATE * P * (1 - P / CARRYING_CAPACITY);
  const newEevees = Math.max(0, Math.floor(dPdt));
  if (newEevees > 0 || Math.random() < dPdt - Math.floor(dPdt)) {
    addEevees(newEevees + 1);
  }
}

function drawText(text, x, y) {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText(text, x, y);
}

function gameLoop() {
  // Clear canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw background
  ctx.drawImage(backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Update and draw Eevees
  eevees.forEach((eevee) => {
    eevee.move();
    eevee.draw();
  });

  // Update time and Eevee population
  currentTime = (Date.now() - startTime) / 1000;
  if (currentTime - lastUpdateTime >= 1) {
    // Update every second
    updateEeveePopulation();
    lastUpdateTime = currentTime;
  }

  // Draw UI
  drawText(`Time: ${Math.floor(currentTime)} s`, 10, 30);
  drawText(`Eevees: ${eevees.length}`, 10, 60);

  // Continue the game loop
  requestAnimationFrame(gameLoop);
}

// Start the game
function startGame() {
  startTime = Date.now();
  addEevees(1); // Start with one Eevee
  gameLoop();
}

// Wait for images to load before starting the game
Promise.all([
  new Promise((resolve) => (backgroundImage.onload = resolve)),
  new Promise((resolve) => (eeveeImage.onload = resolve)),
  new Promise((resolve) => (shinyEeveeImage.onload = resolve)),
]).then(() => {
  startGame();
});
