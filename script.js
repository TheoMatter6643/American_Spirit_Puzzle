const board = document.getElementById("board");
const piecesContainer = document.getElementById("pieces");
const resetBtn = document.getElementById("resetBtn");

let draggedPiece = null;
let lastX = 0;
let lastY = 0;
let lastTime = 0;
let speed = 0;

// Create 24 board cells
for (let r = 1; r <= 4; r++) {
  for (let c = 1; c <= 6; c++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.row = r;
    cell.dataset.col = c;
    board.appendChild(cell);
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

  document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("dragover", e => e.preventDefault());

    cell.addEventListener("drop", e => {
      e.preventDefault();
      if (!draggedPiece) return;

      if (speed < 0.5) {
        // Remove any existing piece in this cell
        const existing = cell.querySelector(".piece");
        if (existing) piecesContainer.appendChild(existing);

        // Place new piece
        cell.appendChild(draggedPiece);
        draggedPiece.style.position = "absolute";
        draggedPiece.style.top = "0";
        draggedPiece.style.left = "0";
      } else {
        // Return to sidebar
        piecesContainer.appendChild(draggedPiece);
      }

      draggedPiece = null;
    });
  });
}

resetBtn.addEventListener("click", () => {
  const pieces = document.querySelectorAll(".piece");
  pieces.forEach(piece => {
    piecesContainer.appendChild(piece);
    piece.style.position = "relative";
    piece.style.top = "0";
    piece.style.left = "0";
  });
});

init();
