import { Edge, ID } from '@antv/graphlib';
import type { CSC, EdgeData, Graph } from './types';

export function convertGraphData2CSC(graphData: Graph): CSC {
  const V: number[] = [];
  const E: number[] = [];
  const From: number[] = [];
  const To: number[] = [];
  const I: number[] = [];
  const nodeId2IndexMap: Record<string, number> = {};
  const edges: Edge<EdgeData>[] = []
  graphData.getAllNodes().forEach((node, i) => {
    nodeId2IndexMap[node.id] = i;
    V.push(i);
  });

  let lastSource: ID = '';
  let counter = 0;
  // sort by source
  [...graphData.getAllEdges()]
    .sort((a, b) => nodeId2IndexMap[a.source] - nodeId2IndexMap[b.source])
    .forEach((edgeConfig) => {
      const { source, target } = edgeConfig;
      edges.push(edgeConfig);
      E.push(nodeId2IndexMap[target]);
      From.push(nodeId2IndexMap[source]);
      To.push(nodeId2IndexMap[target]);

      if (source !== lastSource) {
        I.push(counter);
        lastSource = source;
      }

      counter++;
    });

  I.push(E.length);

  return {
    V,
    E,
    I,
    From,
    To,
    nodeId2IndexMap,
    edges,
  };
}
