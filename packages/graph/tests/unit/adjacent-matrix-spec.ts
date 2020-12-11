import { getAdjMatrix } from '../../src';


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
    const matrix = getAdjMatrix(data);
    expect(Object.keys(matrix).length).toBe(8);
    const node0Adj = matrix[0];
    expect(node0Adj.length).toBe(5);
    expect(node0Adj[0]).toBe(undefined);
    expect(node0Adj[1]).toBe(1);
    expect(node0Adj[2]).toBe(undefined);
    expect(node0Adj[3]).toBe(1);
    expect(node0Adj[4]).toBe(1);

    const node1Adj = matrix[1];
    expect(node1Adj.length).toBe(3);
    expect(node1Adj[0]).toBe(1);
    expect(node1Adj[1]).toBe(undefined);
    expect(node1Adj[2]).toBe(1);
    
    const node5Adj = matrix[5];
    expect(node5Adj.length).toBe(5);
    expect(node5Adj[0]).toBe(undefined);
    expect(node5Adj[1]).toBe(undefined);
    expect(node5Adj[2]).toBe(undefined);
    expect(node5Adj[3]).toBe(1);
    expect(node5Adj[4]).toBe(1);
  });

  it('directed', () => {
    const matrix = getAdjMatrix(data, true);
    expect(Object.keys(matrix).length).toBe(8);
    const node0Adj = matrix[0];
    expect(node0Adj.length).toBe(5);
    expect(node0Adj[0]).toBe(undefined);
    expect(node0Adj[1]).toBe(1);
    expect(node0Adj[2]).toBe(undefined);
    expect(node0Adj[3]).toBe(1);
    expect(node0Adj[4]).toBe(1);

    const node1Adj = matrix[1]
    expect(node1Adj.length).toBe(3)
    expect(node1Adj[0]).toBe(undefined)
    expect(node1Adj[1]).toBe(undefined)
    expect(node1Adj[2]).toBe(1)
  });
});
