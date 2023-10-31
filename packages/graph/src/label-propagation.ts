import { uniqueId } from "@antv/util";
import { ClusterData, INode, IEdge, Graph, Matrix } from "./types";
import { ID } from "@antv/graphlib";

function getAdjMatrix(graph: Graph, directed: boolean) {
  const nodes = graph.getAllNodes();
  const matrix: Matrix[] = [];
  // map node with index in data.nodes
  const nodeMap = new Map<string | number, number>();

  if (!nodes) {
    throw new Error("invalid nodes data!");
  }

  if (nodes) {
    nodes.forEach((node, i) => {
      nodeMap.set(node.id, i);
      const row: number[] = [];
      matrix.push(row);
    });
  }

  const edges = graph.getAllEdges();
  if (edges) {
    edges.forEach((edge) => {
      const { source, target } = edge;
      const sIndex = nodeMap.get(source);
      const tIndex = nodeMap.get(target);
      if ((!sIndex && sIndex !== 0) || (!tIndex && tIndex !== 0)) return;
      matrix[sIndex][tIndex] = 1;
      if (!directed) {
        matrix[tIndex][sIndex] = 1;
      }
    });
  }
  return matrix;
}

/**
 * Performs label propagation clustering on the given graph.
 * @param graph The graph object representing the nodes and edges.
 * @param directed A boolean indicating whether the graph is directed or not. Default is false.
 * @param weightPropertyName The name of the property used as the weight for edges. Default is 'weight'.
 * @param maxIteration The maximum number of iterations for label propagation. Default is 1000.
 * @returns The clustering result including clusters, cluster edges, and node-to-cluster mapping.
 */
export const labelPropagation = (
  graph: Graph,
  directed: boolean = false,
  weightPropertyName: string = "weight",
  maxIteration: number = 1000
): ClusterData => {
  // the origin data
  const nodes = graph.getAllNodes();
  const edges = graph.getAllEdges();

  const clusters: { [key: string]: { id: string; nodes: INode[] } } = {};
  const nodeMap: { [key: ID]: { node: INode; idx: number } } = {};
  const nodeToCluster = new Map<ID, string>();
  // init the clusters and nodeMap
  nodes.forEach((node, i) => {
    const cid: string = uniqueId();
    nodeToCluster.set(node.id, cid);
    clusters[cid] = {
      id: cid,
      nodes: [node],
    };
    nodeMap[node.id] = {
      node,
      idx: i,
    };
  });

  // the adjacent matrix of calNodes inside clusters
  const adjMatrix = getAdjMatrix(graph, directed);
  // the sum of each row in adjacent matrix
  const ks = [];
  /**
   * neighbor nodes (id for key and weight for value) for each node
   * neighbors = {
   *  id(node_id): { id(neighbor_1_id): weight(weight of the edge), id(neighbor_2_id): weight(weight of the edge), ... },
   *  ...
   * }
   */
  const neighbors: { [key: ID]: { [key: ID]: number } } = {};
  adjMatrix.forEach((row, i) => {
    let k = 0;
    const iid = nodes[i].id;
    neighbors[iid] = {};
    row.forEach((entry, j) => {
      if (!entry) return;
      k += entry;
      const jid = nodes[j].id;
      neighbors[iid][jid] = entry;
    });
    ks.push(k);
  });

  let iter = 0;

  while (iter < maxIteration) {
    let changed = false;
    nodes.forEach((node) => {
      const neighborClusters: { [key: string]: number } = {};
      Object.keys(neighbors[node.id]).forEach((neighborId) => {
        const neighborWeight = neighbors[node.id][neighborId];
        const neighborNode = nodeMap[neighborId].node;

        const neighborClusterId = nodeToCluster.get(neighborNode.id);
        if (!neighborClusters[neighborClusterId]) {
          neighborClusters[neighborClusterId] = 0;
        }
        neighborClusters[neighborClusterId] += neighborWeight;
      });
      // find the cluster with max weight
      let maxWeight = -Infinity;
      let bestClusterIds: string[] = [];
      Object.keys(neighborClusters).forEach((clusterId) => {
        if (maxWeight < neighborClusters[clusterId]) {
          maxWeight = neighborClusters[clusterId];
          bestClusterIds = [clusterId];
        } else if (maxWeight === neighborClusters[clusterId]) {
          bestClusterIds.push(clusterId);
        }
      });
      if (
        bestClusterIds.length === 1 &&
        bestClusterIds[0] === nodeToCluster.get(node.id)
      ) {
        return;
      }
      const selfClusterIdx = bestClusterIds.indexOf(nodeToCluster.get(node.id));
      if (selfClusterIdx >= 0) bestClusterIds.splice(selfClusterIdx, 1);
      if (bestClusterIds && bestClusterIds.length) {
        changed = true;

        // remove from origin cluster
        const selfCluster = clusters[nodeToCluster.get(node.id)];
        const nodeInSelfClusterIdx = selfCluster.nodes.indexOf(node);
        selfCluster.nodes.splice(nodeInSelfClusterIdx, 1);

        // move the node to the best cluster
        const randomIdx = Math.floor(Math.random() * bestClusterIds.length);
        const bestCluster = clusters[bestClusterIds[randomIdx]];
        bestCluster.nodes.push(node);
        nodeToCluster.set(node.id, bestCluster.id);
      }
    });
    if (!changed) break;
    iter++;
  }

  // delete the empty clusters
  Object.keys(clusters).forEach((clusterId) => {
    const cluster = clusters[clusterId];
    if (!cluster.nodes || !cluster.nodes.length) {
      delete clusters[clusterId];
    }
  });

  // get the cluster edges
  const clusterEdges: IEdge[] = [];
  const clusterEdgeMap: { [key: string]: IEdge } = {};
  edges.forEach((edge) => {
    let i = 0;
    const { source, target } = edge;
    const weight = (edge.data[weightPropertyName] || 1) as number;
    const sourceClusterId = nodeToCluster.get(nodeMap[source].node.id);
    const targetClusterId = nodeToCluster.get(nodeMap[target].node.id);
    const newEdgeId = `${sourceClusterId}---${targetClusterId}`;
    if (clusterEdgeMap[newEdgeId]) {
      clusterEdgeMap[newEdgeId].data.weight += weight;
      (clusterEdgeMap[newEdgeId].data.count as number)++;
    } else {
      const newEdge = {
        id: i++,
        source: sourceClusterId,
        target: targetClusterId,
        data: {
          weight,
          count: 1,
        },
      };
      clusterEdgeMap[newEdgeId] = newEdge;
      clusterEdges.push(newEdge);
    }
  });

  const clustersArray: { id: string; nodes: INode[] }[] = [];
  Object.keys(clusters).forEach((clusterId) => {
    clustersArray.push(clusters[clusterId]);
  });
  return {
    clusters: clustersArray,
    clusterEdges,
    nodeToCluster,
  };
};
