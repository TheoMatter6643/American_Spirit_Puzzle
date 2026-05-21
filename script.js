const pieceWidth = 150;
const pieceHeight = 150;
const cols = 6;
const rows = 4;

const board = document.getElementById("board");
const piecesContainer = document.getElementById("pieces");
const resetBtn = document.getElementById("resetBtn");
const statusEl = document.getElementById("status");

let draggedPiece = null;
let placedCount = 0;

function snapToGrid(x, y) {
  const col = Math.max(0, Math.min(cols - 1, Math.round(x / pieceWidth)));
  const row = Math.max(0, Math.min(rows - 1, Math.round(y / pieceHeight)));

  return {
    x: col * pieceWidth,
    y: row * pieceHeight,
    row,
    col
  };
}

function initDrag() {
  const pieces = document.querySelectorAll(".piece");

  pieces.forEach(piece => {
    piece.addEventListener("dragstart", e => {
      draggedPiece = piece;
      piece.classList.add("dragging");
      e.dataTransfer.setData("text/plain", ""); // required for Firefox
    });

    piece.addEventListener("dragend", () => {
      if (draggedPiece) {
        draggedPiece.classList.remove("dragging");
      }
      draggedPiece = null;
    });
  });

  board.addEventListener("dragover", e => {
    e.preventDefault();
  });

  board.addEventListener("drop", e => {
    e.preventDefault();
    if (!draggedPiece) return;

    const rect = board.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const snap = snapToGrid(x, y);
    const correctId = `r${snap.row + 1}c${snap.col + 1}`;

    const dx = Math.abs(snap.x - x);
    const dy = Math.abs(snap.y - y);
    const closeEnough = dx < pieceWidth / 2 && dy < pieceHeight / 2;

    if (closeEnough && draggedPiece.dataset.id === correctId) {
      // Place on board, overlapping like real jigsaw
      draggedPiece.style.position = "absolute";
      draggedPiece.style.left = snap.x + "px";
      draggedPiece.style.top = snap.y + "px";
      draggedPiece.style.zIndex = 20;
      board.appendChild(draggedPiece);

      // Count placed pieces once
      if (!draggedPiece.dataset.placed) {
        draggedPiece.dataset.placed = "true";
        placedCount++;
        if (placedCount === rows * cols) {
          statusEl.textContent = "🎉 Puzzle complete!";
        }
      }
    } else {
      // Return to sidebar
      piecesContainer.appendChild(draggedPiece);
      draggedPiece.style.position = "relative";
      draggedPiece.style.left = "0px";
      draggedPiece.style.top = "0px";
      draggedPiece.style.zIndex = 10;

      if (draggedPiece.dataset.placed === "true") {
        draggedPiece.dataset.placed = "false";
        placedCount--;
        statusEl.textContent = "";
      }
    }

    draggedPiece.classList.remove("dragging");
    draggedPiece = null;
  });
}

function initReset() {
  resetBtn.addEventListener("click", () => {
    const pieces = document.querySelectorAll(".piece");
    pieces.forEach(piece => {
      piecesContainer.appendChild(piece);
      piece.style.position = "relative";
      piece.style.left = "0px";
      piece.style.top = "0px";
      piece.style.zIndex = 10;
      piece.dataset.placed = "false";
    });
    placedCount = 0;
    statusEl.textContent = "";
  });
}

initDrag();
initReset();
