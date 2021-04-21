import { getDegreeAsync } from '../../src'

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

describe('degree async algorithm', () => {
  it('getDegreeAsync', async () => {
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

    const result = await getDegreeAsync(data);
    expect(result).toEqual(degree);
  });
});
