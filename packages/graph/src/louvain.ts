import { clone } from '@antv/util';
import getAdjMatrix from './adjacent-matrix';
import { NodeConfig, ClusterData, GraphData, ClusterMap } from './types';
import Vector from './utils/vector';
import { secondReg, dateReg } from './constants/time';

const getModularity = (
  nodes: NodeConfig[],
  adjMatrix: number[][],
  ks: number[],
  m: number
) => {
  const length = adjMatrix.length;
  const param = 2 * m;
  let modularity = 0;
  for (let i = 0; i < length; i++) {
    const clusteri = nodes[i].clusterId;
    for (let j = 0; j < length; j++) {
      const clusterj = nodes[j].clusterId;
      if (clusteri !== clusterj) continue;
      const entry = adjMatrix[i][j] || 0;
      const ki = ks[i] || 0;
      const kj = ks[j] || 0;
      modularity += (entry - ki * kj / param);
    }
  }
  modularity *= (1 / param);
  return modularity;
}

// 获取所有属性并排序
const getAllSortProperties = (nodes: NodeConfig[] = []) => {
  const propertyKeyInfo = {};
  nodes.forEach(node => {
    Object.keys(node.properties).forEach(propertyKey => {
      // 目前过滤只保留可以转成数值型的或日期型的, todo: 统一转成one-hot特征向量
      if (!`${node.properties[propertyKey]}`.match(secondReg) && 
        !`${node.properties[propertyKey]}`.match(dateReg) && 
        isNaN(Number(node.properties[propertyKey])) || propertyKey === 'id') {
        if (propertyKeyInfo.hasOwnProperty(propertyKey)) {
          delete propertyKeyInfo[propertyKey];
        }
        return;
      }
      if (propertyKeyInfo.hasOwnProperty(propertyKey)) {
        propertyKeyInfo[propertyKey] += 1;
      } else {
        propertyKeyInfo[propertyKey] = 1;
      }
    })
  })

  // 取top50的属性
  const sortKeys = Object.keys(propertyKeyInfo).sort((a,b)=>{
    return propertyKeyInfo[b] - propertyKeyInfo[a];
  });
  return sortKeys.length < 100 ? sortKeys : sortKeys.slice(0, 100);
}

const processProperty = (properties, propertyKeys) => propertyKeys.map(key => {
  if (properties.hasOwnProperty(key)) {
    // 可以转成数值的直接转成数值
    if (!isNaN(Number(properties[key]))) {
      return Number(properties[key]);
    }
    // 时间型的转成时间戳
    if (properties[key].match(secondReg) || properties[key].match(dateReg)) {
      // @ts-ignore
      return Number(Date.parse(new Date(properties[key]))) / 1000;
    }
  }
  return 0;
})

// 获取属性特征权重
const getPropertyWeight = (propertyKeys, nodes) => {
  let allPropertiesWeight = [];
  for (let i = 0; i < nodes.length; i++) {
    allPropertiesWeight[i] = processProperty(nodes[i].properties, propertyKeys);
  }
  return allPropertiesWeight;
}

