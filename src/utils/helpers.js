import { materials } from "../constants/constants";

export function isStartOrFinishNode(node, startNode, finishNode) {
    return node === startNode || node === finishNode
}

export function getWeight(node) {
  if (node.isWater) {
    return materials.water;
  } else if (node.isGround) {
    return materials.ground;
  } else return 1;
}
