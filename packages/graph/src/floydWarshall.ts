import adjMatrix from './adjacent-matrix';
import { GraphData, Matrix } from './types';

const floydWarshall = (graphData: GraphData, directed?: boolean) => {
  const adjacentMatrix = adjMatrix(graphData, directed);;

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
};

export default floydWarshall;
