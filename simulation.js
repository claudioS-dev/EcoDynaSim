// Constants and configurations
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;
const ANIMAL_SIZE = 40;
const ANIMAL_MARGIN = 10;

// Default Prey-Predator model parameters
let PREY_GROWTH_RATE = 0.3;
let PREDATION_RATE = 0.0008;
let PREDATOR_DEATH_RATE = 0.15;
let PREDATOR_GROWTH_RATE = 0.0003;
let CARRYING_CAPACITY = 1200;
let INITIAL_PREY = 500;
let INITIAL_PREDATOR = 50;

// Get the canvas and its context
let canvas;
let ctx;

// Load images
const backgroundImage = new Image();
const hareImage = new Image();
const foxImage = new Image();

// Game state
let hares = [];
let foxes = [];
let startTime;
let currentTime = 0;
let lastUpdateTime = 0;
let dataLog = [];

// Chart configuration
let populationChart;

// View state
let isSimulationView = true;

// Animal class
class Animal {
  constructor(x, y, isPredator) {
    this.x = x;
    this.y = y;
    this.isPredator = isPredator;
  }

  move() {
    this.x += Math.random() * 4 - 2;
    this.y += Math.random() * 4 - 2;
    this.x = Math.max(
      ANIMAL_MARGIN,
      Math.min(CANVAS_WIDTH - ANIMAL_MARGIN - ANIMAL_SIZE, this.x)
    );
    this.y = Math.max(
      ANIMAL_MARGIN,
      Math.min(CANVAS_HEIGHT - ANIMAL_MARGIN - ANIMAL_SIZE, this.y)
    );
  }

  draw() {
    ctx.drawImage(
      this.isPredator ? foxImage : hareImage,
      this.x,
      this.y,
      ANIMAL_SIZE,
      ANIMAL_SIZE
    );
  }
}

// Game functions
function addAnimals(quantity, isPredator) {
  const array = isPredator ? foxes : hares;
  for (let i = 0; i < quantity; i++) {
    const x =
      Math.random() * (CANVAS_WIDTH - ANIMAL_SIZE - 2 * ANIMAL_MARGIN) +
      ANIMAL_MARGIN;
    const y =
      Math.random() * (CANVAS_HEIGHT - ANIMAL_SIZE - 2 * ANIMAL_MARGIN) +
      ANIMAL_MARGIN;
    array.push(new Animal(x, y, isPredator));
  }
}

function updatePopulations() {
  const H = hares.length;
  const F = foxes.length;

  const randomFactor = () => 1 + (Math.random() - 0.5) * 0.2; // ±10% variation

  const dHdt =
    PREY_GROWTH_RATE * H * (1 - H / CARRYING_CAPACITY) * randomFactor() -
    PREDATION_RATE * H * F * randomFactor();
  const dFdt =
    PREDATOR_GROWTH_RATE * H * F * randomFactor() -
    PREDATOR_DEATH_RATE * F * randomFactor();

  if (dHdt > 0) {
    addAnimals(Math.floor(dHdt), false);
  } else if (dHdt < 0) {
    hares.splice(0, Math.min(Math.abs(Math.floor(dHdt)), hares.length));
  }

  if (dFdt > 0) {
    addAnimals(Math.floor(dFdt), true);
  } else if (dFdt < 0) {
    foxes.splice(0, Math.min(Math.abs(Math.floor(dFdt)), foxes.length));
  }

  // Log data
  dataLog.push({
    time: Math.floor(currentTime),
    hares: H,
    foxes: F,
    dHdt: dHdt.toFixed(2),
    dFdt: dFdt.toFixed(2),
  });
}

function randomEvent() {
  if (Math.random() < 0.05) {
    // 5% chance of an event
    const eventType = Math.random();
    if (eventType < 0.5) {
      // Drought: reduces hare population
      hares = hares.slice(0, Math.floor(hares.length * 0.9));
      console.log("¡Sequía! La población de liebres se reduce en un 10%");
    } else {
      // Disease: reduces fox population
      foxes = foxes.slice(0, Math.floor(foxes.length * 0.9));
      console.log("¡Enfermedad! La población de zorros se reduce en un 10%");
    }
  }
}

function drawText(text, x, y) {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText(text, x, y);
}

function setupParameterInputs() {
  const container = document.getElementById("parameterInputs");
  if (!container) {
    console.error("El elemento #parameterInputs no se encontró en el DOM");
    return;
  }

  const parameterInputs = [
    {
      id: "preyGrowthRate",
      label: "Tasa de crecimiento de liebres",
      default: PREY_GROWTH_RATE,
    },
    {
      id: "predationRate",
      label: "Tasa de depredación",
      default: PREDATION_RATE,
    },
    {
      id: "predatorDeathRate",
      label: "Tasa de muerte de zorros",
      default: PREDATOR_DEATH_RATE,
    },
    {
      id: "predatorGrowthRate",
      label: "Tasa de crecimiento de zorros",
      default: PREDATOR_GROWTH_RATE,
    },
    {
      id: "carryingCapacity",
      label: "Capacidad de carga",
      default: CARRYING_CAPACITY,
    },
    {
      id: "initialPrey",
      label: "Población inicial de liebres",
      default: INITIAL_PREY,
    },
    {
      id: "initialPredator",
      label: "Población inicial de zorros",
      default: INITIAL_PREDATOR,
    },
  ];

  parameterInputs.forEach((param) => {
    const div = document.createElement("div");
    div.innerHTML = `
            <label for="${param.id}">${param.label}:</label>
            <input type="number" id="${param.id}" value="${param.default}" step="0.0001">
        `;
    container.appendChild(div);
  });

  const startButton = document.createElement("button");
  startButton.textContent = "Iniciar Simulación";
  startButton.onclick = startSimulation;
  container.appendChild(startButton);
}

