function generateMaze(rows, columns) {
    // Initialize the maze with walls
    const maze = [];
    for (let i = 0; i < rows; i++) {
      maze[i] = [];
      for (let j = 0; j < columns; j++) {
        maze[i][j] = 1;
      }
    }
  
    // Select a random starting point and set it as empty space
    const startRow = Math.floor(Math.random() * rows);
    const startCol = Math.floor(Math.random() * columns);
    maze[startRow][startCol] = 0;
  
    // Create a list of frontier cells
    const frontier = [];
    addToFrontier(startRow, startCol);
  
    while (frontier.length > 0) {
      // Randomly select a frontier cell
      const randomIndex = Math.floor(Math.random() * frontier.length);
      const cell = frontier[randomIndex];
      const [row, col] = cell;
  
      // Find all the neighbors of the selected cell
      const neighbors = [];
      if (row - 2 >= 0) neighbors.push([row - 2, col]);
      if (row + 2 < rows) neighbors.push([row + 2, col]);
      if (col - 2 >= 0) neighbors.push([row, col - 2]);
      if (col + 2 < columns) neighbors.push([row, col + 2]);
  
      for (const neighbor of neighbors) {
        const [nRow, nCol] = neighbor;
  
        // Check if the neighbor is a valid cell
        if (maze[nRow][nCol] === 1) {
          // Carve a path between the current cell and the neighbor
          maze[nRow][nCol] = 0;
          maze[row + (nRow - row) / 2][col + (nCol - col) / 2] = 0;
  
          // Add the neighbor to the frontier cells
          addToFrontier(nRow, nCol);
        }
      }
  
      // Remove the current cell from the frontier
      frontier.splice(randomIndex, 1);
    }
  
    return maze;
  
    function addToFrontier(row, col) {
      frontier.push([row, col]);
    }
  }
  
  // Example usage:
  const maze = generateMaze(10, 10);
  console.log(maze);
  