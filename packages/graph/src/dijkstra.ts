import { GraphData, NodeConfig, EdgeConfig } from "./types";
import { getOutEdgesNodeId, getEdgesByNodeId } from "./util";

const minVertex = (
  D: { [key: string]: number },
  nodes: NodeConfig[],
  marks: { [key: string]: boolean },
): NodeConfig => {
  // 找出最小的点
  let minDis = Infinity;
  let minNode;
  for (let i = 0; i < nodes.length; i++) {
    const nodeId = nodes[i].id;
    if (!marks[nodeId] && D[nodeId] <= minDis) {
      minDis = D[nodeId];
      minNode = nodes[i];
    }
  }
  return minNode;
}

const dijkstra = (
  graphData: GraphData,
  source: string,
  directed?: boolean,
  weightPropertyName?: string,
) => {
  const { nodes = [], edges = [] } = graphData;
  const nodeIds = [];
  const marks = {};
  const D = {};
  const prevs = {}; // key: 顶点, value: 顶点的前驱点数组（可能有多条等长的最短路径）
  nodes.forEach((node, i) => {
    const id = node.id;
    nodeIds.push(id);
    D[id] = Infinity;
    if (id === source) D[id] = 0;
  });

  const nodeNum = nodes.length;
  for (let i = 0; i < nodeNum; i++) {
    // Process the vertices
    const minNode = minVertex(D, nodes, marks);
    const minNodId = minNode.id;
    marks[minNodId] = true;

    if (D[minNodId] === Infinity) continue; // Unreachable vertices cannot be the intermediate point

    let relatedEdges: EdgeConfig[] = [];
    if (directed) relatedEdges = getOutEdgesNodeId(minNodId, edges);
    else relatedEdges = getEdgesByNodeId(minNodId, edges);

    relatedEdges.forEach((edge) => {
      const edgeTarget = edge.target;
      const edgeSource = edge.source;
      const w = edgeTarget === minNodId ? edgeSource : edgeTarget;
      const weight =
        weightPropertyName && edge[weightPropertyName]
          ? edge[weightPropertyName]
          : 1;
      if (D[w] > D[minNode.id] + weight) {
        D[w] = D[minNode.id] + weight;
        prevs[w] = minNode.id;
      }
    });
  }
  const path = {};
  for (const target in D) {
    path[target] = [target];
    let prev = prevs[target];
    while (prev !== undefined) {
      path[target].unshift(prev);
      prev = prevs[prev];
    }
  }

  return { length: D, path };
};

export default dijkstra;
