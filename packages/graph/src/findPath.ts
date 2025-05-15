import { ID, Node } from "@antv/graphlib";
import { Graph, NodeData } from "./types";
import { dijkstra } from "./dijkstra";

export const findShortestPath = (
  graph: Graph,
  start: ID,
  end: ID,
  directed?: boolean,
  weightPropertyName?: string
) => {
  const { length, path, allPath } = dijkstra(
    graph,
    start,
    directed,
    weightPropertyName
  );
  return { length: length[end], path: path[end], allPath: allPath[end] };
};

export const findAllPath = (
  graph: Graph,
  start: ID,
  end: ID,
  directed?: boolean
) => {
  if (start === end) return [[start]];

  const visited = [start];
  const isVisited = { [start]: true };
  const stack: Node<NodeData>[][] = []; // 辅助栈，用于存储访问过的节点的邻居节点
  const allPath = [];
  let neighbors = directed
    ? graph.getSuccessors(start)
    : graph.getNeighbors(start);
  stack.push(neighbors);

  while (visited.length > 0 && stack.length > 0) {
    const children = stack[stack.length - 1];
    if (children.length) {
      const child = children.shift();
      if (child) {
        visited.push(child.id);
        isVisited[child.id] = true;
        neighbors = directed
          ? graph.getSuccessors(child.id)
          : graph.getNeighbors(child.id);
        stack.push(neighbors.filter((neighbor) => !isVisited[neighbor.id]));
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