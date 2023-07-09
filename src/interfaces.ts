export interface Node {
    col: number;
    row: number;
    isStart: boolean;
    isFinish: boolean;
    distance: number;
    isVisited: boolean;
    isWall: boolean;
    isWater: boolean;
    isGround: boolean;
    previousNode: Node | null;
    estimatedDistToEnd: number;
    isPath: boolean;
    isVisitedAnimationDone: boolean;
  }