export interface Node {
    col: number;
    row: number;
    isStart: boolean;
    isFinish: boolean;
    distance: number;
    isVisited: boolean;
    isWall: boolean;
    previousNode: Node | null;
    isPath: boolean; // ADD THIS
    isVisitedAnimationDone: boolean; // ADD THIS
  }