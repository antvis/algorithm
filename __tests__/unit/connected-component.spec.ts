import { getConnectedComponents } from "../../packages/graph/src";
import { Graph } from "@antv/graphlib";
import connectedTestData from '../data/connected-test-data.json';
import { dataTransformer } from "../../packages/graph/src/utils";

const data = {
  nodes: [
    {
      id: 'A',
      data: {},
    },
    {
      id: 'B',
      data: {},
    },
    {
      id: 'C',
      data: {},
    },
    {
      id: 'D',
      data: {},
    },
    {
      id: 'E',
      data: {},
    },
    {
      id: 'F',
      data: {},
    },
    {
      id: 'G',
      data: {},
    },
    {
      id: 'H',
      data: {},
    },
  ],
  edges: [
    {
      id: 'edge-0',
      source: 'A',
      target: 'B',
      data: {},
    },
    {
      id: 'edge-1',
      source: 'B',
      target: 'C',
      data: {},
    },
    {
      id: 'edge-2',
      source: 'A',
      target: 'C',
      data: {},
    },
    {
      id: 'edge-3',
      source: 'D',
      target: 'A',
      data: {},
    },
    {
      id: 'edge-4',
      source: 'D',
      target: 'E',
      data: {},
    },
    {
      id: 'edge-5',
      source: 'E',
      target: 'F',
      data: {},
    },
    {
      id: 'edge-6',
      source: 'F',
      target: 'D',
      data: {},
    },
    {
      id: 'edge-7',
      source: 'G',
      target: 'H',
      data: {},
    },
    {
      id: 'edge-8',
      source: 'H',
      target: 'G',
      data: {},
    },
  ],
};
const graph = new Graph(data);

describe('find connected components', () => {
  it('detect strongly connected components in undirected graph', () => {
    let result = getConnectedComponents(graph, false);
    expect(result.length).toEqual(2);
    expect(result[0].map((node) => node.id).sort()).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
    expect(result[1].map((node) => node.id).sort()).toEqual(['G', 'H']);
  });

  it('detect strongly connected components in directed graph', () => {
    let result = getConnectedComponents(graph, true);
    expect(result.length).toEqual(5);
    expect(result[3].map((node) => node.id).sort()).toEqual(['D', 'E', 'F']);
    expect(result[4].map((node) => node.id).sort()).toEqual(['G', 'H']);
  });


  it('test connected components detection performance using large graph', () => {
    const testData = dataTransformer(connectedTestData);
    testData.nodes.forEach((node) => {
      node.data.label = node.data.olabel;
      node.data.degree = 0;
      data.edges.forEach((edge) => {
        if (edge.source === node.id || edge.target === node.id) {
          (node.data.degree as number) += 1;
        }
      });
    });
    const graph = new Graph(testData);
    let directedComps = getConnectedComponents(graph, true);
    let undirectedComps = getConnectedComponents(graph, false);
    expect(directedComps.length).toEqual(1589);
    expect(undirectedComps.length).toEqual(396);

  });

});
