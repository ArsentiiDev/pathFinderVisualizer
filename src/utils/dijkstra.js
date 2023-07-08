class MinHeap {
  constructor() {
    this.heap = [];
  }

  insert(node, distance) {
    this.heap.push([node, distance]);
    this.heapifyUp();
  }

  remove() {
    if (this.isEmpty()) {
      throw new Error('Heap is empty');
    }

    this.swap(0, this.heap.length - 1, this.heap)
    const lastNode = this.heap.pop();
    this.heapifyDown(0, this.heap.length -1, this.heap);
    return lastNode;
  }

  heapifyUp() {
    let currentIndex = this.size() - 1;
    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);
      if (this.heap[parentIndex][1] <= this.heap[currentIndex][1]) {
        break;
      }
      this.swap(parentIndex, currentIndex);
      currentIndex = parentIndex;
    }
  }

  heapifyDown(currentIdx, endIdx, heap) {
    let childOneIdx = currentIdx * 2 + 1;
    while (childOneIdx <= endIdx) {
      let childTwoIdx = currentIdx * 2 + 2 <=endIdx ?currentIdx * 2 + 2 : -1
      let idxToSwap = childOneIdx
      if (childTwoIdx !== -1 && heap[childTwoIdx][1] < heap[childOneIdx][1]) {
        idxToSwap = childTwoIdx
      }

      if (heap[idxToSwap][1] < heap[currentIdx][1]) {
        this.swap(idxToSwap, currentIdx, heap)
        currentIdx = idxToSwap
        childOneIdx = currentIdx*2 + 1
      } else {
        return;
      }
    }
  }

  swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.size() === 0;
  }
}

function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;

  const minDistancesHeap = new MinHeap();
  minDistancesHeap.insert(startNode, startNode.distance)

  while (minDistancesHeap.heap.length > 0) {
    const [node, distance] = minDistancesHeap.remove();
    if (node.isWall) continue;
    if (node.distance === Infinity) return visitedNodesInOrder;

    node.isVisited = true;
    visitedNodesInOrder.push(node);

    if (node === finishNode) return visitedNodesInOrder;

    updateUnvisitedNeighbors(node, grid, minDistancesHeap);
  }

  return visitedNodesInOrder;
}

function updateUnvisitedNeighbors(node, grid, minDistancesHeap) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);

  for (const neighbor of unvisitedNeighbors) {
    const distance = node.distance + 1;
    if (distance < neighbor.distance) {
      neighbor.distance = distance;
      neighbor.previousNode = node;
      minDistancesHeap.insert(neighbor, distance);
    }
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter((neighbor) => !neighbor.isVisited);
}


function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;

  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return nodesInShortestPathOrder;
}

module.exports = { dijkstra, getNodesInShortestPathOrder, Node }