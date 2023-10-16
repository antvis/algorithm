import { ID, Node } from "@antv/graphlib";
import { clone } from "@antv/util";
import { Cluster, ClusterData, ClusterMap, Graph, NodeData } from "./types";
import { getAllProperties, oneHot } from "./utils";
import { graph2AdjacencyMatrix } from "./adjMatrix";
import { Vector } from "./vector";

/**
 * The quality of the communities referred as partitions hereafter is measured by Modularity of the partition.
 * @see https://medium.com/walmartglobaltech/demystifying-louvains-algorithm-and-its-implementation-in-gpu-9a07cdd3b010
 */
function getModularity(
  nodes: Node<NodeData>[],
  adjMatrix: number[][],
  ks: number[],
  m: number
) {
  const length = adjMatrix.length;
  const param = 2 * m; // number if links
  let modularity = 0;
  for (let i = 0; i < length; i++) {
    const clusteri = nodes[i].data.clusterId as string;
    for (let j = 0; j < length; j++) {
      const clusterj = nodes[j].data.clusterId as string;
      if (clusteri !== clusterj) continue; // 1 if x = y and 0 otherwise
      const entry = adjMatrix[i][j] || 0; // Aij: the weightof the edge between i & j
      const ki = ks[i] || 0; // Ki: degree of the node
      const kj = ks[j] || 0;
      modularity += (entry - ki * kj / param);
    }
  }
  modularity *= (1 / param);
  return modularity;
}

// 模块惯性度，衡量属性相似度
function getInertialModularity(
  nodes: Node<NodeData>[] = [],
  allPropertiesWeight: number[][],
) {
  const length = nodes.length;
  let totalProperties = new Vector([]);
  for (let i = 0; i < length; i++) {
    totalProperties = totalProperties.add(new Vector(allPropertiesWeight[i]));
  }
  // 均值向量
  const avgProperties = totalProperties.avg(length);

  avgProperties.normalize();
  // 节点集合的方差: 节点v与均值向量的平方欧式距离之和
  let variance: number = 0;
  for (let i = 0; i < length; i++) {
    const propertiesi = new Vector(allPropertiesWeight[i]);
    const squareEuclideanDistance = propertiesi.squareEuclideanDistance(avgProperties);
    variance += squareEuclideanDistance;
  }

  // 任意两点间的欧式平方距离
  const squareEuclideanDistanceInfo: number[][] = [];
  nodes.forEach(() => {
    squareEuclideanDistanceInfo.push([]);
  });
  for (let i = 0; i < length; i++) {
    const propertiesi = new Vector(allPropertiesWeight[i]);
    nodes[i].data['clusterInertial'] = 0;
    for (let j = 0; j < length; j++) {
      if ( i === j) {
        squareEuclideanDistanceInfo[i][j] = 0;
        continue;
      }
      const propertiesj = new Vector(allPropertiesWeight[j]);
      squareEuclideanDistanceInfo[i][j] = propertiesi.squareEuclideanDistance(propertiesj);
      (nodes[i].data['clusterInertial'] as number) += squareEuclideanDistanceInfo[i][j];
    }
  }

  // 计算模块惯性度
  let inertialModularity = 0;
  const param = 2 * length * variance;
  for (let i = 0; i < length; i++) {
    const clusteri = nodes[i].data.clusterId;
    for (let j = 0; j < length; j++) {
      const clusterj = nodes[j].data.clusterId;
      if ( i === j || clusteri !== clusterj) continue;
      const inertial = ((nodes[i].data.clusterInertial as number) * (nodes[j].data.clusterInertial as number)) 
        / Math.pow(param, 2) - squareEuclideanDistanceInfo[i][j] / param;
      inertialModularity += inertial;
    }
  }
  return Number(inertialModularity.toFixed(4));
}

/**
 * 社区发现 louvain 算法
 * @param graphData 图数据
 * @param directed 是否有向图，默认为 false
 * @param weightPropertyName 权重的属性字段
 * @param threshold 差值阈值
 * @param inertialModularity 是否使用惯性模块度（即节点属性相似性）
 * @param propertyKey 属性的字段名
 * @param involvedKeys 参与计算的key集合
 * @param uninvolvedKeys 不参与计算的key集合
 * @param inertialWeight 惯性模块度权重
 */
