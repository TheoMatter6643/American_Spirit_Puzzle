const rows = 4;
const cols = 6;

const board = document.getElementById("board");
const piecesContainer = document.getElementById("pieces");
const statusDiv = document.getElementById("status");

let cells = [];
let activePiece = null;
let originalParent = null;

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
      cell.dataset.row = r + 1;
      cell.dataset.col = c + 1;
      cell.correctGroup = cellGroups[r][c];
      board.appendChild(cell);
      cells.push(cell);
    }
  }
}

function onPointerDown(e) {
  const target = e.target;
  if (!target.classList.contains("piece")) return;

  activePiece = target;
  originalParent = target.parentElement;

  activePiece.setPointerCapture(e.pointerId);
  activePiece.dataset.startX = e.clientX;
  activePiece.dataset.startY = e.clientY;
  activePiece.dataset.origLeft = activePiece.offsetLeft;
  activePiece.dataset.origTop = activePiece.offsetTop;

  activePiece.style.position = "fixed";
  activePiece.style.left = e.clientX - activePiece.offsetWidth / 2 + "px";
  activePiece.style.top = e.clientY - activePiece.offsetHeight / 2 + "px";
  activePiece.style.zIndex = "9999";
  activePiece.style.pointerEvents = "none";
}

function onPointerMove(e) {
  if (!activePiece) return;

  activePiece.style.left = e.clientX - activePiece.offsetWidth / 2 + "px";
  activePiece.style.top = e.clientY - activePiece.offsetHeight / 2 + "px";
}

function getDropTarget(x, y) {
  const el = document.elementFromPoint(x, y);
  if (!el) return null;
  if (el.classList.contains("cell")) return el;
  if (el.id === "pieces" || el.classList.contains("pieces")) return piecesContainer;
  return null;
}

function onPointerUp(e) {
  if (!activePiece) return;

  const dropTarget = getDropTarget(e.clientX, e.clientY);

  activePiece.style.position = "";
  activePiece.style.left = "";
  activePiece.style.top = "";
  activePiece.style.zIndex = "";
  activePiece.style.pointerEvents = "";

  if (dropTarget && dropTarget.classList.contains("cell")) {
    dropTarget.innerHTML = "";
    dropTarget.appendChild(activePiece);
  } else if (dropTarget === piecesContainer) {
    piecesContainer.appendChild(activePiece);
  } else {
    originalParent.appendChild(activePiece);
  }

  activePiece.releasePointerCapture(e.pointerId);
  activePiece = null;
  originalParent = null;

  checkWin();
}

function attachPieceHandlers() {
  const pieces = document.querySelectorAll(".piece");
  pieces.forEach(p => {
    p.addEventListener("pointerdown", onPointerDown);
    p.addEventListener("pointermove", onPointerMove);
    p.addEventListener("pointerup", onPointerUp);
    p.addEventListener("pointercancel", onPointerUp);
  });
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
  const allPieces = Array.from(document.querySelectorAll(".piece"));
  piecesContainer.innerHTML = "";
  allPieces.forEach(p => {
    p.style.position = "";
    p.style.left = "";
    p.style.top = "";
    p.style.zIndex = "";
    piecesContainer.appendChild(p);
  });
  createBoard();
  statusDiv.textContent = "";
  attachPieceHandlers();
});

createBoard();
attachPieceHandlers();
