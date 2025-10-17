const STATES = {
  START: "start",
  MAP: "map",
  BATTLE: "battle",
  PUZZLE: "puzzle"
};

const STORAGE_KEY = "dungeonQuestSave";

let appState = STATES.START;
let uiElements = [];
let roomsData;
let monstersData;
let puzzlesData;

let dungeon;
let currentCell;
let previousCell;
let roomMessage = "";
let activeMonster = null;
let activePuzzle = null;
let puzzleFeedback = "";

let mapOffset;
let isDragging = false;
let lastDragPoint = null;
let dragMoved = false;

function preload() {
  roomsData = loadJSON("data/rooms.json");
  monstersData = loadJSON("data/monsters.json");
  puzzlesData = loadJSON("data/puzzles.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Trebuchet MS");
  mapOffset = createVector(0, 0);
  buildStartUI();
  const hasSave = !!localStorage.getItem(STORAGE_KEY);
  toggleContinueButton(hasSave);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(16, 16, 30);
  switch (appState) {
    case STATES.START:
      drawStartScreen();
      break;
    case STATES.MAP:
      drawMapScreen();
      drawRoomOverlay();
      break;
    case STATES.BATTLE:
      drawBattleScreen();
      break;
    case STATES.PUZZLE:
      drawPuzzleScreen();
      break;
  }
}

// UI MANAGEMENT -------------------------------------------------------------
function clearUI() {
  uiElements.forEach((el) => el.remove());
  uiElements = [];
}

function buildStartUI() {
  clearUI();
  appState = STATES.START;
  const newBtn = createButton("New Game");
  styleUIButton(newBtn);
  newBtn.mousePressed(startNewGame);
  uiElements.push(newBtn);

  const continueBtn = createButton("Continue");
  continueBtn.id("continue-btn");
  styleUIButton(continueBtn);
  continueBtn.mousePressed(loadSavedGame);
  uiElements.push(continueBtn);

  const resetBtn = createButton("Reset");
  styleUIButton(resetBtn);
  resetBtn.mousePressed(resetGame);
  uiElements.push(resetBtn);

  positionButtons(uiElements, height * 0.55);
}

function toggleContinueButton(isEnabled) {
  const btn = select("#continue-btn");
  if (!btn) return;
  btn.attribute("disabled", isEnabled ? null : true);
  btn.style("opacity", isEnabled ? "1" : "0.4");
}

function buildBattleUI() {
  clearUI();
  const victoryBtn = createButton("Monster Defeated");
  styleUIButton(victoryBtn, true);
  victoryBtn.mousePressed(() => resolveBattle(true));
  uiElements.push(victoryBtn);

  const retreatBtn = createButton("Retreat");
  styleUIButton(retreatBtn, true);
  retreatBtn.mousePressed(() => resolveBattle(false));
  uiElements.push(retreatBtn);

  positionButtons(uiElements, height * 0.75);
}

function buildPuzzleUI() {
  clearUI();
  if (!activePuzzle) return;
  activePuzzle.options.forEach((option) => {
    const btn = createButton(option);
    styleUIButton(btn, true);
    btn.mousePressed(() => resolvePuzzle(option));
    uiElements.push(btn);
  });
  positionButtons(uiElements, height * 0.7);
}

function buildMapUI() {
  clearUI();
  // No persistent buttons on map; interactions handled via canvas.
}

function styleUIButton(btn, fillWidth = false) {
  btn.addClass("ui-button");
  if (fillWidth) {
    btn.style("width", "min(320px, 80vw)");
  } else {
    btn.style("width", "min(220px, 70vw)");
  }
}

function positionButtons(buttons, startY) {
  const spacing = 70;
  buttons.forEach((btn, index) => {
    const btnWidth = btn.elt.offsetWidth || 220;
    btn.position((width - btnWidth) / 2, startY + index * spacing);
  });
}

// START SCREEN -------------------------------------------------------------
function drawStartScreen() {
  push();
  textAlign(CENTER, CENTER);
  fill(244, 185, 66);
  textSize(width < 600 ? 36 : 60);
  text("Dungeon Quest", width / 2, height * 0.25);
  fill(230, 230, 245);
  textSize(width < 600 ? 18 : 24);
  text("A Hybrid Board & Digital Dungeon Crawl", width / 2, height * 0.32);
  pop();

  push();
  noFill();
  stroke(100, 170, 255);
  strokeWeight(3);
  const radius = min(width, height) * 0.18;
  translate(width / 2, height * 0.42);
  ellipse(0, 0, radius * 2, radius * 2);
  strokeWeight(2);
  line(-radius * 0.6, radius * 0.6, radius * 0.6, -radius * 0.6);
  line(-radius * 0.6, -radius * 0.6, radius * 0.6, radius * 0.6);
  pop();
}

