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

    relatedEdges.forEach((edge) => {
      const edgeTarget = edge.target;
      const edgeSource = edge.source;
      const w = edgeTarget === minNodeId ? edgeSource : edgeTarget;
      const weight = weightPropertyName && edge[weightPropertyName] ? edge[weightPropertyName] : 1;
      if (D[w] > D[minNodeId] + weight) {
        D[w] = D[minNodeId] + weight;
        prevs[w] = [
          {
            node: minNodeId,
            edge: edge.id,
          },
        ];
      } else if (D[w] === D[minNodeId] + weight) {
        prevs[w].push({
          node: minNodeId,
          edge: edge.id,
        });
      }
    });
  }

  prevs[source] = [
    {
      node: source,
      edge: undefined,
    },
  ];

  // 每个节点存可能存在多条最短路径
  const paths = {};
  for (const target in D) {
    if (D[target] !== Infinity) {
      findAllPaths(source, { node: target }, prevs, paths);
    }
  }

  const nodePaths = {};
  const edgePaths = {};
  Object.keys(paths).forEach((nodeId) => {
    const pathsFromNode = paths[nodeId];
    nodePaths[nodeId] = pathsFromNode.map((path) => path.map((item) => item.node));
    edgePaths[nodeId] = pathsFromNode.map((path) => path.map((item) => item.edge).filter(Boolean));
  });

  // 兼容之前单路径
  const path = {};
  const edgePath = {};
  for (const target in paths) {
    path[target] = nodePaths[target][0];
    edgePath[target] = edgePaths[target][0];
  }
  return { length: D, path, edgePath: edgePath, allPath: nodePaths, allEdgePath: edgePaths };
};

export default dijkstra;

function findAllPaths(source, target, prevs, foundPaths) {
  if (source === target.node) {
    return [target];
  }
  if (foundPaths[target.node]) {
    return foundPaths[target.node];
  }
  const paths = [];
  for (let prev of prevs[target.node]) {
    const prevPaths = findAllPaths(source, prev, prevs, foundPaths);
    if (!prevPaths) return;
    for (let prePath of prevPaths) {
      if (isArray(prePath)) {
        const frontItems = [...prePath].splice(0, prePath.length - 1);
        paths.push([...frontItems, prev, { node: target.node }]);
      } else {
        paths.push([prePath, { node: target.node }]);
      }
    }
  }
  foundPaths[target.node] = paths;
  return foundPaths[target.node];
}
