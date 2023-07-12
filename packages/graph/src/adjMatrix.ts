import { Graph, Matrix } from "./types";

export function graph2AdjacencyMatrix(graph: Graph, directed?: boolean): Matrix[] {
  const matrix: Matrix[] = [];
  // map node with index in data.nodes
  const nodeMap: {
    [key: string]: number;
  } = {};

  graph.getAllNodes().forEach((node, i) => {
    nodeMap[node.id] = i;
    const row: number[] = [];
    matrix.push(row);
  });


  graph.getAllEdges().forEach((edge) => {
    const { source, target } = edge;
    const sIndex = nodeMap[source as string];
    const tIndex = nodeMap[target as string];
    if ((!sIndex && sIndex !== 0) || (!tIndex && tIndex !== 0)) return;
    matrix[sIndex][tIndex] = 1;
    if (!directed) {
      matrix[tIndex][sIndex] = 1;
    }
  });

  return matrix;
}