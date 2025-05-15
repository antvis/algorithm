import { Edge, ID, Node } from "@antv/graphlib";
import { isArray } from '@antv/util';
import { EdgeData, Graph, NodeData } from "./types";

function minVertex(
  D: { [key: ID]: number },
  nodes: Node<NodeData>[],
  marks: { [key: string]: boolean },
): Node<NodeData> {
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

function findAllPaths(source: ID, target: ID, prevs: Record<ID, ID[]>, foundPaths: Record<ID, ID[][]>): ID[] {
  if (source === target) {
    return [source];
  }
  if (foundPaths[target]) {
    // @ts-ignore
    return foundPaths[target];
  }
  const paths: ID[][] = [];
  for (const prev of prevs[target]) {
    const prevPaths = findAllPaths(source, prev, prevs, foundPaths);
    if (!prevPaths) return;
    for (const prePath of prevPaths) {
      if (isArray(prePath)) paths.push([...prePath, target]);
      else paths.push([prePath, target]);
    }
  }
  foundPaths[target] = paths;
  // @ts-ignore
  return foundPaths[target];
}

export function dijkstra(
  graph: Graph,
  source: ID,
  directed?: boolean,
  weightPropertyName?: string,
) {
  const nodes = graph.getAllNodes();
  const nodeIds: ID[] = [];
  const marks: Record<ID, boolean> = {};
  const D: Record<ID, number> = {};
  const prevs: Record<ID, ID[]> = {}; // key: 顶点, value: 顶点的前驱点数组（可能有多条等长的最短路径）
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

    let relatedEdges: Edge<EdgeData>[] = [];
    if (directed) {
      relatedEdges = graph.getRelatedEdges(minNodeId, 'out');
    } else {
      relatedEdges = graph.getRelatedEdges(minNodeId, 'both');
    }

    relatedEdges.forEach((edge) => {
      const edgeTarget = edge.target;
      const edgeSource = edge.source;
      const w = edgeTarget === minNodeId ? edgeSource : edgeTarget;
      const weight = weightPropertyName && edge.data[weightPropertyName] as number ? edge.data[weightPropertyName] as number : 1;
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
  const paths: Record<ID, ID[][]> = {};
  for (const target in D) {
    if (D[target] !== Infinity) {
      findAllPaths(source, target, prevs, paths);
    }
  }

  // 兼容之前单路径
  const path: Record<ID, ID[]> = {};
  for (const target in paths) {
    path[target] = paths[target][0];
  }
  return { length: D, path, allPath: paths };
}