// 模块惯性度，衡量属性相似度
const getInertialModularity = (
  nodes: NodeConfig[] = [],
  allPropertiesWeight: number[][],
) => {
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
  let squareEuclideanDistanceInfo = [];
  nodes.forEach(() => {
    squareEuclideanDistanceInfo.push([]);
  });
  for (let i = 0; i < length; i++) {
    const propertiesi = new Vector(allPropertiesWeight[i]);
    nodes[i]['clusterInertial'] = 0;
    for (let j = 0; j < length; j++) {
      if ( i === j) {
        squareEuclideanDistanceInfo[i][j] = 0;
        continue;
      }
      const propertiesj = new Vector(allPropertiesWeight[j]);
      squareEuclideanDistanceInfo[i][j] = propertiesi.squareEuclideanDistance(propertiesj);
      nodes[i]['clusterInertial'] += squareEuclideanDistanceInfo[i][j];
    }
  }

  // 计算模块惯性度
  let inertialModularity: number = 0;
  const param = 2 * length * variance;
  for (let i = 0; i < length; i++) {
    const clusteri = nodes[i].clusterId;
    for (let j = 0; j < length; j++) {
      const clusterj = nodes[j].clusterId;
      if ( i === j || clusteri !== clusterj) continue;
      const inertial = (nodes[i].clusterInertial * nodes[j].clusterInertial) / Math.pow(param, 2) - squareEuclideanDistanceInfo[i][j] / param;
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
 */
const louvain = (
  graphData: GraphData,
  directed: boolean = false,
  weightPropertyName: string = 'weight',
  threshold: number = 0.0001,
  inertialModularity: boolean = false,
  inertialWeight: number = 1,
): ClusterData => {
  // the origin data
  const { nodes = [], edges = [] } = graphData;

  let allPropertiesWeight = [];
  if (inertialModularity) {
    nodes.forEach((node, index) => {
      node.properties = node.properties || {};
      node.originIndex = index;
    })
  
    let nodeTypeInfo = [];
    if (nodes.every(node => node.hasOwnProperty('nodeType'))) {
      nodeTypeInfo = Array.from(new Set(nodes.map(node => node.nodeType)));
      nodes.forEach(node => {
        node.properties.nodeType = nodeTypeInfo.findIndex(nodeType => nodeType === node.nodeType);
      })
    }
    const propertyKeys = getAllSortProperties(nodes);
    // 所有节点属性特征向量集合
    allPropertiesWeight = getPropertyWeight(propertyKeys, nodes);
  }
 
  let uniqueId = 1;

  const clusters: ClusterMap = {};
  const nodeMap = {};
  // init the clusters and nodeMap
  nodes.forEach((node, i) => {
    const cid: string = String(uniqueId++);
    node.clusterId = cid;
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
  const adjMatrix = getAdjMatrix(graphData, directed);
  // the sum of each row in adjacent matrix
  const ks = [];
  /**
   * neighbor nodes (id for key and weight for value) for each node
   * neighbors = {
   *  id(node_id): { id(neighbor_1_id): weight(weight of the edge), id(neighbor_2_id): weight(weight of the edge), ... },
   *  ...
   * }
   */
  const neighbors = {};
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

  let finalNodes = [];
  let finalClusters = {};
  while (true) {
    if (inertialModularity && nodes.every(node => node.hasOwnProperty('properties'))) {
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
      finalNodes = nodes.map(node => ({
        node,
        clusterId: node.clusterId
      }));
      finalClusters = clone(clusters);
      previousModularity = totalModularity;
    }

    // whether to terminate the iterations
    if ( increaseWithinThreshold || iter > 100) {
      break;
    };
    iter++;
    // pre compute some values for current clusters
    Object.keys(clusters).forEach(clusterId => {
      // sum of weights of edges to nodes in cluster
      let sumTot = 0;
      edges.forEach(edge => {
        const { source, target } = edge;
        const sourceClusterId = nodeMap[source].node.clusterId;
        const targetClusterId = nodeMap[target].node.clusterId;
        if ((sourceClusterId === clusterId && targetClusterId !== clusterId)
          || (targetClusterId === clusterId && sourceClusterId !== clusterId)) {
          sumTot = sumTot + (edge[weightPropertyName] as number || 1);
        }
      });
      clusters[clusterId].sumTot = sumTot;
    });


    // move the nodes to increase the delta modularity
    nodes.forEach((node, i) => {
      const selfCluster = clusters[node.clusterId as string];
      let bestIncrease = 0;
      let bestCluster;

      const commonParam = ks[i] / (2 * m);

      // sum of weights of edges from node to nodes in cluster
      let kiin = 0;
      const selfClusterNodes = selfCluster.nodes;
      selfClusterNodes.forEach(scNode => {
        const scNodeIdx = nodeMap[scNode.id].idx;
        kiin += adjMatrix[i][scNodeIdx] || 0;
      });
      // the modurarity for **removing** the node i from the origin cluster of node i
      const removeModurarity = kiin - selfCluster.sumTot * commonParam;
      // nodes for **removing** node i into this neighbor cluster
      const selfClusterNodesAfterRemove = selfClusterNodes.filter(scNode => scNode.id !== node.id);
      let propertiesWeightRemove = [];
      selfClusterNodesAfterRemove.forEach((nodeRemove, index) => {
        propertiesWeightRemove[index] = allPropertiesWeight[nodeRemove.originIndex];
      })
      // the inertialModularity for **removing** the node i from the origin cluster of node i
      const removeInertialModularity = getInertialModularity(selfClusterNodesAfterRemove, allPropertiesWeight) * inertialWeight;

      // the neightbors of the node
      const nodeNeighborIds = neighbors[node.id];
      Object.keys(nodeNeighborIds).forEach(neighborNodeId => {
        const neighborNode = nodeMap[neighborNodeId].node;
        const neighborClusterId = neighborNode.clusterId;

        // if the node and the neighbor of node are in the same cluster, reutrn
        if (neighborClusterId === node.clusterId) return;
        const neighborCluster = clusters[neighborClusterId];
        const clusterNodes = neighborCluster.nodes;

        // if the cluster is empty, remove the cluster and return
        if (!clusterNodes || !clusterNodes.length) return;

        // sum of weights of edges from node to nodes in cluster
        let neighborClusterKiin = 0;
        clusterNodes.forEach(cNode => {
          const cNodeIdx = nodeMap[cNode.id].idx;
          neighborClusterKiin += adjMatrix[i][cNodeIdx] || 0;
        });

        // the modurarity for **adding** node i into this neighbor cluster
        const addModurarity = neighborClusterKiin - neighborCluster.sumTot * commonParam;
        // nodes for **adding** node i into this neighbor cluster
        const clusterNodesAfterAdd= clusterNodes.concat([node]);
        let propertiesWeightAdd = [];
        clusterNodesAfterAdd.forEach((nodeAdd, index) => {
          propertiesWeightAdd[index] = allPropertiesWeight[nodeAdd.originIndex];
        })
        // the inertialModularity for **adding** node i into this neighbor cluster
        const addInertialModularity = getInertialModularity(clusterNodesAfterAdd, allPropertiesWeight) * inertialWeight;

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
        const previousClusterId = node.clusterId;
        node.clusterId = bestCluster.id;
        // move the node to the best cluster
        const nodeInSelfClusterIdx = selfCluster.nodes.indexOf(node);
        // remove from origin cluster
        selfCluster.nodes.splice(nodeInSelfClusterIdx, 1);
        // update sumTot for clusters
        // sum of weights of edges to nodes in cluster
        let neighborClusterSumTot = 0;
        let selfClusterSumTot = 0;
        edges.forEach(edge => {
          const { source, target } = edge;
          const sourceClusterId = nodeMap[source].node.clusterId;
          const targetClusterId = nodeMap[target].node.clusterId;
          if ((sourceClusterId === bestCluster.id && targetClusterId !== bestCluster.id)
            || (targetClusterId === bestCluster.id && sourceClusterId !== bestCluster.id)) {
            neighborClusterSumTot = neighborClusterSumTot + (edge[weightPropertyName] as number || 1);
          }
          if ((sourceClusterId === previousClusterId && targetClusterId !== previousClusterId)
            || (targetClusterId === previousClusterId && sourceClusterId !== previousClusterId)) {
            selfClusterSumTot = selfClusterSumTot + (edge[weightPropertyName] as number || 1);
          }
        });

        // the nodes of the clusters to move into and remove are changed, update their sumTot
        bestCluster.sumTot = neighborClusterSumTot;
        selfCluster.sumTot = selfClusterSumTot;
      }
    });
  }

  // delete the empty clusters, assign increasing clusterId
  const newClusterIdMap = {}
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
    cluster.nodes = cluster.nodes.map(item => ({ id: item.id, clusterId: newId }));
    finalClusters[newId] = cluster;
    newClusterIdMap[clusterId] = newId;
    delete finalClusters[clusterId];
    clusterIdx ++;
  });
  // restore node clusterId
  finalNodes.forEach(nodeInfo => {
    const { node, clusterId } = nodeInfo;
    node.clusterId = clusterId;
    if (node.clusterId && newClusterIdMap[node.clusterId]) node.clusterId = newClusterIdMap[node.clusterId]
  })
  // get the cluster edges
  const clusterEdges = [];
  const clusterEdgeMap = {};
  edges.forEach(edge => {
    const { source, target } = edge;
    const weight = edge[weightPropertyName] || 1;
    const sourceClusterId = nodeMap[source].node.clusterId;
    const targetClusterId = nodeMap[target].node.clusterId;
    const newEdgeId = `${sourceClusterId}---${targetClusterId}`;
    if (clusterEdgeMap[newEdgeId]) {
      clusterEdgeMap[newEdgeId].weight += weight;
      clusterEdgeMap[newEdgeId].count++;
    } else {
      const newEdge = {
        source: sourceClusterId,
        target: targetClusterId,
        weight,
        count: 1
      };
      clusterEdgeMap[newEdgeId] = newEdge;
      clusterEdges.push(newEdge);
    }
  });
  const clustersArray = [];
  Object.keys(finalClusters).forEach(clusterId => {
    clustersArray.push(finalClusters[clusterId]);
  });
  return {
    clusters: clustersArray,
    clusterEdges
  }
}

export default louvain;
