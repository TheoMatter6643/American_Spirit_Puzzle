   const piecesContainer = document.getElementById("pieces");
    const board = document.getElementById("board");
    const status = document.getElementById("status");
    const resetBtn = document.getElementById("resetBtn");

    let draggedPiece = null;

    function setStatus(message, type = "") {
      status.textContent = message;
      status.className = "";
      if (type) status.classList.add(type);
    }

    function initDragAndDrop() {
      const pieces = document.querySelectorAll(".piece");
      const slots = document.querySelectorAll(".slot");

      pieces.forEach(piece => {
        piece.addEventListener("dragstart", e => {
          draggedPiece = piece;
          e.dataTransfer.setData("text/plain", piece.dataset.id);
        });

        piece.addEventListener("dragend", () => {
          draggedPiece = null;
        });
      });

      slots.forEach(slot => {
        slot.addEventListener("dragover", e => {
          e.preventDefault();
        });

        slot.addEventListener("drop", e => {
          e.preventDefault();
          if (!draggedPiece) return;

          // Only allow one piece per slot
          if (slot.querySelector(".piece")) {
            setStatus("That slot already has a piece.", "error");
            return;
          }

          slot.appendChild(draggedPiece);

          const pieceId = draggedPiece.dataset.id;
          const slotId = slot.dataset.id;

          if (pieceId === slotId) {
            slot.classList.remove("incorrect");
            slot.classList.add("correct");
            setStatus("Nice! That piece is correct.", "success");
          } else {
            slot.classList.remove("correct");
            slot.classList.add("incorrect");
            setStatus("Wrong spot. Try again or move it.", "error");
          }

          checkWin();
        });
      });
    }

    function checkWin() {
      const slots = document.querySelectorAll(".slot");
      let allCorrect = true;

      slots.forEach(slot => {
        const piece = slot.querySelector(".piece");
        if (!piece || piece.dataset.id !== slot.dataset.id) {
          allCorrect = false;
        }
      });

      if (allCorrect) {
        setStatus("Puzzle complete! 🎉", "success");
      }
    }

    function resetPuzzle() {
      const slots = document.querySelectorAll(".slot");
      const pieces = document.querySelectorAll(".piece");

      slots.forEach(slot => {
        slot.classList.remove("correct", "incorrect");
      });

      pieces.forEach(piece => {
        piecesContainer.appendChild(piece);
      });

      setStatus("");
    }

    resetBtn.addEventListener("click", resetPuzzle);

    initDragAndDrop();
