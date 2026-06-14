const rows = 4;
const cols = 6;
const board = document.getElementById("board");
const piecesContainer = document.getElementById("pieces");
const statusDiv = document.getElementById("status");
let cells = [];
let activePiece = null;  // the real piece (hidden during drag)
let dragClone = null;    // the visual clone following the finger
let offsetX = 0;
let offsetY = 0;

const cellGroups = [
  [1,1,1,1,1,2],
  [3,3,3,3,3,4],
  [4,4,4,4,5,5],
  [5,5,5,5,5,5]
];

function createBoard() {
  board.innerHTML = "";
  cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.correctGroup = cellGroups[r][c];
      board.appendChild(cell);
      cells.push(cell);
    }
  }
}

function onDown(e) {
  const t = e.target;
  if (!t.classList.contains("piece")) return;
  e.preventDefault();
  activePiece = t;

  const rect = t.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  // Create a floating clone to follow the finger
  dragClone = t.cloneNode(true);
  dragClone.style.position = "fixed";
  dragClone.style.zIndex = "9999";
  dragClone.style.pointerEvents = "none";
  dragClone.style.width = rect.width + "px";
  dragClone.style.height = rect.height + "px";
  dragClone.style.opacity = "0.85";
  document.body.appendChild(dragClone);

  // Hide the original in place so drop target detection works
  activePiece.style.visibility = "hidden";

  moveClone(e.clientX, e.clientY);
}

function moveClone(x, y) {
  if (!dragClone) return;
  dragClone.style.left = x - offsetX + "px";
  dragClone.style.top = y - offsetY + "px";
}

function onMove(e) {
  if (!activePiece) return;
  e.preventDefault();
  moveClone(e.clientX, e.clientY);
}

function getDropTarget(x, y) {
  const el = document.elementFromPoint(x, y);
  if (!el) return null;
  if (el.classList.contains("cell")) return el;
  if (el.id === "pieces" || el.classList.contains("pieces")) return piecesContainer;
  // Check parent in case finger lands on a piece inside a cell
  if (el.classList.contains("piece") && el.parentElement.classList.contains("cell")) {
    return el.parentElement;
  }
  return null;
}

function onUp(e) {
  if (!activePiece) return;

  // Remove the clone
  if (dragClone) {
    dragClone.remove();
    dragClone = null;
  }

  activePiece.style.visibility = "";

  const dropTarget = getDropTarget(e.clientX, e.clientY);

  if (dropTarget && dropTarget.classList.contains("cell")) {
    // If cell has a piece already, send it back to tray
    if (dropTarget.children.length > 0) {
      const existing = dropTarget.children[0];
      existing.style.visibility = "";
      piecesContainer.appendChild(existing);
    }
    dropTarget.appendChild(activePiece);
  } else {
    // Return to tray
    activePiece.style.visibility = "";
    piecesContainer.appendChild(activePiece);
  }

  activePiece = null;
  checkWin();
}

function attachHandlers() {
  // Remove old listeners to avoid duplicates on reset
  document.removeEventListener("pointermove", onMove);
  document.removeEventListener("pointerup", onUp);

  const pieces = document.querySelectorAll(".piece");
  pieces.forEach(p => {
    p.removeEventListener("pointerdown", onDown);
    p.addEventListener("pointerdown", onDown);
  });

  document.addEventListener("pointermove", onMove, { passive: false });
  document.addEventListener("pointerup", onUp);
}

function checkWin() {
  let correct = 0;
  cells.forEach(cell => {
    if (cell.children.length === 1) {
      const piece = cell.children[0];
      if (piece.dataset.group == cell.correctGroup) {
        correct++;
      }
    }
  });
  if (correct === rows * cols) {
    statusDiv.textContent = "Puzzle Complete!";
  } else {
    statusDiv.textContent = "";
  }
}

document.getElementById("resetBtn").addEventListener("click", () => {
  if (dragClone) { dragClone.remove(); dragClone = null; }
  const allPieces = Array.from(document.querySelectorAll(".piece"));
  piecesContainer.innerHTML = "";
  allPieces.forEach(p => {
    p.style.cssText = "";
    piecesContainer.appendChild(p);
  });
  createBoard();
  statusDiv.textContent = "";
  attachHandlers();
});

createBoard();
attachHandlers();
