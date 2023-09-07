import { Graph } from "@antv/graphlib";
import { floydWarshall } from "../../packages/graph/src";

const graph = new Graph<any, any>({
  nodes: [
    {
      id: 'A',
      data: {
      },
    },
    {
      id: 'B',
      data: {
      }
    },
    {
      id: 'C',
      data: {
      }
    },
    {
      id: 'D',
      data: {
      }
    },
    {
      id: 'E',
      data: {
      }
    },
    {
      id: 'F',
      data: {
      }
    },
    {
      id: 'G',
      data: {
      }
    },
    {
      id: 'H',
      data: {
      }
    },
  ],
  edges: [
    {
      id: 'e1',
      source: 'A',
      target: 'B',
      data: {},
    },
    {
      id: 'e2',
      source: 'B',
      target: 'C',
      data: {},
    },
    {
      id: 'e3',
      source: 'C',
      target: 'G',
      data: {},
    },
    {
      id: 'e4',
      source: 'A',
      target: 'D',
      data: {},
    },
    {
      id: 'e5',
      source: 'A',
      target: 'E',
      data: {},
    },
    {
      id: 'e6',
      source: 'E',
      target: 'F',
      data: {},
    },
    {
      id: 'e7',
      source: 'F',
      target: 'D',
      data: {},
    },
  ],
});

describe('Adjacency Matrix by Algorithm', () => {
  it('get graph shortestpath matrix', () => {
    const matrix = floydWarshall(graph);
    expect(Object.keys(matrix).length).toBe(8);
    const node0 = matrix[0];
    expect(node0.length).toBe(8);
    expect(node0[0]).toBe(0);
    expect(node0[1]).toBe(1);
    expect(node0[2]).toBe(2);
    expect(node0[3]).toBe(1);
    expect(node0[4]).toBe(1);
    expect(node0[5]).toBe(2);
    expect(node0[6]).toBe(3);
    expect(node0[7]).toBe(Infinity);
    expect(matrix[1][7]).toBe(Infinity);
    expect(matrix[2][7]).toBe(Infinity);
    expect(matrix[3][7]).toBe(Infinity);
  });

  it('directed', () => {
    // directed
    const matrix = floydWarshall(graph, true);
    expect(Object.keys(matrix).length).toBe(8);
    const node0 = matrix[0];
    expect(node0.length).toBe(8);
    expect(node0[0]).toBe(0);
    expect(node0[1]).toBe(1);
    expect(node0[2]).toBe(2);
    expect(node0[3]).toBe(1);
    expect(node0[4]).toBe(1);
    expect(node0[5]).toBe(2);
    expect(node0[6]).toBe(3);
    expect(node0[7]).toBe(Infinity);
    const node8 = matrix[6];
    expect(node8.length).toBe(8);
    expect(node8[1]).toBe(Infinity);
    expect(node8[6]).toBe(0);
  });
});
