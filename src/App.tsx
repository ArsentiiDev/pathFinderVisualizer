/* eslint-disable @typescript-eslint/no-unused-vars */
import { createRef, useCallback, useEffect, useRef, useState } from "react";
import {
  ChakraProvider,
  VStack,
  theme,
  Button,
  HStack,
  Box,
  Image,
  Flex,
  Text,
  Select,
  background,
  Container,
  Heading,
} from "@chakra-ui/react";
import { dijkstra, getNodesInShortestPathOrder } from "./utils/dijkstra";
import "./App.css";
import { Node } from "./interfaces";
import { motion } from "framer-motion";
import {aStarAlgorithm} from "./utils/aStar";
import { generateMaze } from "./utils/maze";
import { isStartOrFinishNode } from "./utils/helpers";
import Grid from "./components/Grid";
import { Header } from "./components/Header";

const START_NODE_ROW = 6;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 15;
const FINISH_NODE_COL = 33;
const MUST_PASS_ROW = 10;
const MUST_PASS_COL = 40

const materials = ["ground", "wall", "water"];

export const App = () => {
  const [grid, setGrid] = useState<Node[][]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startNodeRow, setStartNodeRow] = useState(START_NODE_ROW);
  const [startNodeCol, setStartNodeCol] = useState(START_NODE_COL);
  const [finishNodeRow, setFinishNodeRow] = useState(FINISH_NODE_ROW);
  const [finishNodeCol, setFinishNodeCol] = useState(FINISH_NODE_COL);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(undefined);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const cellRefs = useRef<HTMLDivElement[][]>([]);
  const [isAlgorithmFinished, setIsAlgorithmFinished] = useState(false);

  const createNode = (col: number, row: number): Node => {
    return {
      col,
      row,
      isStart: row === startNodeRow && col === startNodeCol,
      isFinish: row === finishNodeRow && col === finishNodeCol,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      isWater: false,
      isGround: false,
      previousNode: null,
      isPath: false,
      isVisitedAnimationDone: false,
      estimatedDistToEnd: Infinity,
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
    cellRefs.current = Array(20)
      .fill(null)
      .map(() => Array(50).fill(null));
  }, [getInitialGrid]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      const node = cellRefs.current[row][col];

      if (
        node &&
        !isStartOrFinishNode(
          grid[row][col],
          grid[startNodeRow][startNodeCol],
          grid[finishNodeRow][finishNodeCol]
        )
      ) {
        const updatedGrid = [...grid];
        const updatedNode = { ...updatedGrid[row][col] };

        if (selectedMaterial === "ground") {
          updatedNode.isGround = true;
          updatedNode.isWall = false;
          updatedNode.isWater = false;
          node.classList.add("node-ground");
        } else if (selectedMaterial === "wall") {
          updatedNode.isGround = false;
          updatedNode.isWall = true;
          updatedNode.isWater = false;
          node.classList.add("node-wall");
        } else if (selectedMaterial === "water") {
          updatedNode.isGround = false;
          updatedNode.isWall = false;
          updatedNode.isWater = true;
          node.classList.add("node-water");
        }

        updatedGrid[row][col] = updatedNode;
        setGrid(updatedGrid);
      }
    },
    [
      grid,
      selectedMaterial,
      startNodeRow,
      startNodeCol,
      finishNodeRow,
      finishNodeCol,
    ]
  );

  const resetRefs = () => {
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 50; col++) {
        cellRefs.current[row][col].classList.remove("node-wall");
      }
    }
  };

  const createMaze = () => {
    let newGrid = generateMaze(
      grid[startNodeRow][startNodeCol],
      grid[finishNodeRow][finishNodeCol],
      grid.length,
      grid[0].length
    );

    setGrid((prevGrid) => {
      const mazeGrid = prevGrid.map((row, i) =>
        row.map((node, j) => {
          if (newGrid[i][j] === 1) {
            return {
              ...node,
              isWall: true,
            };
          } else {
            return {
              ...node,
              isWall: false,
            };
          }
        })
      );
      return mazeGrid;
    });
  };

  const visualize = () => {
    let newGrid = grid.map((row, i) => {
      return row.map((node, j) => {
        const nodeRef = cellRefs.current[i][j];
        if (nodeRef && nodeRef.classList.contains("node-wall")) {
          return {
            ...node,
            isWall: true,
          };
        } else if (nodeRef && nodeRef.classList.contains("node-ground")) {
          return {
            ...node,
            isGround: true,
          };
        } else if (nodeRef && nodeRef.classList.contains("node-water")) {
          return {
            ...node,
            isWater: true,
          };
        } else return node;
      });
    });

    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    let visitedNodesInOrder: any = [];
    let nodesInShortestPathOrder: any = [];
    if (selectedAlgorithm === "Dijkstra") {
      visitedNodesInOrder = dijkstra(newGrid, startNode, finishNode);
      nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    } else if (selectedAlgorithm === "A*") {
      [visitedNodesInOrder, nodesInShortestPathOrder] = aStarAlgorithm(
        startNodeRow,
        startNodeCol,
        finishNodeRow,
        finishNodeCol,
        newGrid
      );
    }
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

  const clearStyles = () => {
    const visitedNodes = document.querySelectorAll(".node-visited");
    visitedNodes.forEach((node) => node.classList.remove("node-visited"));

    const shortestPathNodes = document.querySelectorAll(".node-shortest-path");
    shortestPathNodes.forEach((node) =>
      node.classList.remove("node-shortest-path")
    );
  };

  const clearMaze = () => {
    setGrid(getInitialGrid());

    clearStyles();
    resetRefs();
  };

  const getInitialGridWithoutPath = () => {
    const newGrid: Node[][] = [];
    for (let row = 0; row < 20; row++) {
      const currentRow: Node[] = [];
      for (let col = 0; col < 50; col++) {
        if (grid[row][col].isWall) currentRow.push(grid[row][col]);
        else currentRow.push(createNode(col, row));
      }
      newGrid.push(currentRow);
    }
    return newGrid;
  };

  const clearPath = () => {
    setGrid(getInitialGridWithoutPath());

    clearStyles();
  };

  const change = (event: any) => {
    setSelectedAlgorithm(event.target.value);
  };

  return (
    <ChakraProvider theme={theme}>
      <Flex alignItems="center" minH="100vh" flexDirection="column">
        <Header
          selectedAlgorithm={selectedAlgorithm}
          changeAlgorithm={change}
          createMaze={createMaze}
          clearMaze={clearMaze}
          visualize={visualize}
          clearPath={clearPath}
          selectedMaterial={selectedMaterial}
          setSelectedMaterial={setSelectedMaterial}
          change={change}
        />
        <VStack>
          <Box>
            <Grid
              grid={grid}
              cellRefs={cellRefs}
              handleCellClick={handleCellClick}
              selectedMaterial={selectedMaterial}
            />
            <HStack mt="2">
              <Heading fontSize="md">Choose material and draw:</Heading>
              {materials.map((material) => {
                return (
                  <Flex
                    key={material}
                    gap="2"
                    py="1"
                    px="4"
                    alignItems="center"
                    cursor="pointer"
                    _hover={{
                      background: "gray.200",
                    }}
                    onClick={() => {
                      console.log(material);
                      setSelectedMaterial(material);
                    }}
                    // Highlight the selected material
                    background={selectedMaterial === material ? "gray.200" : ""}
                  >
                    {material === "wall" && (
                      <>
                        <Box
                          display="inline-block"
                          w="20px"
                          h="20px"
                          bg="rgb(12, 53, 71)"
                        />
                        <Text fontSize="xl">-Wall</Text>
                      </>
                    )}
                    {material === "ground" && (
                      <>
                        <Image src="ground.png" />
                        <Text fontSize="xl">-Ground</Text>
                      </>
                    )}
                    {material === "water" && (
                      <>
                        <Image src="water.png" />
                        <Text fontSize="xl">-Water</Text>
                      </>
                    )}
                  </Flex>
                );
              })}
              <Button
                onClick={createMaze}
                _hover={{
                  background: "gray.300",
                }}
              >
                Generate Maze
              </Button>
              <Button onClick={clearMaze} colorScheme="red">
                Clear Maze
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Flex>
    </ChakraProvider>
  );
};
