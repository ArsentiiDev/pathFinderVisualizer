import {
  VStack,
  Select,
  Button,
  Flex,
  Box,
  Text,
  Image,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { useEffect } from "react";

interface SidebarProps {
  selectedAlgorithm: string | undefined;
  changeAlgorithm: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  createMaze: () => void;
  clearMaze: () => void;
  visualize: () => void;
  clearPath: () => void;
  selectedMaterial: string | null;
  setSelectedMaterial: (material: string | null) => void;
  change: (event: any) => void;
}

export const Header = ({
  selectedAlgorithm,
  changeAlgorithm,
  createMaze,
  clearMaze,
  visualize,
  clearPath,
  selectedMaterial,
  setSelectedMaterial,
  change
}: SidebarProps) => {
  useEffect(() => {
    setSelectedMaterial(null);
  }, [setSelectedMaterial]);

  return (
    <HStack
      px="4"
      py="6"
      h="10vh"
      minW="100%"
      background="gray.200"
      boxShadow="sm"
      gap="8"
      roundedBottom="lg"
      mb="4"
    >
      <Flex alignItems="center" gap="2">
        <Image src="start-node.svg" />
        <Text fontSize="lg">- start node</Text>
      </Flex>
      <Flex alignItems="center" gap="2">
        <Image src="end-node.svg" />
        <Text fontSize="lg">- finish node</Text>
      </Flex>
      <VStack>
        <Select
          placeholder="Select algorithm to visualize:"
          onChange={change}
          cursor="pointer"
          value={selectedAlgorithm}
        >
          <option value="Dijkstra">Dijkstra</option>
          <option value="A*">A*</option>
        </Select>
      </VStack>
      <Heading fontSize="xl" mx="4">
        Visualize {selectedAlgorithm}
      </Heading>
      <Button onClick={visualize} colorScheme="purple" w="15%">
        Visualize
      </Button>
      <Button onClick={clearPath} colorScheme="red">
        Clear Path
      </Button>
    </HStack>
  );
};
