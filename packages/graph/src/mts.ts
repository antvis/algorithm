import UnionFind from './structs/union-find';
import MinBinaryHeap from './structs/binary-heap';
import { GraphData, EdgeConfig } from './types';
import { getEdgesByNodeId } from './util';

/**
 * Prim algorithm，use priority queue，复杂度 O(E+V*logV), V: 节点数量，E: 边的数量
 * refer: https://en.wikipedia.org/wiki/Prim%27s_algorithm
 * @param graph
 * @param weight 指定用于作为边权重的属性，若不指定，则认为所有边权重一致
 */
const primMST = (graphData: GraphData, weight?: string) => {
  const selectedEdges = [];
  const { nodes, edges } = graphData;
  if (nodes.length === 0) {
    return selectedEdges;
  }

  // 从nodes[0]开始
  const currNode = nodes[0];
  const visited = new Set();
  visited.add(currNode);

  // 用二叉堆维护距已加入节点的其他节点的边的权值
  const compareWeight = (a: EdgeConfig, b: EdgeConfig) => {
    if (weight) {
      return a.weight - b.weight;
    }
    return 0;

  };
  const edgeQueue = new MinBinaryHeap(compareWeight);
  getEdgesByNodeId(currNode.id, edges).forEach((edge) => {
    edgeQueue.insert(edge);
  });

  while (!edgeQueue.isEmpty()) {
    // 选取与已加入的结点之间边权最小的结点
    const currEdge: EdgeConfig = edgeQueue.delMin();
    const source = currEdge.source;
    const target = currEdge.target;
    if (visited.has(source) && visited.has(target)) continue;
    selectedEdges.push(currEdge);

    if (!visited.has(source)) {
      visited.add(source);
      getEdgesByNodeId(source, edges).forEach((edge) => {
        edgeQueue.insert(edge);
      });
    }
    if (!visited.has(target)) {
      visited.add(target);
      getEdgesByNodeId(target, edges).forEach((edge) => {
        edgeQueue.insert(edge);
      });
    }
  }
  return selectedEdges;
};

/**
 * Kruskal algorithm，复杂度 O(E*logE), E: 边的数量
 * refer: https://en.wikipedia.org/wiki/Kruskal%27s_algorithm
 * @param graph
 * @param weight 指定用于作为边权重的属性，若不指定，则认为所有边权重一致
 * @return IEdge[] 返回构成MST的边的数组
 */
const kruskalMST = (graphData: GraphData, weight?: string): EdgeConfig[] => {
  const selectedEdges = [];
  const { nodes } = graphData
  if (nodes.length === 0) {
    return selectedEdges;
  }

  // 若指定weight，则将所有的边按权值从小到大排序
  const edges = graphData.edges.map((edge) => edge);
  if (weight) {
    edges.sort((a, b) => {
      return a.weight - b.weight;
    });
  }
  const disjointSet = new UnionFind(nodes.map((n) => n.id));

  // 从权值最小的边开始，如果这条边连接的两个节点于图G中不在同一个连通分量中，则添加这条边
  // 直到遍历完所有点或边
  while (edges.length > 0) {
    const curEdge = edges.shift();
    const source = curEdge.source;
    const target = curEdge.target;
    if (!disjointSet.connected(source, target)) {
      selectedEdges.push(curEdge);
      disjointSet.union(source, target);
    }
  }
  return selectedEdges;
};

/**
 * 最小生成树
 * refer: https://en.wikipedia.org/wiki/Kruskal%27s_algorithm
 * @param graph
 * @param weight 指定用于作为边权重的属性，若不指定，则认为所有边权重一致
 * @param algo 'prim' | 'kruskal' 算法类型
 * @return IEdge[] 返回构成MST的边的数组
 */
export default function mst(graphData: GraphData, weight?: string, algo?: string) {
  const algos = {
    prim: primMST,
    kruskal: kruskalMST,
  };
  if (!algo) return kruskalMST(graphData, weight);

  return algos[algo](graphData, weight);
}
