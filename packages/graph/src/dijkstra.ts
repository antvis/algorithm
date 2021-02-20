import { isArray } from '@antv/util';
import { GraphData, NodeConfig, EdgeConfig } from './types';
import { getOutEdgesNodeId, getEdgesByNodeId } from './util';

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
};

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
    const minNodeId = minNode.id;
    marks[minNodeId] = true;

    if (D[minNodeId] === Infinity) continue; // Unreachable vertices cannot be the intermediate point

    let relatedEdges: EdgeConfig[] = [];
    if (directed) relatedEdges = getOutEdgesNodeId(minNodeId, edges);
    else relatedEdges = getEdgesByNodeId(minNodeId, edges);

    relatedEdges.forEach(edge => {
      const edgeTarget = edge.target;
      const edgeSource = edge.source;
      const w = edgeTarget === minNodeId ? edgeSource : edgeTarget;
      const weight = weightPropertyName && edge[weightPropertyName] ? edge[weightPropertyName] : 1;
      if (D[w] > D[minNode.id] + weight) {
        D[w] = D[minNode.id] + weight;
        prevs[w] = [minNode.id];
      } else if (D[w] === D[minNode.id] + weight) {
        prevs[w].push(minNode.id);
      }
    });
  }

  prevs[source] = [source];
  // 每个节点存可能存在多条最短路径
  const allPaths = {};
  for (const target in D) {
    if (D[target] !== Infinity) {
      findAllPaths(source, target, prevs, allPaths);
    }
  }

  // 兼容之前单路径
  const path = {};
  for (const target in allPaths) {
    path[target] = allPaths[target][0];
  }
  return { length: D, path, allPaths };
};

export default dijkstra;

function findAllPaths(source, target, prevs, foundPaths) {
  debugger;
  if (source === target) {
    return [source];
  }
  if (foundPaths[target]) {
    return foundPaths[target];
  }
  const paths = [];
  for (let prev of prevs[target]) {
    const prevPaths = findAllPaths(source, prev, prevs, foundPaths);
    if (!prevPaths) return;
    for (let prePath of prevPaths) {
      if (isArray(prePath)) paths.push([...prePath, target]);
      else paths.push([prePath, target]);
    }
  }
  foundPaths[target] = paths;
  return;
}
