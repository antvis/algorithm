import { Graph } from "@antv/graphlib";
import { pageRank } from "../../packages/graph/src";

describe('Calculate pagerank of graph nodes', () => {
  test('calculate pagerank', () => {
    const graph = new Graph<any, any>({
      nodes: [
        {
          id: 'A',
          data: {}
        },
        {
          id: 'B',
          data: {}
        },
        {
          id: 'C',
          data: {}
        },
        {
          id: 'D',
          data: {}
        },
        {
          id: 'E',
          data: {}
        },
        {
          id: 'F',
          data: {}
        },
        {
          id: 'G',
          data: {}
        },
        {
          id: 'H',
          data: {}
        },
        {
          id: 'I',
          data: {}
        },
        {
          id: 'J',
          data: {}
        },
        {
          id: 'K',
          data: {}
        }
      ],
      edges: [
        {
          id: 'e0',
          source: 'D',
          target: 'A',
          data: {}
        },
        {
          id: 'e1',
          source: 'D',
          target: 'B',
          data: {}
        },
        {
          id: 'e2',
          source: 'B',
          target: 'C',
          data: {}
        },
        {
          id: 'e3',
          source: 'C',
          target: 'B',
          data: {}
        },
        {
          id: 'e4',
          source: 'F',
          target: 'B',
          data: {}
        },
        {
          id: 'e5',
          source: 'F',
          target: 'E',
          data: {}
        },
        {
          id: 'e6',
          source: 'E',
          target: 'F',
          data: {}
        },
        {
          id: 'e7',
          source: 'E',
          target: 'D',
          data: {}
        },
        {
          id: 'e8',
          source: 'E',
          target: 'B',
          data: {}
        },
        {
          id: 'e9',
          source: 'K',
          target: 'E',
          data: {}
        },
        {
          id: 'e10',
          source: 'J',
          target: 'E',
          data: {}
        },
        {
          id: 'e11',
          source: 'I',
          target: 'E',
          data: {}
        },
        {
          id: 'e12',
          source: 'H',
          target: 'E',
          data: {}
        },
        {
          id: 'e13',
          source: 'G',
          target: 'E',
          data: {}
        },
        {
          id: 'e14',
          source: 'G',
          target: 'B',
          data: {}
        },
        {
          id: 'e15',
          source: 'H',
          target: 'B',
          data: {}
        },
        {
          id: 'e16',
          source: 'I',
          target: 'B',
          data: {}
        },
      ],
    });

    const result = pageRank(graph);

    let maxNodeId;
    let maxVal = 0;
    for (let nodeId in result) {
      const val = result[nodeId];
      if (val >= maxVal) {
        maxNodeId = nodeId;
        maxVal = val
      }
    }
    expect(maxNodeId).toBe('B')
  })
});