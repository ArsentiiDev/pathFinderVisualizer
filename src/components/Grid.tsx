import { Box, HStack, VStack } from "@chakra-ui/react";
import { Node } from "../interfaces";
import { useCallback, useState } from "react";

interface GridProps {
  grid: Node[][];
  cellRefs: React.MutableRefObject<HTMLDivElement[][]>;
  handleCellClick: (row: number, col: number) => void;
  selectedMaterial: string | null;
}

const Grid = ({
  grid,
  cellRefs,
  handleCellClick,
  selectedMaterial,
}: GridProps) => {
    const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setIsMouseDown(true);
    },
    []
  );

  const handleMouseUp = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setIsMouseDown(false);
    },
    []
  );
  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const target = event.target as HTMLDivElement;
      const { row, col } = target.dataset;
      if (isMouseDown && row && col) {
        handleCellClick(+row, +col);
      }
    },
    [isMouseDown]
  );
  return (
    <VStack gap="0">
      {grid.map((row: Node[], rowIndex: number) => (
        <HStack key={rowIndex} gap="0">
          {row.map((node: Node, colIndex: number) => {
            const {
              isFinish,
              isWall,
              isStart,
              isVisited,
              isPath,
              isGround,
              isWater,
            } = node;
            let extraClassName = isFinish
              ? "node-finish"
              : isStart
              ? "node-start"
              : isWall
              ? "node-wall"
              : isGround
              ? "node-ground"
              : isWater
              ? "node-water"
              : "";
            return (
              <Box
                ref={(ref: any) => {
                  cellRefs.current[rowIndex][colIndex] = ref;
                }}
                id={`node-${rowIndex}-${colIndex}`}
                key={colIndex}
                className={`${extraClassName} ${
                  isVisited ? "node-visited" : ""
                } ${isPath ? "node-shortest-path" : ""} ${
                  node.isGround ? "node-ground" : ""
                } ${node.isWater ? "node-water" : ""}`}
                cursor="pointer"
                w="28px"
                h="28px"
                border="1px"
                onClick={() => handleCellClick(rowIndex, colIndex)}
                data-row={rowIndex}
                data-col={colIndex}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseEnter={handleMouseEnter}
              ></Box>
            );
          })}
        </HStack>
      ))}
    </VStack>
  );
};

export default Grid;
