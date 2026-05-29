const board = document.getElementById("board");
const piecesContainer = document.getElementById("pieces");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

const rows = 4;
const cols = 6;

let pieceSize = 0;
let cells = [];

let draggedPiece = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Map: piece -> { row, col } or null if in tray
const piecePositions = new Map();

// Map: "rXcY" -> piece OR null
const cellOccupancy = new Map();

function layoutBoard() {
  const rect = board.getBoundingClientRect();
  pieceSize = rect.width / cols;
  board.style.height = pieceSize * rows + "px";

  // Clear old cells
  cells.forEach(c => c.el.remove());
  cells = [];
  cellOccupancy.clear();

  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.style.left = (c - 1) * pieceSize + "px";
      cell.style.top = (r - 1) * pieceSize + "px";
      cell.style.width = pieceSize + "px";
      cell.style.height = pieceSize + "px";
      cell.dataset.row = r;
      cell.dataset.col = c;
      board.appendChild(cell);

      const key = `r${r}c${c}`;
      cellOccupancy.set(key, null);

      cells.push({
        el: cell,
        row: r,
        col: c,
        key
      });
    }
  }

  // Re-snap any pieces already on the board
  piecePositions.forEach((pos, piece) => {
    if (!pos) return;
    const cell = cells.find(c => c.row === pos.row && c.col === pos.col);
    if (cell) {
      cell.el.appendChild(piece);
      piece.style.position = "absolute";
      piece.style.left = "0px";
      piece.style.top = "0px";
      piece.style.width = "100%";
      piece.style.height = "100%";
      piece.style.zIndex = 1;

      cellOccupancy.set(cell.key, piece);
    }
  });
}

function getClosestCell(clientX, clientY) {
  const boardRect = board.getBoundingClientRect();
  const relX = clientX - boardRect.left;
  const relY = clientY - boardRect.top;

  let best = null;
  let bestDist = Infinity;

  cells.forEach(cell => {
    const cx = (cell.col - 1) * pieceSize + pieceSize / 2;
    const cy = (cell.row - 1) * pieceSize + pieceSize / 2;
    const dist = Math.hypot(cx - relX, cy - relY);
    if (dist < bestDist) {
      bestDist = dist;
      best = cell;
    }
  });

  const snapRadius = pieceSize * 0.5;
  return bestDist < snapRadius ? best : null;
}

function checkCorrect() {
  let correct = 0;

  cells.forEach(cell => {
    const piece = cellOccupancy.get(cell.key);
    if (!piece) return;
    const correctId = `r${cell.row}c${cell.col}`;
    if (piece.dataset.id === correctId) correct++;
  });

  if (correct === rows * cols) {
    statusEl.textContent = "🎉 Correct!";
    launchCelebration();
  } else {
    statusEl.textContent = "";
  }
}

function launchCelebration() {
  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    const colors = ["#ff4757", "#1e90ff", "#2ed573", "#ffa502", "#eccc68"];
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];

    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.setProperty("--x-move", (Math.random() * 200 - 100) + "px");

    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 1500);
  }
}

function onPointerDown(e) {
  const target = e.target.closest(".piece");
  if (!target) return;

  draggedPiece = target;

  const pieceRect = target.getBoundingClientRect();

  const clientX = e.clientX ?? e.touches?.[0]?.clientX;
  const clientY = e.clientY ?? e.touches?.[0]?.clientY;

  dragOffsetX = clientX - pieceRect.left;
  dragOffsetY = clientY - pieceRect.top;

  // Remove from occupancy map if it was in a cell
  const oldPos = piecePositions.get(draggedPiece);
  if (oldPos) {
    const oldKey = `r${oldPos.row}c${oldPos.col}`;
    cellOccupancy.set(oldKey, null);
  }

  // Float above everything
  draggedPiece.style.position = "fixed";
  draggedPiece.style.left = pieceRect.left + "px";
  draggedPiece.style.top = pieceRect.top + "px";
  draggedPiece.style.width = pieceSize + "px";
  draggedPiece.style.height = pieceSize + "px";
  draggedPiece.style.zIndex = 9999;

  window.addEventListener("pointermove", onPointerMove, { passive: false });
  window.addEventListener("pointerup", onPointerUp);
}

function onPointerMove(e) {
  if (!draggedPiece) return;
  e.preventDefault();

  const clientX = e.clientX ?? e.touches?.[0]?.clientX;
  const clientY = e.clientY ?? e.touches?.[0]?.clientY;

  draggedPiece.style.left = clientX - dragOffsetX + "px";
  draggedPiece.style.top = clientY - dragOffsetY + "px";
}

function onPointerUp(e) {
  if (!draggedPiece) return;

  const clientX = e.clientX ?? e.changedTouches?.[0]?.clientX;
  const clientY = e.clientY ?? e.changedTouches?.[0]?.clientY;

  const closest = getClosestCell(clientX, clientY);

  if (closest) {
    // ⭐ CHECK OCCUPANCY USING THE MAP (fixes overlap)
    if (cellOccupancy.get(closest.key) === null) {
      // Snap into empty cell
      closest.el.appendChild(draggedPiece);
      draggedPiece.style.position = "absolute";
      draggedPiece.style.left = "0px";
      draggedPiece.style.top = "0px";
      draggedPiece.style.width = "100%";
      draggedPiece.style.height = "100%";
      draggedPiece.style.zIndex = 1;

      piecePositions.set(draggedPiece, { row: closest.row, col: closest.col });
      cellOccupancy.set(closest.key, draggedPiece);

      checkCorrect();
    } else {
      // Cell is occupied → return to tray
      piecesContainer.appendChild(draggedPiece);
      draggedPiece.style.position = "relative";
      draggedPiece.style.left = "0px";
      draggedPiece.style.top = "0px";
      draggedPiece.style.width = "";
      draggedPiece.style.height = "";
      draggedPiece.style.zIndex = 1;

      piecePositions.set(draggedPiece, null);
    }
  } else {
    // Not near any cell → return to tray
    piecesContainer.appendChild(draggedPiece);
    draggedPiece.style.position = "relative";
    draggedPiece.style.left = "0px";
    draggedPiece.style.top = "0px";
    draggedPiece.style.width = "";
    draggedPiece.style.height = "";
    draggedPiece.style.zIndex = 1;

    piecePositions.set(draggedPiece, null);
  }

  draggedPiece = null;

  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
}

function initPieces() {
  const pieces = document.querySelectorAll(".piece");
  pieces.forEach(piece => {
    piecePositions.set(piece, null);
    piece.addEventListener("pointerdown", onPointerDown);
  });
}

resetBtn.addEventListener("click", () => {
  const pieces = document.querySelectorAll(".piece");
  pieces.forEach(piece => {
    piecesContainer.appendChild(piece);
    piece.style.position = "relative";
    piece.style.left = "0px";
    piece.style.top = "0px";
    piece.style.width = "";
    piece.style.height = "";
    piece.style.zIndex = 1;
    piecePositions.set(piece, null);
  });

  // Reset occupancy
  cells.forEach(cell => cellOccupancy.set(cell.key, null));

  statusEl.textContent = "";
});

window.addEventListener("resize", () => {
  layoutBoard();
});

window.addEventListener("load", () => {
  layoutBoard();
  initPieces();
});