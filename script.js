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

function initDragAndDrop() {
  const pieces = document.querySelectorAll(".piece");
  const slots = document.querySelectorAll(".slot");

  pieces.forEach(piece => {
    piece.addEventListener("dragstart", e => {
      draggedPiece = piece;
      e.dataTransfer.setData("text/plain", piece.dataset.id);
    });

    piece.addEventListener("dragend", () => draggedPiece = null);
  });

  slots.forEach(slot => {
    slot.addEventListener("dragover", e => e.preventDefault());

    slot.addEventListener("drop", e => {
      e.preventDefault();
      if (!draggedPiece) return;

      if (slot.querySelector(".piece")) {
        setStatus("That slot already has a piece.", "error");
        return;
      }

      slot.appendChild(draggedPiece);

      const correct = draggedPiece.dataset.id === slot.dataset.id;

      slot.classList.remove("correct", "incorrect");
      slot.classList.add(correct ? "correct" : "incorrect");

      setStatus(correct ? "Correct!" : "Wrong spot.", correct ? "success" : "error");

      checkWin();
    });
  });
}

function checkWin() {
  const slots = document.querySelectorAll(".slot");
  for (const slot of slots) {
    const piece = slot.querySelector(".piece");
    if (!piece || piece.dataset.id !== slot.dataset.id) return;
  }
  setStatus("Puzzle complete! 🎉", "success");
}

function resetPuzzle() {
  const slots = document.querySelectorAll(".slot");
  const pieces = document.querySelectorAll(".piece");

  slots.forEach(slot => slot.classList.remove("correct", "incorrect"));
  pieces.forEach(piece => piecesContainer.appendChild(piece));

  shufflePieces(); // shuffle again on reset
  setStatus("");
}

resetBtn.addEventListener("click", resetPuzzle);

// Shuffle once on page load
shufflePieces();
initDragAndDrop();
