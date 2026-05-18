const piecesContainer = document.getElementById("pieces");
const status = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

let draggedPiece = null;

function setStatus(msg, type = "") {
  status.textContent = msg;
  status.className = type;
}

function shufflePieces() {
  const pieces = Array.from(document.querySelectorAll(".piece"));

  // Fisher-Yates shuffle
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }

  // Re-append in new order
  pieces.forEach(piece => piecesContainer.appendChild(piece));
}
const board = document.getElementById("board");
const piecesContainer = document.getElementById("pieces");

const pieceWidth = 120;
const pieceHeight = 120;



let draggedPiece = null;

function snapToGrid(x, y) {
  const col = Math.round(x / pieceWidth);
  const row = Math.round(y / pieceHeight);

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
      e.dataTransfer.setData("text/plain", "");
    });

    piece.addEventListener("dragend", e => {
      draggedPiece = null;
    });
  });

  board.addEventListener("dragover", e => e.preventDefault());

  board.addEventListener("drop", e => {
    e.preventDefault();

    const rect = board.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const snap = snapToGrid(x, y);

    const correctId = `r${snap.row + 1}c${snap.col + 1}`;

    if (draggedPiece.dataset.id === correctId) {
      draggedPiece.style.position = "absolute";
      draggedPiece.style.left = snap.x + "px";
      draggedPiece.style.top = snap.y + "px";
      board.appendChild(draggedPiece);
    } else {
      piecesContainer.appendChild(draggedPiece);
    }
  });
}

init();
