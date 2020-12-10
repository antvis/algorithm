import { getNeighbors, getAdjMatrix, getEdgesByNodeId, getOutEdgesNodeId } from '../../src/util'

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

  it('getAdjMatrix', () => {
    let result = getAdjMatrix(data);
    expect(result.length).toBe(8);
    
    const first = result[0]
    expect(first.length).toBe(4) 
    expect(first[0]).toBe(undefined)
    expect(first[1]).toBe(1)
    expect(first[2]).toBe(1)
    expect(first[3]).toBe(1)
    
    const five = result[4]
    expect(five.length).toBe(6)
    expect(five[0]).toBe(undefined)
    expect(five[3]).toBe(1)
    expect(five[4]).toBe(undefined)
    expect(five[5]).toBe(1)

    result = getAdjMatrix(data, true);
    expect(result.length).toBe(8)

    const node1 = result[1]
    expect(node1.length).toBe(3)
    expect(node1[0]).toBe(undefined)
    expect(node1[1]).toBe(undefined)
    expect(node1[2]).toBe(1)

    const node3 = result[2]
    expect(node3.length).toBe(0)

    const node5 = result[4]
    expect(node5.length).toBe(6)
    expect(node5[0]).toBe(undefined)
    expect(node5[5]).toBe(1)
  });
});
