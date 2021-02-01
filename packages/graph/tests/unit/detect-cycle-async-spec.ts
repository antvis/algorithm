import { getAlgorithm } from './utils';

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
    },
    {
      source: 'B',
      target: 'C',
    },
    {
      source: 'A',
      target: 'C',
    },
    {
      source: 'D',
      target: 'A',
    },
    {
      source: 'D',
      target: 'E',
    },
    {
      source: 'E',
      target: 'F',
    },
  ],
};

describe('(Async) detectDirectedCycle', () => {
  it('should detect directed cycle', async () => {
    const { detectCycleAsync } = await getAlgorithm();

    let result = await detectCycleAsync(data);
    expect(result).toBeNull();

    data.edges.push({
      source: 'F',
      target: 'D',
    });

    result = await detectCycleAsync(data);
    expect(result).toEqual({
      D: 'F',
      F: 'E',
      E: 'D',
    });
  });
});
