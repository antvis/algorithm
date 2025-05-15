import { Graph } from "@antv/graphlib";
import { findShortestPath, findAllPath } from "../../packages/graph/src";

const graph = new Graph<any, any>({
  nodes: [
    {
      id: 'A',
      data: {}
    },
    {
      id: 'B',
      data: {}
    },
    {
      id: 'C',
      data: {}
    },
    {
      id: 'D',
      data: {}
    },
    {
      id: 'E',
      data: {}
    },
    {
      id: 'F',
      data: {}
    },
    {
      id: 'G',
      data: {}
    },
    {
      id: 'H',
      data: {}
    },
  ],
  edges: [
    {
      id: 'e1',
      source: 'A',
      target: 'B',
      data: {}
    },
    {
      id: 'e2',
      source: 'B',
      target: 'C',
      data: {}
    },
    {
      id: 'e3',
      source: 'C',
      target: 'G',
      data: {}
    },
    {
      id: 'e4',
      source: 'A',
      target: 'D',
      data: {}
    },
    {
      id: 'e5',
      source: 'A',
      target: 'E',
      data: {}
    },
    {
      id: 'e6',
      source: 'E',
      target: 'F',
      data: {}
    },
    {
      id: 'e7',
      source: 'F',
      target: 'D',
      data: {}
    },
    {
      id: 'e8',
      source: 'D',
      target: 'E',
      data: {}
    },
  ],
});

describe('Shortest Path from source to target on graph', () => {
  it('find the shortest path', () => {
    const { length, path } = findShortestPath(graph, 'A', 'C');
    expect(length).toBe(2);
    expect(path).toStrictEqual(['A', 'B', 'C']);
  });

  it('find all shortest paths', () => {
    const { length, allPath } = findShortestPath(graph, 'A', 'F');
    expect(length).toBe(2);
    expect(allPath[0]).toStrictEqual(['A', 'E', 'F']);
    expect(allPath[1]).toStrictEqual(['A', 'D', 'F']);

    const {
      length: directedLenght,
      path: directedPath,
      allPath: directedAllPath,
    } = findShortestPath(graph, 'A', 'F', true);
    expect(directedLenght).toBe(2);
    expect(directedAllPath[0]).toStrictEqual(['A', 'E', 'F']);
    expect(directedPath).toStrictEqual(['A', 'E', 'F']);
  });

  it('find all paths', () => {
    const allPath = findAllPath(graph, 'A', 'E');
    expect(allPath.length).toBe(3);
    expect(allPath[0]).toStrictEqual(['A', 'D', 'F', 'E']);
    expect(allPath[1]).toStrictEqual(['A', 'D', 'E']);
    expect(allPath[2]).toStrictEqual(['A', 'E']);
  });

  it('find all paths in directed graph', () => {
    const allPath = findAllPath(graph, 'A', 'E', true);
    expect(allPath.length).toStrictEqual(2);
    expect(allPath[0]).toStrictEqual(['A', 'D', 'E']);
    expect(allPath[1]).toStrictEqual(['A', 'E']);
  });

  it('find all shortest paths in weighted graph', () => {
    graph.getAllEdges().forEach((edge, i) => {
      edge.data.weight = ((i % 2) + 1) * 2;
      if (edge.source === 'F' && edge.target === 'D') edge.data.weight = 10;
    });
    const { length, path, allPath } = findShortestPath(graph, 'A', 'F', false, 'weight');
    expect(length).toBe(6);
    expect(allPath[0]).toStrictEqual(['A', 'E', 'F']);
    expect(path).toStrictEqual(['A', 'E', 'F']);
  });
});