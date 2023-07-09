export function generateMaze(startNode, finishNode, rows, cols) {
  const maze = [];
  for (let i = 0; i < rows; i++) {
    maze.push(Array(cols).fill(1));
  }

  function isValidCell(row, col) {
    return row >= 0 && row < rows && col >= 0 && col < cols;
  }

  function generate(row, col) {
    maze[row][col] = 0;
    maze[finishNode.row][finishNode.col] = 0;

    const directions = [
      [row - 2, col],
      [row, col + 2],
      [row + 2, col],
      [row, col - 2],
    ];
    directions.sort(() => Math.random() - 0.5);

    for (let i = 0; i < directions.length; i++) {
      const [nextRow, nextCol] = directions[i];

      if (isValidCell(nextRow, nextCol) && maze[nextRow][nextCol] === 1) {
        maze[nextRow + (row - nextRow) / 2][
          nextCol + (col - nextCol) / 2
        ] = 0;
        generate(nextRow, nextCol);
      }
    }
  }

  // Start the maze generation from the top-left corner
  generate(startNode.row, startNode.col);

  return maze;
}