import { Graph, Matrix } from "./types";

function getAdjMatrix(graph: Graph, directed: boolean) {
  const nodes = graph.getAllNodes();
  const matrix: Matrix[] = [];
  // map node with index in data.nodes
  const nodeMap = new Map<string | number, number>();

  if (!nodes) {
    throw new Error("invalid nodes data!");
  }

  if (nodes) {
    nodes.forEach((node, i) => {
      nodeMap.set(node.id, i);
      const row: number[] = [];
      matrix.push(row);
    });
  }

  const edges = graph.getAllEdges();
  if (edges) {
    edges.forEach((edge) => {
      const { source, target } = edge;
      const sIndex = nodeMap.get(source);
      const tIndex = nodeMap.get(target);
      if ((!sIndex && sIndex !== 0) || (!tIndex && tIndex !== 0)) return;
      matrix[sIndex][tIndex] = 1;
      if (!directed) {
        matrix[tIndex][sIndex] = 1;
      }
    });
  }
  return matrix;
}

export function floydWarshall(
  graph: Graph,
  directed = false,
) {
  const adjacentMatrix = getAdjMatrix(graph, directed);

  const dist: Matrix[] = [];
  const size = adjacentMatrix.length;
  for (let i = 0; i < size; i += 1) {
    dist[i] = [];
    for (let j = 0; j < size; j += 1) {
      if (i === j) {
        dist[i][j] = 0;
      } else if (adjacentMatrix[i][j] === 0 || !adjacentMatrix[i][j]) {
        dist[i][j] = Infinity;
      } else {
        dist[i][j] = adjacentMatrix[i][j];
      }
    }
  }
  // floyd
  for (let k = 0; k < size; k += 1) {
    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        if (dist[i][j] > dist[i][k] + dist[k][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  return dist;
}