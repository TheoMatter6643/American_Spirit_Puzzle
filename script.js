const pieceWidth = 150;
const pieceHeight = 150;
const cols = 6;
const rows = 4;

const board = document.getElementById("board");
const piecesContainer = document.getElementById("pieces");

let draggedPiece = null;

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

function init() {
  const pieces = document.querySelectorAll(".piece");

  pieces.forEach(piece => {
    piece.addEventListener("dragstart", e => {
      draggedPiece = piece;
      e.dataTransfer.setData("text/plain", ""); // required for Firefox
    });

    piece.addEventListener("dragend", () => {
      draggedPiece = null;
    });
  });

  // Allow dropping on board
  board.addEventListener("dragover", e => e.preventDefault());

  // Handle drop
  board.addEventListener("drop", e => {
    e.preventDefault();

    if (!draggedPiece) return;

    const rect = board.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const snap = snapToGrid(x, y);

    const correctId = `r${snap.row + 1}c${snap.col + 1}`;

    // Tolerance so snapping feels natural
    const dx = Math.abs(snap.x - x);
    const dy = Math.abs(snap.y - y);

    const closeEnough = dx < pieceWidth / 2 && dy < pieceHeight / 2;

    if (closeEnough && draggedPiece.dataset.id === correctId) {
      // Correct placement
      draggedPiece.style.position = "absolute";
      draggedPiece.style.left = snap.x + "px";
      draggedPiece.style.top = snap.y + "px";
      board.appendChild(draggedPiece);
    } else {
      // Wrong spot → send back to sidebar
      piecesContainer.appendChild(draggedPiece);
      draggedPiece.style.position = "relative";
      draggedPiece.style.left = "0px";
      draggedPiece.style.top = "0px";
    }
  });
}

init();