export function louvain(
  graph: Graph,
  directed: boolean = false,
  weightPropertyName: string = 'weight',
  threshold: number = 0.0001,
  inertialModularity: boolean = false,
  involvedKeys: string[] = [],
  uninvolvedKeys: string[] = ['id'],
  inertialWeight: number = 1,
): ClusterData {
  const nodes = graph.getAllNodes();
  const edges = graph.getAllEdges();

  let allPropertiesWeight: number[][] = [];
  if (inertialModularity) {
    nodes.forEach((node, index) => {
      node.data.originIndex = index;
    });
  
    let nodeTypeInfo: string[] = [];
    if (nodes.every((node) => 'nodeType' in node.data)) {
      nodeTypeInfo = Array.from(new Set(nodes.map((node) => node.data.nodeType as string)));
      nodes.forEach((node) => {
        node.data.nodeType = nodeTypeInfo.findIndex((nodeType) => nodeType === node.data.nodeType);
      });
    }
    // 所有节点属性集合
    const properties = getAllProperties(nodes);
  
    // 所有节点属性one-hot特征向量集合
    allPropertiesWeight = oneHot(properties, involvedKeys, uninvolvedKeys) as number[][];
  }
 
  /**
   * 1. To start with each node is assigned to a different community or partition.
   * The number of partitions is equal to number of nodes N.
   */
  let uniqueId = 1;
  const clusters: ClusterMap = {};
  const nodeMap: Record<ID, { node: Node<NodeData>; idx: number }> = {};
  const nodeToCluster = new Map<ID, string>();
  nodes.forEach((node, i) => {
    const cid: string = String(uniqueId++);
    node.data.clusterId = cid;
    clusters[cid] = {
      id: cid,
      nodes: [node]
    };
    nodeMap[node.id] = {
      node,
      idx: i
    };
  });
  // the adjacent matrix of calNodes inside clusters
  const adjMatrix = graph2AdjacencyMatrix(graph, directed);
  // the sum of each row in adjacent matrix
  const ks: number[] = [];
  /**
   * neighbor nodes (id for key and weight for value) for each node
   * neighbors = {
   *  id(node_id): { id(neighbor_1_id): weight(weight of the edge), id(neighbor_2_id): weight(weight of the edge), ... },
   *  ...
   * }
   */
  const neighbors: Record<ID, Record<ID, number>> = {};
  // the sum of the weights of all edges in the graph
  let m = 0;
  adjMatrix.forEach((row, i) => {
    let k = 0;
    const iid = nodes[i].id;
    neighbors[iid] = {};
    row.forEach((entry, j) => {
      if (!entry) return;
      k += entry;
      const jid = nodes[j].id;
      neighbors[iid][jid] = entry;
      m += entry;
    });
    ks.push(k);
  });

  m /= 2;

  let totalModularity = Infinity;
  let previousModularity = Infinity;
  let iter = 0;

  let finalNodes: Node<NodeData>[] = [];
  let finalClusters: ClusterMap = {};
  while (true) {
    if (inertialModularity && nodes.every((node) => node.hasOwnProperty('properties'))) {
      totalModularity = getModularity(nodes, adjMatrix, ks, m) + getInertialModularity(nodes, allPropertiesWeight) * inertialWeight;
    } else {
      totalModularity = getModularity(nodes, adjMatrix, ks, m);
    }
   
    // 第一次迭代previousModularity直接赋值
    if (iter === 0) {
      previousModularity = totalModularity;
      finalNodes = nodes;
      finalClusters = clusters;
    }

    const increaseWithinThreshold = totalModularity > 0 && totalModularity > previousModularity && totalModularity - previousModularity < threshold;
    // 总模块度增加才更新最优解
    if (totalModularity > previousModularity) {
      finalClusters = clone(clusters);
      previousModularity = totalModularity;
    }

    // whether to terminate the iterations
    if (increaseWithinThreshold || iter > 100) {
      break;
    }
    iter++;
    // pre compute some values for current clusters
    Object.keys(clusters).forEach((clusterId) => {
      // sum of weights of edges to nodes in cluster
      let sumTot = 0;
      edges.forEach((edge) => {
        const { source, target } = edge;
        const sourceClusterId = nodeMap[source].node.data.clusterId;
        const targetClusterId = nodeMap[target].node.data.clusterId;
        if ((sourceClusterId === clusterId && targetClusterId !== clusterId)
          || (targetClusterId === clusterId && sourceClusterId !== clusterId)) {
          sumTot = sumTot + (edge.data[weightPropertyName] as number || 1);
        }
      });
      clusters[clusterId].sumTot = sumTot;
    });


    // move the nodes to increase the delta modularity
    nodes.forEach((node, i) => {
      const selfCluster = clusters[node.data.clusterId];
      let bestIncrease = 0;
      let bestCluster: Cluster;

      const commonParam = ks[i] / (2 * m);

      // sum of weights of edges from node to nodes in cluster
      let kiin = 0;
      const selfClusterNodes = selfCluster.nodes;
      selfClusterNodes.forEach((scNode) => {
        const scNodeIdx = nodeMap[scNode.id].idx;
        kiin += adjMatrix[i][scNodeIdx] || 0;
      });
      // the modurarity for **removing** the node i from the origin cluster of node i
      const removeModurarity = kiin - selfCluster.sumTot * commonParam;
      // nodes for **removing** node i into this neighbor cluster
      const selfClusterNodesAfterRemove = selfClusterNodes.filter((scNode) => scNode.id !== node.id);
      const propertiesWeightRemove: number[][] = [];
      selfClusterNodesAfterRemove.forEach((nodeRemove, index) => {
        propertiesWeightRemove[index] = allPropertiesWeight[nodeRemove.data.originIndex as number];
      });
      // the inertialModularity for **removing** the node i from the origin cluster of node i
      const removeInertialModularity = inertialModularity ? getInertialModularity(selfClusterNodesAfterRemove, allPropertiesWeight) * inertialWeight : 0;

      // the neightbors of the node
      const nodeNeighborIds = neighbors[node.id];
      Object.keys(nodeNeighborIds).forEach((neighborNodeId) => {
        const neighborNode = nodeMap[neighborNodeId].node;
        const neighborClusterId = neighborNode.data.clusterId;

        // if the node and the neighbor of node are in the same cluster, reutrn
        if (neighborClusterId === node.data.clusterId) return;
        const neighborCluster = clusters[neighborClusterId];
        const clusterNodes = neighborCluster.nodes;

        // if the cluster is empty, remove the cluster and return
        if (!clusterNodes || !clusterNodes.length) return;

        // sum of weights of edges from node to nodes in cluster
        let neighborClusterKiin = 0;
        clusterNodes.forEach((cNode) => {
          const cNodeIdx = nodeMap[cNode.id].idx;
          neighborClusterKiin += adjMatrix[i][cNodeIdx] || 0;
        });

        // the modurarity for **adding** node i into this neighbor cluster
        const addModurarity = neighborClusterKiin - neighborCluster.sumTot * commonParam;
        // nodes for **adding** node i into this neighbor cluster
        const clusterNodesAfterAdd= clusterNodes.concat([node]);
        const propertiesWeightAdd: number[][] = [];
        clusterNodesAfterAdd.forEach((nodeAdd, index) => {
          propertiesWeightAdd[index] = allPropertiesWeight[nodeAdd.data.originIndex as number];
        });
        // the inertialModularity for **adding** node i into this neighbor cluster
        const addInertialModularity = inertialModularity ? getInertialModularity(clusterNodesAfterAdd, allPropertiesWeight) * inertialWeight : 0;

        // the increase modurarity is the difference between addModurarity and removeModurarity
        let increase = addModurarity - removeModurarity;
        if (inertialModularity) {
          increase = (addModurarity + addInertialModularity) - (removeModurarity + removeInertialModularity);
        }

        // find the best cluster to move node i into
        if (increase > bestIncrease) {
          bestIncrease = increase;
          bestCluster = neighborCluster;
        }
      });

      // if found a best cluster to move into
      if (bestIncrease > 0) {
        bestCluster.nodes.push(node);
        const previousClusterId = node.data.clusterId;
        node.data.clusterId = bestCluster.id;
        // move the node to the best cluster
        const nodeInSelfClusterIdx = selfCluster.nodes.indexOf(node);
        // remove from origin cluster
        selfCluster.nodes.splice(nodeInSelfClusterIdx, 1);
        // update sumTot for clusters
        // sum of weights of edges to nodes in cluster
        let neighborClusterSumTot = 0;
        let selfClusterSumTot = 0;
        edges.forEach((edge) => {
          const { source, target } = edge;
          const sourceClusterId = nodeMap[source].node.data.clusterId;
          const targetClusterId = nodeMap[target].node.data.clusterId;
          if ((sourceClusterId === bestCluster.id && targetClusterId !== bestCluster.id)
            || (targetClusterId === bestCluster.id && sourceClusterId !== bestCluster.id)) {
            neighborClusterSumTot = neighborClusterSumTot + (edge.data[weightPropertyName] as number || 1);
          }
          if ((sourceClusterId === previousClusterId && targetClusterId !== previousClusterId)
            || (targetClusterId === previousClusterId && sourceClusterId !== previousClusterId)) {
            selfClusterSumTot = selfClusterSumTot + (edge.data[weightPropertyName] as number || 1);
          }
        });

        // the nodes of the clusters to move into and remove are changed, update their sumTot
        bestCluster.sumTot = neighborClusterSumTot;
        selfCluster.sumTot = selfClusterSumTot;
      }
    });
  }

  // delete the empty clusters, assign increasing clusterId
  const newClusterIdMap: Record<string, string> = {};
  let clusterIdx = 0;
  Object.keys(finalClusters).forEach((clusterId) => {
    const cluster = finalClusters[clusterId];
    if (!cluster.nodes || !cluster.nodes.length) {
      delete finalClusters[clusterId];
      return;
    }
    const newId = String(clusterIdx + 1);
    if (newId === clusterId) {
      return;
    }
    cluster.id = newId;
    cluster.nodes.forEach((node) => {
      node.data.clusterId = newId;
    });
    finalClusters[newId] = cluster;
    newClusterIdMap[clusterId] = newId;
    delete finalClusters[clusterId];
    clusterIdx ++;
  });
  // restore node clusterId
  finalNodes.forEach((node) => {
    if (node.data.clusterId && newClusterIdMap[node.data.clusterId]) {
      node.data.clusterId = newClusterIdMap[node.data.clusterId];
    }
  });
  // get the cluster edges
  const clusterEdges: {
    id: ID;
    source: string;
    target: string;
    data: {
      weight: number;
      count: number;
    }
  }[] = [];
  const clusterEdgeMap: Record<string, {
    id: ID;
    source: string;
    target: string;
    data: {
      weight: number;
      count: number;
    }
  } > = {};
  edges.forEach((edge) => {
    const { source, target } = edge;
    const weight = edge.data[weightPropertyName] as number || 1;
    const sourceClusterId = nodeMap[source].node.data.clusterId;
    const targetClusterId = nodeMap[target].node.data.clusterId;
    if (!sourceClusterId || !targetClusterId) return;
    const newEdgeId = `${sourceClusterId}---${targetClusterId}`;
    if (clusterEdgeMap[newEdgeId]) {
      clusterEdgeMap[newEdgeId].data.weight += weight;
      clusterEdgeMap[newEdgeId].data.count++;
    } else {
      const newEdge = {
        id: edge.id,
        source: sourceClusterId,
        target: targetClusterId,
        data: {
          weight,
          count: 1
        }
      };
      clusterEdgeMap[newEdgeId] = newEdge;
      clusterEdges.push(newEdge);
    }
  });
  const clustersArray: Cluster[] = [];
  Object.keys(finalClusters).forEach((clusterId) => {
    clustersArray.push(finalClusters[clusterId]);
    finalClusters[clusterId].nodes.forEach((node) => {
      nodeToCluster.set(node.id, clusterId);
    });
  });
  return {
    clusters: clustersArray,
    clusterEdges,
    nodeToCluster
  };
}
