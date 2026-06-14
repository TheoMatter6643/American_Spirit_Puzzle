// --- CONFIG ---
const rows = 4;
const cols = 6;

// Build the board grid
const board = document.getElementById("board");
const piecesContainer = document.getElementById("pieces");
const statusDiv = document.getElementById("status");

let cells = [];
let draggedPiece = null;

// Assign correct groups for each cell (you can customize this)
const cellGroups = [
  [1,1,1,1,1,2],   // row 1
  [3,3,3,3,3,4],   // row 2
  [4,4,4,4,5,5],   // row 3
  [5,5,5,5,5,5]    // row 4
];

// Build board cells
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

// Drag start
document.addEventListener("dragstart", (e) => {
  if (e.target.classList.contains("piece")) {
    draggedPiece = e.target;
    e.dataTransfer.setData("text/plain", "");
  }
});

// Allow drop
document.addEventListener("dragover", (e) => {
  if (e.target.classList.contains("cell") || e.target.classList.contains("pieces")) {
    e.preventDefault();
  }
});

// Drop logic
document.addEventListener("drop", (e) => {
  if (!draggedPiece) return;

  if (e.target.classList.contains("cell")) {
    e.target.innerHTML = "";
    e.target.appendChild(draggedPiece);
  }

  if (e.target.classList.contains("pieces")) {
    piecesContainer.appendChild(draggedPiece);
  }

  draggedPiece = null;
  checkWin();
});

// Check if puzzle is solved
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

// Reset button
document.getElementById("resetBtn").addEventListener("click", () => {
  piecesContainer.innerHTML = "";
  document.querySelectorAll(".piece").forEach(p => piecesContainer.appendChild(p));
  createBoard();
  statusDiv.textContent = "";
});

// Initialize
createBoard();
