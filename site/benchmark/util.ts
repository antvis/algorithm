import { Graph, ID } from "@antv/graphlib";

export function graph2Edgelist(graph: Graph<any, any>, weightPropertyName?: string) {
  const edgelist: number[][] = [];
  const nodeIdxMap: Record<ID, number> = {};
  const idxNodeMap: Record<number, ID> = {};
  const edges = graph.getAllEdges();
  graph.getAllNodes().forEach((node, i) => {
    nodeIdxMap[node.id] = i;
    idxNodeMap[i] = node.id;
  });
  edges.forEach((edge) => {
    if (weightPropertyName) {
      edgelist.push([nodeIdxMap[edge.source], nodeIdxMap[edge.target], edge.data[weightPropertyName] || 1]);
    } else {
      edgelist.push([nodeIdxMap[edge.source], nodeIdxMap[edge.target]]);
    }
  });
  return { edgelist, nodeIdxMap, idxNodeMap };
}