function setupChart() {
  const chartCanvas = document.getElementById("populationChart");
  if (!chartCanvas) {
    console.error("El elemento #populationChart no se encontró en el DOM");
    return;
  }

  const ctx = chartCanvas.getContext("2d");
  populationChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Liebres",
          borderColor: "rgb(75, 192, 192)",
          data: [],
          fill: false,
        },
        {
          label: "Zorros",
          borderColor: "rgb(255, 99, 132)",
          data: [],
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: "Población de Liebres y Zorros a lo largo del tiempo",
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Tiempo (meses)",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Población",
          },
        },
      },
    },
  });
}

function updateChart() {
  if (dataLog.length > 0) {
    const latestData = dataLog[dataLog.length - 1];
    populationChart.data.labels.push(latestData.time);
    populationChart.data.datasets[0].data.push(latestData.hares);
    populationChart.data.datasets[1].data.push(latestData.foxes);

    // Limit displayed data to last 100 points
    if (populationChart.data.labels.length > 100) {
      populationChart.data.labels.shift();
      populationChart.data.datasets.forEach((dataset) => dataset.data.shift());
    }

    populationChart.update();
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.drawImage(backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  [...hares, ...foxes].forEach((animal) => {
    animal.move();
    animal.draw();
  });

  currentTime = (Date.now() - startTime) / 1000;
  if (currentTime - lastUpdateTime >= 1) {
    updatePopulations();
    randomEvent();
    updateChart();
    lastUpdateTime = currentTime;
  }

  // Ajusta el tamaño y posición del texto
  ctx.font = "18px Arial";
  drawText(`Tiempo: ${Math.floor(currentTime)} meses`, 10, 25);
  drawText(`Liebres: ${hares.length}`, 10, 50);
  drawText(`Zorros: ${foxes.length}`, 10, 75);

  requestAnimationFrame(gameLoop);
}

function startSimulation() {
  PREY_GROWTH_RATE = parseFloat(
    document.getElementById("preyGrowthRate").value
  );
  PREDATION_RATE = parseFloat(document.getElementById("predationRate").value);
  PREDATOR_DEATH_RATE = parseFloat(
    document.getElementById("predatorDeathRate").value
  );
  PREDATOR_GROWTH_RATE = parseFloat(
    document.getElementById("predatorGrowthRate").value
  );
  CARRYING_CAPACITY = parseFloat(
    document.getElementById("carryingCapacity").value
  );
  INITIAL_PREY = parseInt(document.getElementById("initialPrey").value);
  INITIAL_PREDATOR = parseInt(document.getElementById("initialPredator").value);

  hares = [];
  foxes = [];
  dataLog = [];
  startTime = Date.now();
  addAnimals(INITIAL_PREY, false);
  addAnimals(INITIAL_PREDATOR, true);
  setupChart();
  gameLoop();
}

function toggleView() {
  const gameCanvas = document.getElementById("gameCanvas");
  const populationChart = document.getElementById("populationChart");
  const toggleBtn = document.getElementById("toggleView");

  if (isSimulationView) {
    gameCanvas.style.display = "none";
    populationChart.style.display = "block";
    toggleBtn.textContent = "Switch to Simulation";
  } else {
    gameCanvas.style.display = "block";
    populationChart.style.display = "none";
    toggleBtn.textContent = "Switch to Graph";
  }

  isSimulationView = !isSimulationView;
}

function showDataTable() {
  console.table(dataLog);
}

// Initialize UI and start the game
document.addEventListener("DOMContentLoaded", function () {
  canvas = document.getElementById("gameCanvas");
  if (!canvas) {
    console.error("El elemento #gameCanvas no se encontró en el DOM");
    return;
  }
  ctx = canvas.getContext("2d");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  setupParameterInputs();

  const toggleBtn = document.getElementById("toggleView");
  toggleBtn.addEventListener("click", toggleView);

  // Espera a que las imágenes se carguen antes de iniciar la simulación
  Promise.all([
    new Promise((resolve) => {
      backgroundImage.onload = resolve;
      backgroundImage.src = "img/background.png";
    }),
    new Promise((resolve) => {
      hareImage.onload = resolve;
      hareImage.src = "img/rabbit.png";
    }),
    new Promise((resolve) => {
      foxImage.onload = resolve;
      foxImage.src = "img/fox.png";
    }),
  ]).then(() => {
    console.log("Imágenes cargadas. Listo para iniciar la simulación.");
    // No inicies la simulación automáticamente, espera a que el usuario haga clic en el botón
  });
});
