import { GraphData, Matrix } from "./types";

const adjMatrix = (graphData: GraphData, directed?: boolean) => {
  const { nodes, edges } = graphData;
  const matrix: Matrix[] = [];
  // map node with index in data.nodes
  const nodeMap: {
    [key: string]: number;
  } = {};

  if (!nodes) {
    throw new Error("invalid nodes data!");
  }

  if (nodes) {
    nodes.forEach((node, i) => {
      nodeMap[node.id] = i;
      const row: number[] = [];
      matrix.push(row);
    });
  }

  if (edges) {
    edges.forEach((edge) => {
      const { source, target } = edge;
      const sIndex = nodeMap[source as string];
      const tIndex = nodeMap[target as string];
      if ((!sIndex && sIndex !== 0) || (!tIndex && tIndex !== 0)) return;
      matrix[sIndex][tIndex] = 1;
      if (!directed) {
        matrix[tIndex][sIndex] = 1;
      }
    });
  }
  return matrix;
};

export default adjMatrix;
