import { floydWarshallAsync } from '../../src';

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

describe('(Async) Adjacency Matrix by Algorithm', () => {
  it('get graph shortestpath matrix', async () => {
    const matrix = await floydWarshallAsync({ graphData: data });
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

  it('directed', async () => {
    // directed
    const matrix = await floydWarshallAsync({ graphData: data, directed: true });
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
