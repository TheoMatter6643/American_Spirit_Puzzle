const board = document.getElementById("board");
const piecesContainer = document.getElementById("pieces");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

const pieceSize = 150;
const rows = 4;
const cols = 6;

let draggedPiece = null;
let lastX = 0;
let lastY = 0;
let lastTime = 0;
let speed = 0;

// Create grid cells
const cells = [];
for (let r = 1; r <= rows; r++) {
  for (let c = 1; c <= cols; c++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.style.left = (c - 1) * pieceSize + "px";
    cell.style.top = (r - 1) * pieceSize + "px";
    cell.dataset.row = r;
    cell.dataset.col = c;
    board.appendChild(cell);
    cells.push(cell);
  }
}

function getClosestCell(x, y) {
  let best = null;
  let bestDist = Infinity;

  cells.forEach(cell => {
    const rect = cell.getBoundingClientRect();
    const cx = rect.left + pieceSize / 2;
    const cy = rect.top + pieceSize / 2;

    const dist = Math.hypot(cx - x, cy - y);

    if (dist < bestDist) {
      bestDist = dist;
      best = cell;
    }
  });

  return bestDist < 80 ? best : null; // snap radius
}

function checkCorrect() {
  let correct = 0;

  cells.forEach(cell => {
    const piece = cell.querySelector(".piece");
    if (!piece) return;

    const correctId = `r${cell.dataset.row}c${cell.dataset.col}`;
    if (piece.dataset.id === correctId) correct++;
  });

  if (correct === rows * cols) {
    statusEl.textContent = "🎉 Correct!";
  } else {
    statusEl.textContent = "";
  }
}

function init() {
  const pieces = document.querySelectorAll(".piece");

  pieces.forEach(piece => {
    piece.addEventListener("dragstart", e => {
      draggedPiece = piece;

      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = performance.now();

      e.dataTransfer.setData("text/plain", "");
    });

    piece.addEventListener("drag", e => {
      if (!draggedPiece || (e.clientX === 0 && e.clientY === 0)) return;

      const now = performance.now();
      const dt = now - lastTime;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      speed = Math.sqrt(dx * dx + dy * dy) / dt;

      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
    });

    piece.addEventListener("dragend", () => {
      draggedPiece = null;
    });
  });

  board.addEventListener("dragover", e => e.preventDefault());

  board.addEventListener("drop", e => {
    e.preventDefault();
    if (!draggedPiece) return;

    const closest = getClosestCell(e.clientX, e.clientY);

    if (closest && speed < 0.5) {
      const existing = closest.querySelector(".piece");
      if (existing) piecesContainer.appendChild(existing);

      closest.appendChild(draggedPiece);
      draggedPiece.style.position = "absolute";
      draggedPiece.style.left = "0";
      draggedPiece.style.top = "0";

      checkCorrect();
    } else {
      piecesContainer.appendChild(draggedPiece);
      draggedPiece.style.position = "relative";
      draggedPiece.style.left = "0";
      draggedPiece.style.top = "0";
    }

    draggedPiece = null;
  });
}

resetBtn.addEventListener("click", () => {
  const pieces = document.querySelectorAll(".piece");
  pieces.forEach(piece => {
    piecesContainer.appendChild(piece);
    piece.style.position = "relative";
    piece.style.left = "0";
    piece.style.top = "0";
  });
  statusEl.textContent = "";
});

init();
