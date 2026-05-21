const pieceWidth = 150;
const pieceHeight = 150;
const cols = 6;
const rows = 4;

const board = document.getElementById("board");
const piecesContainer = document.getElementById("pieces");

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

      // Track speed
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = performance.now();

      e.dataTransfer.setData("text/plain", "");
    });

    piece.addEventListener("drag", e => {
      if (!draggedPiece || e.clientX === 0 && e.clientY === 0) return;

      // Calculate speed
      const now = performance.now();
      const dt = now - lastTime;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      speed = Math.sqrt(dx * dx + dy * dy) / dt;

      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;

      // Live snap preview only if moving slowly
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
    const correctId = `r${snap.row + 1}c${snap.col + 1}`;

    const dx = Math.abs(snap.x - x);
    const dy = Math.abs(snap.y - y);

    const closeEnough = dx < pieceWidth / 2 && dy < pieceHeight / 2;

    // Only snap if slow enough
    if (speed < 0.5 && closeEnough && draggedPiece.dataset.id === correctId) {
      draggedPiece.style.position = "absolute";
      draggedPiece.style.left = snap.x + "px";
      draggedPiece.style.top = snap.y + "px";
      draggedPiece.style.zIndex = 20;
      board.appendChild(draggedPiece);
    } else {
      // Return to sidebar
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

init();
