import { minimumSpanningTree } from '../../src';

const data = {
  nodes: [
    {
      id: 'A',
    },
    {
      id: 'B',
    },
    {
      id: 'C',
    },
    {
      id: 'D',
    },
    {
      id: 'E',
    },
    {
      id: 'F',
    },
    {
      id: 'G',
    },
  ],
  edges: [
    {
      source: 'A',
      target: 'B',
      weight: 1,
    },
    {
      source: 'B',
      target: 'C',
      weight: 1,
    },
    {
      source: 'A',
      target: 'C',
      weight: 2,
    },
    {
      source: 'D',
      target: 'A',
      weight: 3,
    },
    {
      source: 'D',
      target: 'E',
      weight: 4,
    },
    {
      source: 'E',
      target: 'F',
      weight: 2,
    },
    {
      source: 'F',
      target: 'D',
      weight: 3,
    },
  ],
};

describe('minimumSpanningTree', () => {
  it('test kruskal algorithm', () => {
    const result = minimumSpanningTree({
      graphData: data,
      weight: 'weight',
    });
    let totalWeight = 0;
    for (const edge of result) {
      totalWeight += edge.weight;
    }
    expect(totalWeight).toEqual(10);
  });

  it('test prim algorithm', () => {
    const result = minimumSpanningTree({
      graphData: data,
      weight: 'weight',
      algo: 'prim',
    });
    let totalWeight = 0;
    for (const edge of result) {
      totalWeight += edge.weight;
    }
    expect(totalWeight).toEqual(10);
  });
});
