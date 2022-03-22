import type { GraphData, CSC, EdgeConfig } from './types';

export function convertGraphData2CSC(graphData: GraphData): CSC {
  const V: number[] = [];
  const E: number[] = [];
  const From: number[] = [];
  const To: number[] = [];
  const I: number[] = [];
  const nodeId2IndexMap: Record<string, number> = {};
  const edges: EdgeConfig[] = []
  graphData.nodes.forEach((node, i) => {
    nodeId2IndexMap[node.id] = i;
    V.push(i);
  });

  let lastSource = '';
  let counter = 0;
  // sort by source
  [...graphData.edges]
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
