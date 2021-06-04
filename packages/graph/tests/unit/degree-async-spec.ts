import { getDegreeAsync, getInDegreeAsync, getOutDegreeAsync } from '../../src';

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
    {
      id: 'H',
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
    {
      source: 'F',
      target: 'D',
    },
    {
      source: 'G',
      target: 'H',
    },
    {
      source: 'H',
      target: 'G',
    },
  ],
};

describe('(Async) degree algorithm', () => {
  it('getDegree', async () => {
    const degree = {
      A: {
        degree: 3,
        inDegree: 1,
        outDegree: 2,
      },
      B: {
        degree: 2,
        inDegree: 1,
        outDegree: 1,
      },
      C: {
        degree: 2,
        inDegree: 2,
        outDegree: 0,
      },
      D: {
        degree: 3,
        inDegree: 1,
        outDegree: 2,
      },
      E: {
        degree: 2,
        inDegree: 1,
        outDegree: 1,
      },
      F: {
        degree: 2,
        inDegree: 1,
        outDegree: 1,
      },
      G: {
        degree: 2,
        inDegree: 1,
        outDegree: 1,
      },
      H: {
        degree: 2,
        inDegree: 1,
        outDegree: 1,
      },
    };
    const result = await getDegreeAsync({ graphData: data });
    expect(result).toEqual(degree);
  });

  it('getInDegree', async () => {
    let result = await getInDegreeAsync({ graphData: data, nodeId: 'A' });
    expect(result).toBe(1);

    result = await getInDegreeAsync({ graphData: data, nodeId: 'C' });
    expect(result).toBe(2);

    result = await getInDegreeAsync({ graphData: data, nodeId: 'E' });
    expect(result).toBe(1);
  });

  it('getOutDegree', async () => {
    let result = await getOutDegreeAsync({ graphData: data, nodeId: 'A' });
    expect(result).toEqual(2);

    result = await getOutDegreeAsync({ graphData: data, nodeId: 'D' });
    expect(result).toEqual(2);

    result = await getOutDegreeAsync({ graphData: data, nodeId: 'F' });
    expect(result).toEqual(1);
  });
});
