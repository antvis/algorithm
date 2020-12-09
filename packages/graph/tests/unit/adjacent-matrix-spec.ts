import { adjacentMatrix } from '../../src';


const data = {
  nodes: [
    {
      id: 'A',
      label: '0',
    },
    {
      id: 'B',
      label: '1',
    },
    {
      id: 'C',
      label: '2',
    },
    {
      id: 'D',
      label: '3',
    },
    {
      id: 'E',
      label: '4',
    },
    {
      id: 'F',
      label: '5',
    },
    {
      id: 'G',
      label: '6',
    },
    {
      id: 'H',
      label: '7',
    },
  ],
  edges: [
    {
      source: 'A',
      target: 'B',
    },
    {
      source: 'B',
      target: 'C',
    },
    {
      source: 'C',
      target: 'G',
    },
    {
      source: 'A',
      target: 'D',
    },
    {
      source: 'A',
      target: 'E',
    },
    {
      source: 'E',
      target: 'F',
    },
    {
      source: 'F',
      target: 'D',
    },
  ],
};

describe('Adjacency Matrix', () => {
  it('undirected', () => {
    const matrix = adjacentMatrix(data);
    expect(Object.keys(matrix).length).toBe(8);
    const node0Adj = matrix[0];
    expect(node0Adj.length).toBe(5);
    expect(node0Adj[0]).toBe(undefined);
    expect(node0Adj[1]).toBe(1);
    expect(node0Adj[2]).toBe(undefined);
    expect(node0Adj[3]).toBe(1);
    expect(node0Adj[4]).toBe(1);
  });

  it('directed', () => {
    // do not use the cache and directed
    const matrix = adjacentMatrix(data, true);;
    console.log(matrix)
    expect(Object.keys(matrix).length).toBe(8);
    const node0Adj = matrix[0];
    expect(node0Adj.length).toBe(5);
    expect(node0Adj[0]).toBe(undefined);
    expect(node0Adj[1]).toBe(1);
    expect(node0Adj[2]).toBe(undefined);
    expect(node0Adj[3]).toBe(1);
    expect(node0Adj[4]).toBe(1);
    const node8Adj = matrix[8];
    expect(node8Adj.length).toBe(1);
    expect(node8Adj[0]).toBe(1);
  });
});
