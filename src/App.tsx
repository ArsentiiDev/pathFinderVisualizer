import { useCallback, useEffect, useState } from "react";
import {
  ChakraProvider,
  VStack,
  theme,
  Center,
  Button,
  HStack,
  Box,
} from "@chakra-ui/react";
import { dijkstra, getNodesInShortestPathOrder } from "./utils/dijkstra";
import { ArrowRightIcon } from "@chakra-ui/icons";
import "./App.css";
import { Node } from "./interfaces";

const START_NODE_ROW = 8;
const START_NODE_COL = 12;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 27;

export const App = () => {
  const [grid, setGrid] = useState<Node[][]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const createNode = (col: number, row: number): Node => {
    return {
      col,
      row,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
      isPath: false,
      isVisitedAnimationDone: false,
    };
  };

  const getInitialGrid = useCallback((): Node[][] => {
    const grid: Node[][] = [];
    for (let row = 0; row < 20; row++) {
      const currentRow: Node[] = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  }, []);

  useEffect(() => {
    setGrid(getInitialGrid());
  }, [getInitialGrid]);

  const handleCellClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const target = event.target as HTMLDivElement;
      const row = parseInt(target.getAttribute("data-row") || "0");
      const col = parseInt(target.getAttribute("data-col") || "0");

      const newGrid = grid.slice();
      const node = newGrid[row][col];
      const newNode = {
        ...node,
        isWall: !node.isWall,
      };
      newGrid[row][col] = newNode;
      setGrid(newGrid);
    },
    [grid]
  );

  function generateMaze() {
    const maze:any = [];
    for (let i = 0; i < grid.length; i++) {
      maze.push(Array(grid[0].length).fill(1));
    }

    function isValidCell(row:number, col:number) {
      return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
    }

    function generate(row:number, col:number) {
      maze[row][col] = 0;
      maze[FINISH_NODE_ROW][FINISH_NODE_COL] = 0;

      const directions = [
        [row - 2, col],
        [row, col + 2],
        [row + 2, col],
        [row, col - 2]
      ];
      directions.sort(() => Math.random() - 0.5);

      for (let i = 0; i < directions.length; i++) {
        const [nextRow, nextCol] = directions[i];

        if (isValidCell(nextRow, nextCol) && maze[nextRow][nextCol] === 1) {
          maze[nextRow + (row - nextRow) / 2][nextCol + (col - nextCol) / 2] = 0;
          generate(nextRow, nextCol);
        }
      }
    }

    // Start the maze generation from the top-left corner
    generate(START_NODE_ROW, START_NODE_COL);

    let newGrid = grid.slice();

    for(let i =0; i< grid.length; i++) {
      for(let j =0; j<grid[0].length; j++) {
        if(maze[i][j] === 1){
          newGrid[i][j].isWall = true
        } else newGrid[i][j].isWall = false
      }
    }

    setGrid(newGrid)
  }

  // function generateMaze() {
  //   let rows = grid.length;
  //   let columns = grid[0].length;
  //   // Initialize the maze with walls
  //   const maze:any = [];
  //   for (let i = 0; i < rows; i++) {
  //     maze[i] = [];
  //     for (let j = 0; j < columns; j++) {
  //       maze[i][j] = 1;
  //     }
  //   }
  
  //   // Select a random starting point and set it as empty space
  //   maze[START_NODE_ROW][START_NODE_COL] = 0;
  //   maze[FINISH_NODE_ROW][FINISH_NODE_COL] = 0;
  
  //   // Create a list of frontier cells
  //   const frontier:any = [];
  //   addToFrontier(START_NODE_ROW, START_NODE_COL);
  //   addToFrontier(FINISH_NODE_ROW, FINISH_NODE_COL);
  
  //   while (frontier.length > 0) {
  //     // Randomly select a frontier cell
  //     const randomIndex = Math.floor(Math.random() * frontier.length);
  //     const cell = frontier[randomIndex];
  //     const [row, col] = cell;
  
  //     // Find all the neighbors of the selected cell
  //     const neighbors = [];
  //     if (row - 2 >= 0) neighbors.push([row - 2, col]);
  //     if (row + 2 < rows) neighbors.push([row + 2, col]);
  //     if (col - 2 >= 0) neighbors.push([row, col - 2]);
  //     if (col + 2 < columns) neighbors.push([row, col + 2]);
  
  //     for (const neighbor of neighbors) {
  //       const [nRow, nCol] = neighbor;
  
  //       // Check if the neighbor is a valid cell
  //       if (maze[nRow][nCol] === 1) {
  //         // Carve a path between the current cell and the neighbor
  //         maze[nRow][nCol] = 0;
  //         maze[row + (nRow - row) / 2][col + (nCol - col) / 2] = 0;
  
  //         // Add the neighbor to the frontier cells
  //         addToFrontier(nRow, nCol);
  //       }
  //     }
  
  //     // Remove the current cell from the frontier
  //     frontier.splice(randomIndex, 1);
  //   }

  //   function addToFrontier(row: number, col: number) {
  //     frontier.push([row, col]);
  //   }

  //       let newGrid = grid.slice();

  //   for(let i =0; i< grid.length; i++) {
  //     for(let j =0; j<grid[0].length; j++) {
  //       if(maze[i][j] === 1){
  //         newGrid[i][j].isWall = !newGrid[i][j].isWall
  //       }
  //     }
  //   }

  //   setGrid(newGrid)
  

  // }


  const visualizeDijkstra = () => {
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        element?.classList.add("node-visited");
      }, 10 * i);
    }
  };

  const animateShortestPath = (shortestNodes: Node[]) => {
    for (let i = 0; i < shortestNodes.length; i++) {
      setTimeout(() => {
        const node = shortestNodes[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        element?.classList.add("node-shortest-path");
      }, 50 * i);
    }
  };

  const handleMouseDown = useCallback(() => {
    setIsMouseDown(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const target = event.target as HTMLDivElement;
      const { row, col } = target.dataset;
      if (isMouseDown && row && col) {
        handleCellClick(event);
      }
    },
    [isMouseDown, handleCellClick]
  );

  const clear = () => {
    setGrid(getInitialGrid())
  
    const visitedNodes = document.querySelectorAll(".node-visited");
    visitedNodes.forEach((node) => node.classList.remove("node-visited"));
  
    const shortestPathNodes = document.querySelectorAll(".node-shortest-path");
    shortestPathNodes.forEach((node) => node.classList.remove("node-shortest-path"));
  };
  
  
  

  return (
    <ChakraProvider theme={theme}>
      <Center minW="100vw" minH="100vh">
        <VStack>
          <HStack>
            <Button onClick={visualizeDijkstra} mb="2rem">
              Visualize Dijkstra
            </Button>
            <Button onClick={clear} mb="2rem">
              Clear
            </Button>
            <Button onClick={generateMaze} mb="2rem">
              Generate Maze
            </Button>
          </HStack>

          <VStack gap={0}>
            {grid.map((row: Node[], rowIndex: number) => (
              <HStack key={rowIndex} gap={0}>
                {row.map((node: Node, colIndex: number) => {
                  const { isFinish, isWall, isStart, isVisited, isPath } = node;
                  let extraClassName = isFinish
                    ? "node-finish"
                    : isStart
                    ? "node-start"
                    : isWall
                    ? "node-wall"
                    : "";
                  return (
                    <Box
                      id={`node-${rowIndex}-${colIndex}`}
                      key={colIndex}
                      className={`${extraClassName} ${
                        isVisited ? "node-visited" : ""
                      } ${isPath ? "node-shortest-path" : ""}`}
                      cursor="pointer"
                      w="30px"
                      h="30px"
                      border="1px"
                      onClick={handleCellClick}
                      onMouseDown={handleMouseDown}
                      onMouseUp={handleMouseUp}
                      onMouseEnter={handleMouseEnter}
                      data-row={rowIndex}
                      data-col={colIndex}
                    >
                      {isStart && <ArrowRightIcon />}
                    </Box>
                  );
                })}
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Center>
    </ChakraProvider>
  );
};
