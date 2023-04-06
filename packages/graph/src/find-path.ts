import dijkstra from './dijkstra';
import { GraphData } from './types';
import { getNeighbors } from './util';

export const findShortestPath = (
  graphData: GraphData,
  start: string,
  end: string,
  directed?: boolean,
  weightPropertyName?: string,
) => {
  const { length, path, allPath, edgePath, allEdgePath } = dijkstra(
    graphData,
    start,
    directed,
    weightPropertyName,
  );
  return {
    length: length[end],
    path: path[end],
    allPath: allPath[end],
    edgePath: edgePath[end],
    allEdgePath: allEdgePath[end],
  };
};

export const findAllPath = (
  graphData: GraphData,
  start: string,
  end: string,
  directed?: boolean,
) => {
  if (start === end) return [[start]];

  const { edges = [] } = graphData;

  const visited = [start];
  const isVisited = { [start]: true };
  const stack: string[][] = []; // 辅助栈，用于存储访问过的节点的邻居节点
  const allPath = [];
  let neighbors = directed ? getNeighbors(start, edges, 'target') : getNeighbors(start, edges);
  stack.push(neighbors);

  while (visited.length > 0 && stack.length > 0) {
    const children = stack[stack.length - 1];
    if (children.length) {
      const child = children.shift();
      if (child) {
        visited.push(child);
        isVisited[child] = true;
        neighbors = directed ? getNeighbors(child, edges, 'target') : getNeighbors(child, edges);
        stack.push(neighbors.filter((neighbor) => !isVisited[neighbor]));
      }
    } else {
      const node = visited.pop();
      isVisited[node] = false;
      stack.pop();
      continue;
    }

    if (visited[visited.length - 1] === end) {
      const path = visited.map((node) => node);
      allPath.push(path);

      const node = visited.pop();
      isVisited[node] = false;
      stack.pop();
    }
  }

  return allPath;
};
