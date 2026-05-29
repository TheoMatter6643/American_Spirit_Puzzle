function layoutBoard() {
  const rect = board.getBoundingClientRect();
  pieceSize = rect.width / cols;
  board.style.height = pieceSize * rows + "px";

  // Clear old cells
  cells.forEach(c => c.el.remove());
  cells = [];
  cellOccupancy.clear();

  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // Position
      cell.style.left = (c - 1) * pieceSize + "px";
      cell.style.top = (r - 1) * pieceSize + "px";
      cell.style.width = pieceSize + "px";
      cell.style.height = pieceSize + "px";

      // ⭐ Add margins BETWEEN pieces, not on edges
      let marginRight = c < cols ? 5 : 0;
      let marginBottom = r < rows ? 5 : 0;

      cell.style.paddingRight = marginRight + "px";
      cell.style.paddingBottom = marginBottom + "px";

      cell.dataset.row = r;
      cell.dataset.col = c;
      board.appendChild(cell);

      const key = `r${r}c${c}`;
      cellOccupancy.set(key, null);

      cells.push({
        el: cell,
        row: r,
        col: c,
        key
      });
    }
  }

  // Re-snap pieces already placed
  piecePositions.forEach((pos, piece) => {
    if (!pos) return;
    const cell = cells.find(c => c.row === pos.row && c.col === pos.col);
    if (cell) {
      cell.el.appendChild(piece);
      piece.style.position = "absolute";
      piece.style.left = "0px";
      piece.style.top = "0px";
      piece.style.width = "calc(100% - 5px)";
      piece.style.height = "calc(100% - 5px)";
      piece.style.zIndex = 1;

      cellOccupancy.set(cell.key, piece);
    }
  });
}
