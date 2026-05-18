const board = document.getElementById("board");
const piecesContainer = document.getElementById("pieces");

const pieceWidth = 120;
const pieceHeight = 200;

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

    piece.addEventListener("dragend", () => {
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