// GAME MANAGEMENT ----------------------------------------------------------
function startNewGame() {
  generateDungeon();
  currentCell = dungeon.startCell;
  currentCell.discovered = true;
  roomMessage = currentCell.room.description;
  previousCell = null;
  appState = STATES.MAP;
  mapOffset = createVector(
    width / 2 - (currentCell.pixel.x + dungeon.cellSize / 2),
    height / 2 - (currentCell.pixel.y + dungeon.cellSize / 2)
  );
  buildMapUI();
  saveGame();
}

function loadSavedGame() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const parsed = JSON.parse(raw);
  dungeon = parsed.dungeon;

  const cellMap = new Map();
  dungeon.cells = dungeon.cells.map((cell) => {
    cell.pixel = createVector(cell.pixel.x, cell.pixel.y);
    cellMap.set(cell.id, cell);
    return cell;
  });
  dungeon.grid = dungeon.grid.map((row) =>
    row.map((cell) => (cell ? cellMap.get(cell.id) : null))
  );

  currentCell = cellMap.get(parsed.currentCellId);
  previousCell = parsed.previousCellId ? cellMap.get(parsed.previousCellId) : null;
  roomMessage = parsed.roomMessage || "";
  mapOffset = createVector(parsed.mapOffset.x, parsed.mapOffset.y);

  appState = STATES.MAP;
  buildMapUI();
}

function resetGame() {
  localStorage.removeItem(STORAGE_KEY);
  toggleContinueButton(false);
  buildStartUI();
}

