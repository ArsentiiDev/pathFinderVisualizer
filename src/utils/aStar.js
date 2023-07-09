import { getWeight } from "./helpers";

class Node {
    constructor(node) {
        this.id = node.row.toString() + '-' + node.col.toString();
        this.col = node.col;
        this.row = node.row;
        this.isWall= node.isWall;
        this.isGround = node.isGround;
        this.isWater = node.isWater;
        this.estimatedDistToEnd = node.estimatedDistToEnd;
        this.distanceFromStart = node.distance
        this.previousNode= null;
    }
  }
  
export default function aStarAlgorithm(startRow, startCol, endRow, endCol, graph) {
    const nodes = initializeNodes(graph)
  
    const startNode = nodes[startRow][startCol]
    const finishNode = nodes[endRow][endCol]

    const visitedNodesInOrder = []
  
    startNode.distanceFromStart = 0;
    startNode.estimatedDistToEnd = calculateManhattanDistance(startNode, finishNode);
  
    const nodesToVisit = new MinHeap([startNode])
    
    while (!nodesToVisit.isEmpty()) {
      const currentNode = nodesToVisit.remove()
  
      if (currentNode === finishNode) break;

      visitedNodesInOrder.push(currentNode)

  
      const neighbors = getNeighbors(currentNode, nodes)
      for (let neighbor of neighbors) {
        if (neighbor.isWall) continue;
  
        const tentativeDistanceToNeighbor = currentNode.distanceFromStart + getWeight(neighbor);
        if (tentativeDistanceToNeighbor >= neighbor.distanceFromStart) continue;
  
        neighbor.previousNode = currentNode;
        neighbor.distanceFromStart = tentativeDistanceToNeighbor;
        neighbor.estimatedDistToEnd = tentativeDistanceToNeighbor + calculateManhattanDistance(neighbor, finishNode);
  
        if (!nodesToVisit.containsNode(neighbor)) {
          nodesToVisit.insert(neighbor)
        } else {
          nodesToVisit.update(neighbor)
        }
      }
    }
    return [visitedNodesInOrder, reconstructPath(finishNode)]
  }
  
  function calculateManhattanDistance(currentNode, endNode) {
    const currentRow = currentNode.row;
    const currentCol = currentNode.col;
    const endRow = endNode.row;
    const endCol = endNode.col;
    
    return Math.abs(currentRow - endRow) + Math.abs(currentCol - endCol)
  }
  
  function initializeNodes(graph) {
    const nodes = [];
    for (let [i, row] of graph.entries()) {
      nodes.push([])
      for (let [j,gridNode] of row.entries()) {
        const node = new Node(gridNode)
        nodes[i].push(node)
      }
    }
    return nodes
  }
  
  function getNeighbors(node, nodes) {
    const neighbors = []
  
    const numRows = nodes.length;
    const numCols = nodes[0].length;
  
    const row = node.row;
    const col = node.col;
  
    if (row < numRows -1) {
      neighbors.push(nodes[row + 1][col])
    }
  
    if (row > 0) {
      neighbors.push(nodes[row -1][col])
    }
  
    if (col < numCols -1) {
      neighbors.push(nodes[row][col + 1])
    }
  
    if(col > 0) {
      neighbors.push(nodes[row][col - 1])
    }
    
    return neighbors;
  }
  
  function reconstructPath(endNode) {
    if (endNode.previousNode === null) return []
    let currentNode = endNode;
    const path = []
    while (currentNode !== null) {
      path.push(currentNode);
      currentNode = currentNode.previousNode;
    }
    path.reverse();
    return path
  }
  
  class MinHeap {
    constructor(array) {
      this.nodePositionsInHeap = array.reduce((obj, node, i) => {
        obj[node.id] = i;
        return obj
      }, {})
      this.heap = this.buildHeap(array);
    }
  
    isEmpty() {
      return this.heap.length === 0;
    }
  
    buildHeap(array) {
      const firstParentIdx = Math.floor((array.length -2) / 2);
      for (let currentIdx = firstParentIdx; currentIdx >=0 ; currentIdx--){
        this.siftDown(currentIdx, array.length - 1, array)
      }
      return array;
    }
  
    siftDown(currentIdx, endIdx, heap) {
      let childOneIdx = currentIdx*2 + 1;
      while (childOneIdx <=endIdx) {
        let childTwoIdx = currentIdx * 2 + 2 <= endIdx ? currentIdx * 2 + 2 : -1;
        let idxToSwap = childOneIdx
        if (childTwoIdx !== -1 && heap[childTwoIdx].estimatedDistToEnd < heap[childOneIdx].estimatedDistToEnd) {
          idxToSwap = childTwoIdx
        }
  
        if (heap[idxToSwap].estimatedDistToEnd < heap[currentIdx].estimatedDistToEnd) {
          this.swap(idxToSwap, currentIdx, heap)
          currentIdx = idxToSwap;
          childOneIdx = currentIdx*2 + 1;
        } else {
          return;
        }
      }
    }
  
    remove() {
      if(this.isEmpty()) return;
  
      this.swap(0, this.heap.length -1, this.heap)
      const node = this.heap.pop()
      delete this.nodePositionsInHeap[node.id];
      this.siftDown(0, this.heap.length -1, this.heap)
      return node;
    }
  
    insert(node) {
      this.heap.push(node);
      this.nodePositionsInHeap[node.id] = this.heap.length - 1;
      this.siftUp(this.heap.length - 1, this.heap)
    }
  
    containsNode(node) {
      return node.id in this.nodePositionsInHeap
    }
  
    update(node) {
      this.siftUp(this.nodePositionsInHeap[node.id], this.heap)
    }
  
    siftUp(currentIdx, heap) {
      let parentIdx = Math.floor((currentIdx -1) / 2);
      while (currentIdx > 0 && heap[currentIdx].estimatedDistToEnd < heap[parentIdx].estimatedDistToEnd) {
        this.swap(currentIdx, parentIdx, heap)
        currentIdx = parentIdx;
        parentIdx = Math.floor((currentIdx -1) / 2);
      }
    }
  
    swap(i, j, heap) {
      this.nodePositionsInHeap[this.heap[i].id] = j;
      this.nodePositionsInHeap[this.heap[j].id] = i;
      const temp = heap[j];
      heap[j] = heap[i]
      heap[i] = temp;
    }
  }