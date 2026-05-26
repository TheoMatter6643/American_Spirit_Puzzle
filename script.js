const pieceWidth = 150;
const pieceHeight = 150;
const cols = 6;
const rows = 4;

const board = document.getElementById("board");
const piecesContainer = document.getElementById("pieces");
const resetBtn = document.getElementById("resetBtn");
const statusEl = document.getElementById("status");

let draggedPiece = null;
let lastX = 0;
let lastY = 0;
let lastTime = 0;
let speed = 0;

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
      piece.classList.add("dragging");

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

      if (speed < 0.5) {
        const rect = board.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const snap = snapToGrid(x, y);

        draggedPiece.style.position = "absolute";
        draggedPiece.style.left = snap.x + "px";
        draggedPiece.style.top = snap.y + "px";
        draggedPiece.style.zIndex = 9999;
        board.appendChild(draggedPiece);
      }
    });

    piece.addEventListener("dragend", () => {
      draggedPiece.classList.remove("dragging");
      draggedPiece = null;
    });
  });

  board.addEventListener("dragover", e => e.preventDefault());

  board.addEventListener("drop", e => {
    e.preventDefault();
    if (!draggedPiece) return;

    const rect = board.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const snap = snapToGrid(x, y);

    if (speed < 0.5) {
      draggedPiece.style.position = "absolute";
      draggedPiece.style.left = snap.x + "px";
      draggedPiece.style.top = snap.y + "px";
      draggedPiece.style.zIndex = 20;
      board.appendChild(draggedPiece);
    } else {
      piecesContainer.appendChild(draggedPiece);
      draggedPiece.style.position = "relative";
      draggedPiece.style.left = "0px";
      draggedPiece.style.top = "0px";
      draggedPiece.style.zIndex = 10;
    }

    draggedPiece.classList.remove("dragging");
    draggedPiece = null;
  });
}

resetBtn.addEventListener("click", () => {
  const pieces = document.querySelectorAll(".piece");
  pieces.forEach(piece => {
    piecesContainer.appendChild(piece);
    piece.style.position = "relative";
    piece.style.left = "0px";
    piece.style.top = "0px";
    piece.style.zIndex = 10;
  });
  statusEl.textContent = "";
});

init();
