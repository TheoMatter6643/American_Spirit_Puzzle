const rows = 4;
const cols = 6;

const board = document.getElementById("board");
const piecesContainer = document.getElementById("pieces");
const statusDiv = document.getElementById("status");

let cells = [];
let activePiece = null;
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

  activePiece = t;

  const rect = t.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  piecesContainer.style.pointerEvents = "none";

  document.body.appendChild(t);

  t.style.position = "fixed";
  t.style.zIndex = "9999";
  t.style.pointerEvents = "none";

  movePiece(e.clientX, e.clientY);
}

function movePiece(x, y) {
  if (!activePiece) return;
  activePiece.style.left = x - offsetX + "px";
  activePiece.style.top = y - offsetY + "px";
}

function onMove(e) {
  if (!activePiece) return;
  movePiece(e.clientX, e.clientY);
}

function getDropTarget(x, y) {
  const el = document.elementFromPoint(x, y);
  if (!el) return null;
  if (el.classList.contains("cell")) return el;
  if (el.id === "pieces" || el.classList.contains("pieces")) return piecesContainer;
  return null;
}

function onUp(e) {
  if (!activePiece) return;

  piecesContainer.style.pointerEvents = "";

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
    piecesContainer.appendChild(activePiece);
  }

  activePiece = null;
  checkWin();
}

function attachHandlers() {
  const pieces = document.querySelectorAll(".piece");
  pieces.forEach(p => {
    p.addEventListener("pointerdown", onDown);
  });

  document.addEventListener("pointermove", onMove);
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
  attachHandlers();
});

createBoard();
attachHandlers();
