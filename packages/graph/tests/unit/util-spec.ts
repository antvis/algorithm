import { getNeighbors, getEdgesByNodeId, getOutEdgesNodeId } from '../../src/util'

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

describe('algorithm util method', () => {
  it('getNeighbors', () => {
    
    let result = getNeighbors('A', data.edges);
    expect(result).toEqual(['B', 'C', 'D']);

    result = getNeighbors('A', data.edges, 'source')
    expect(result).toEqual(['D'])

    result = getNeighbors('A', data.edges, 'target')
    expect(result).toEqual(['B', 'C'])
  });

  it('getEdgesByNodeId', () => {
    const aEdges = [
      {
        source: 'A',
        target: 'B',
      },
      {
        source: 'A',
        target: 'C',
      },
      {
        source: 'D',
        target: 'A',
      },
    ]
    let result = getEdgesByNodeId('A', data.edges);
    expect(result).toEqual(aEdges);
  });
  
  it('getOutEdgesNodeId', () => {
    const aEdges = [
      {
        source: 'A',
        target: 'B',
      },
      {
        source: 'A',
        target: 'C',
      }
    ]
    let result = getOutEdgesNodeId('A', data.edges);
    expect(result).toEqual(aEdges);
  });
});