function saveGame() {
  if (!dungeon || !currentCell) return;
  const payload = {
    dungeon,
    currentCellId: currentCell.id,
    previousCellId: previousCell ? previousCell.id : null,
    roomMessage,
    mapOffset: { x: mapOffset.x, y: mapOffset.y }
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  toggleContinueButton(true);
}

// DUNGEON GENERATION ------------------------------------------------------
function generateDungeon() {
  const size = 7;
  const cellSize = min(width, height) / 6;
  const cells = [];
  const grid = Array.from({ length: size }, () => Array(size).fill(null));
  const center = floor(size / 2);
  const startTemplate = roomsData.rooms.find((r) => r.id === "start");
  const startCell = createCell(center, center, startTemplate, cellSize);
  startCell.discovered = true;
  grid[center][center] = startCell;
  cells.push(startCell);

  const queue = [startCell];
  while (queue.length && cells.length < 18) {
    const base = queue.shift();
    const directions = shuffleDirections();
    directions.forEach((dir) => {
      const nx = base.grid.x + dir.dx;
      const ny = base.grid.y + dir.dy;
      if (nx < 0 || ny < 0 || nx >= size || ny >= size) return;
      if (grid[ny][nx]) {
        connectCells(base, grid[ny][nx], dir.name);
        return;
      }
      const template = randomRoomTemplate();
      const newCell = createCell(nx, ny, template, cellSize);
      grid[ny][nx] = newCell;
      cells.push(newCell);
      connectCells(base, newCell, dir.name);
      queue.push(newCell);
    });
  }

  dungeon = {
    size,
    cellSize,
    grid,
    cells,
    startCell
  };
}

function createCell(x, y, template, cellSize) {
  const id = `${x}-${y}`;
  return {
    id,
    grid: { x, y },
    pixel: createVector(x * cellSize, y * cellSize),
    room: Object.assign({}, template),
    doors: { north: false, east: false, south: false, west: false },
    discovered: false,
    cleared: !(template.type === "monster" || template.type === "puzzle")
  };
}

function connectCells(a, b, direction) {
  const opposite = { north: "south", south: "north", east: "west", west: "east" };
  a.doors[direction] = true;
  b.doors[opposite[direction]] = true;
}

function shuffleDirections() {
  const dirs = [
    { name: "north", dx: 0, dy: -1 },
    { name: "south", dx: 0, dy: 1 },
    { name: "east", dx: 1, dy: 0 },
    { name: "west", dx: -1, dy: 0 }
  ];
  for (let i = dirs.length - 1; i > 0; i -= 1) {
    const j = floor(random() * (i + 1));
    [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
  }
  return dirs;
}

function randomRoomTemplate() {
  const pool = roomsData.rooms.filter((r) => r.id !== "start");
  return random(pool);
}

function getCellById(id) {
  return dungeon.cells.find((c) => c.id === id) || null;
}

// MAP SCREEN ---------------------------------------------------------------
function drawMapScreen() {
  push();
  translate(mapOffset.x, mapOffset.y);
  dungeon.cells.forEach((cell) => {
    drawCell(cell);
  });
  pop();

  drawCurrentRoomInfo();
}

function drawCell(cell) {
  const { x, y } = cell.pixel;
  const size = dungeon.cellSize * 0.92;
  const margin = dungeon.cellSize * 0.04;
  push();
  translate(x, y);
  if (cell === currentCell) {
    fill(60, 160, 255);
  } else if (cell.discovered) {
    fill(90, 90, 130);
  } else {
    fill(40, 40, 70);
  }
  stroke(200, 200, 240);
  strokeWeight(2);
  rect(margin, margin, size, size, 12);

  // Draw doors
  strokeWeight(6);
  stroke(230, 200, 90);
  const doorSize = size * 0.2;
  if (cell.doors.north) line(margin + size / 2 - doorSize / 2, margin, margin + size / 2 + doorSize / 2, margin);
  if (cell.doors.south) line(margin + size / 2 - doorSize / 2, margin + size, margin + size / 2 + doorSize / 2, margin + size);
  if (cell.doors.east) line(margin + size, margin + size / 2 - doorSize / 2, margin + size, margin + size / 2 + doorSize / 2);
  if (cell.doors.west) line(margin, margin + size / 2 - doorSize / 2, margin, margin + size / 2 + doorSize / 2);

  pop();
}

function drawCurrentRoomInfo() {
  push();
  fill(12, 12, 24, 220);
  noStroke();
  rect(0, height * 0.72, width, height * 0.28);
  fill(255);
  textAlign(LEFT, TOP);
  textSize(width < 600 ? 16 : 20);
  const padding = 24;
  text(`Current Room: ${currentCell.room.name}`, padding, height * 0.74);
  textWrap(WORD);
  text(roomMessage || "", padding, height * 0.79, width - padding * 2);
  pop();
}

function drawRoomOverlay() {
  push();
  fill(255);
  textSize(16);
  textAlign(RIGHT, TOP);
  text("Drag to pan. Tap a connected room to enter.", width - 20, 20);
  pop();
}

// MAP INPUTS ---------------------------------------------------------------
function mousePressed() {
  if (appState !== STATES.MAP) return;
  isDragging = true;
  dragMoved = false;
  lastDragPoint = createVector(mouseX, mouseY);
}

function mouseDragged() {
  if (!isDragging) return;
  const current = createVector(mouseX, mouseY);
  const delta = p5.Vector.sub(current, lastDragPoint);
  if (delta.mag() > 2) dragMoved = true;
  mapOffset.add(delta);
  lastDragPoint = current;
}

function mouseReleased() {
  if (appState !== STATES.MAP) return;
  isDragging = false;
  if (dragMoved) return;
  const clickedCell = cellFromScreen(mouseX, mouseY);
  if (clickedCell && isAdjacentRoom(clickedCell)) {
    enterRoom(clickedCell);
  }
}

function touchStarted() {
  mousePressed();
  return false;
}

function touchMoved() {
  mouseDragged();
  return false;
}

function touchEnded() {
  mouseReleased();
  return false;
}

function cellFromScreen(sx, sy) {
  const tx = sx - mapOffset.x;
  const ty = sy - mapOffset.y;
  const size = dungeon.cellSize;
  const gx = floor(tx / size);
  const gy = floor(ty / size);
  if (gx < 0 || gy < 0 || gx >= dungeon.size || gy >= dungeon.size) return null;
  return dungeon.grid[gy][gx];
}

function isAdjacentRoom(target) {
  if (!target || target === currentCell) return false;
  const dx = target.grid.x - currentCell.grid.x;
  const dy = target.grid.y - currentCell.grid.y;
  if (abs(dx) + abs(dy) !== 1) return false;
  const direction = dx === 1 ? "east" : dx === -1 ? "west" : dy === 1 ? "south" : "north";
  return currentCell.doors[direction];
}

function enterRoom(cell) {
  previousCell = currentCell;
  currentCell = cell;
  currentCell.discovered = true;
  roomMessage = currentCell.room.description;
  handleRoomContent(cell);
  saveGame();
}

function handleRoomContent(cell) {
  switch (cell.room.type) {
    case "monster":
      if (cell.cleared) {
        roomMessage += "\nThe lair is empty now; the threat has passed.";
        appState = STATES.MAP;
        buildMapUI();
        break;
      }
      activeMonster = pickMonster();
      appState = STATES.BATTLE;
      buildBattleUI();
      break;
    case "puzzle":
      if (cell.cleared) {
        roomMessage += "\nThe puzzle stands solved, its magic quiet.";
        appState = STATES.MAP;
        buildMapUI();
        break;
      }
      activePuzzle = pickPuzzle();
      puzzleFeedback = "";
      appState = STATES.PUZZLE;
      buildPuzzleUI();
      break;
    case "treasure":
      roomMessage += "\nYou carefully record the treasure on your sheet.";
      cell.cleared = true;
      appState = STATES.MAP;
      buildMapUI();
      break;
    case "special":
      roomMessage += "\nA pleasant warmth fills the party with hope.";
      cell.cleared = true;
      appState = STATES.MAP;
      buildMapUI();
      break;
    default:
      appState = STATES.MAP;
      buildMapUI();
      break;
  }
}

function pickMonster() {
  const pool = monstersData.monsters.filter((m) => m.level <= 3);
  return Object.assign({}, random(pool));
}

function pickPuzzle() {
  return Object.assign({}, random(puzzlesData.puzzles));
}

// BATTLE ------------------------------------------------------------------
function drawBattleScreen() {
  background(20, 10, 35);
  if (!activeMonster) return;
  push();
  textAlign(CENTER, TOP);
  fill(240, 220, 150);
  textSize(width < 600 ? 30 : 40);
  text("Monster Encounter", width / 2, height * 0.1);
  fill(255);
  textSize(width < 600 ? 24 : 30);
  text(activeMonster.name, width / 2, height * 0.2);
  textSize(width < 600 ? 16 : 20);
  text(activeMonster.description, width / 2, height * 0.27, width * 0.8);
  pop();

  push();
  const boxW = min(300, width * 0.6);
  const boxH = min(300, height * 0.4);
  translate(width / 2 - boxW / 2, height * 0.38);
  fill(50, 60, 110);
  stroke(180, 200, 240);
  strokeWeight(3);
  rect(0, 0, boxW, boxH, 18);
  fill(245, 200, 90);
  noStroke();
  ellipse(boxW / 2, boxH / 2, boxW * 0.6, boxH * 0.6);
  pop();

  push();
  fill(220, 220, 250);
  textAlign(CENTER, TOP);
  textSize(width < 600 ? 18 : 22);
  text(`Level ${activeMonster.level} • Life ${activeMonster.life} • Attack ${activeMonster.attack}`, width / 2, height * 0.65);
  pop();
}

function resolveBattle(victory) {
  if (!activeMonster) return;
  if (victory) {
    roomMessage = `The party defeats the ${activeMonster.name}! Record loot on your sheet.`;
    currentCell.cleared = true;
  } else {
    roomMessage = "The party retreats to safety. The threat remains.";
    if (previousCell) {
      const temp = currentCell;
      currentCell = previousCell;
      previousCell = temp;
    }
  }
  activeMonster = null;
  appState = STATES.MAP;
  buildMapUI();
  saveGame();
}

// PUZZLES -----------------------------------------------------------------
function drawPuzzleScreen() {
  background(18, 28, 50);
  if (!activePuzzle) return;
  push();
  fill(240, 215, 140);
  textAlign(CENTER, TOP);
  textSize(width < 600 ? 30 : 36);
  text("Puzzle Challenge", width / 2, height * 0.1);
  fill(230, 230, 255);
  textSize(width < 600 ? 18 : 22);
  text(activePuzzle.prompt, width / 2, height * 0.2, width * 0.85);
  if (puzzleFeedback) {
    fill(255, 180, 160);
    textSize(width < 600 ? 16 : 18);
    text(puzzleFeedback, width / 2, height * 0.45, width * 0.8);
  }
  pop();
}

function resolvePuzzle(answer) {
  if (!activePuzzle) return;
  const correct = answer === activePuzzle.answer;
  if (correct) {
    roomMessage = `${activePuzzle.successText} Record the reward on your sheet.`;
    currentCell.cleared = true;
    activePuzzle = null;
    puzzleFeedback = "";
    appState = STATES.MAP;
    buildMapUI();
    saveGame();
  } else {
    puzzleFeedback = activePuzzle.failureText;
    buildPuzzleUI();
  }
}
