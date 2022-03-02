import { isEqual, uniq } from '@antv/util';
import { getAllProperties } from './utils/node-properties';
import { oneHot, getDistance } from './utils/data-preprocessing';
import Vector from './utils/vector';
import { GraphData, ClusterData, DistanceType } from './types';

// 获取质心
const getCentroid = (distanceType, allPropertiesWeight, index) => {
  let centroid = [];
  switch (distanceType) {
    case DistanceType.EuclideanDistance:
      centroid = allPropertiesWeight[index];
      break;
    default:
      centroid = [];
      break;
  }
  return centroid;
}

/**
 *  k-means算法 根据节点之间的距离将节点聚类为K个簇
 * @param data 图数据 
 * @param k 质心（聚类中心）个数
 * @param propertyKey 属性的字段名
 * @param involvedKeys 参与计算的key集合
 * @param uninvolvedKeys 不参与计算的key集合
 * @param distanceType 距离类型 默认节点属性的欧式距离
 */
const kMeans = (
  data: GraphData,
  k: number = 3,
  propertyKey: string = undefined,
  involvedKeys: string[] = [],
  uninvolvedKeys: string[] = ['id'],
  distanceType: DistanceType = DistanceType.EuclideanDistance,
) : ClusterData => {
  const { nodes = [], edges = [] } = data;

  const defaultClusterInfo = {
    clusters: [
      {
        id: "0",
        nodes,
      }
    ],
    clusterEdges: []
  };

  // 距离类型为欧式距离且没有属性时，直接return
  if (distanceType === DistanceType.EuclideanDistance && !nodes.every(node => node.hasOwnProperty(propertyKey))){
    return defaultClusterInfo;
  }

  // 所有节点属性集合
  let properties = [];
  // 所有节点属性one-hot特征向量集合
  let allPropertiesWeight = [];
  if (distanceType === DistanceType.EuclideanDistance) {
    properties = getAllProperties(nodes, propertyKey);
    allPropertiesWeight = oneHot(properties, involvedKeys, uninvolvedKeys);
  }
  if (!allPropertiesWeight.length) {
    return defaultClusterInfo;
  }
  const allPropertiesWeightUniq = uniq(allPropertiesWeight.map(item => item.join('')));
  // 当输入节点数量或者属性集合的长度小于k时，k调整为其中最小的值
  const finalK = Math.min(k, nodes.length, allPropertiesWeightUniq.length);

  // 记录节点的原始index，与allPropertiesWeight对应
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].originIndex = i;
  }
  // 初始化质心（聚类中心）
  const centroids = [];
  const centroidIndexList = [];
  const clusters = [];
  for (let i = 0; i < finalK; i++) {
    if (i === 0) {
      // 随机选取质心（聚类中心）
      const randomIndex = Math.floor(Math.random() * nodes.length);
      switch (distanceType) {
        case DistanceType.EuclideanDistance:
          centroids[i] = allPropertiesWeight[randomIndex];
          break;
        default:
          centroids[i] = [];
          break;
      }
      centroidIndexList.push(randomIndex);
      clusters[i] = [nodes[randomIndex]];
      nodes[randomIndex].clusterId = String(i);
    } else {
      let maxDistance = -Infinity;
      let maxDistanceNodeIndex = 0;
      // 选取与已有质心平均距离最远的点做为新的质心
      for (let m = 0; m < nodes.length; m++) {
        if (!centroidIndexList.includes(m)) {
          let totalDistance = 0;
          for (let j = 0; j < centroids.length; j++) {
            // 求节点到质心的距离（默认节点属性的欧式距离）
            let distance = 0;
            switch (distanceType) {
              case DistanceType.EuclideanDistance:
                distance = getDistance(allPropertiesWeight[nodes[m].originIndex], centroids[j], distanceType);
                break;
              default:
                break;
            }
            totalDistance += distance;
          }
          // 节点到各质心的平均距离（默认欧式距离）
          const avgDistance = totalDistance / centroids.length;
          // 记录到已有质心最远的的距离和节点索引
          if (avgDistance > maxDistance && 
            !centroids.find(centroid => isEqual(centroid, getCentroid(distanceType, allPropertiesWeight, nodes[m].originIndex)))) {
            maxDistance = avgDistance;
            maxDistanceNodeIndex = m;
          }
        }
      }
      
      centroids[i] = getCentroid(distanceType, allPropertiesWeight, maxDistanceNodeIndex);
      centroidIndexList.push(maxDistanceNodeIndex);
      clusters[i] = [nodes[maxDistanceNodeIndex]];
      nodes[maxDistanceNodeIndex].clusterId = String(i);
    }
  }


  let iterations = 0;
  while (true) {
    for (let i = 0; i < nodes.length; i++) {
      let minDistanceIndex = 0;
      let minDistance = Infinity;
      if (!(iterations === 0 && centroidIndexList.includes(i))) {
        for (let j = 0; j < centroids.length; j++) {
          // 求节点到质心的距离（默认节点属性的欧式距离）
          let distance = 0;
          switch (distanceType) {
            case DistanceType.EuclideanDistance:
              distance = getDistance(allPropertiesWeight[i], centroids[j], distanceType);
              break;
            default:
              break;
          }
          // 记录节点最近的质心的索引
          if (distance < minDistance) {
            minDistance = distance;
            minDistanceIndex = j;
          }
        }
      
        // 从原来的类别删除节点
        if (nodes[i].clusterId !== undefined) {
          for (let n = clusters[Number(nodes[i].clusterId)].length - 1; n >= 0 ; n--) {
            if (clusters[Number(nodes[i].clusterId)][n].id === nodes[i].id) {
              clusters[Number(nodes[i].clusterId)].splice(n, 1);
            }
          }
        }
        // 将节点划分到距离最小的质心（聚类中心）所对应的类中
        nodes[i].clusterId = String(minDistanceIndex);
        clusters[minDistanceIndex].push(nodes[i]);
      }
    }

    // 是否存在质心（聚类中心）移动
    let centroidsEqualAvg = false;
    for (let i = 0; i < clusters.length; i ++) {
      const clusterNodes = clusters[i];
      let totalVector = new Vector([]);
      for (let j = 0; j < clusterNodes.length; j++) {
        totalVector = totalVector.add(new Vector(allPropertiesWeight[clusterNodes[j].originIndex]));
      }
      // 计算每个类别的均值向量
      const avgVector = totalVector.avg(clusterNodes.length);
      // 如果均值向量不等于质心向量
      if (!avgVector.equal(new Vector(centroids[i]))) {
        centroidsEqualAvg = true;
        // 移动/更新每个类别的质心（聚类中心）到该均值向量
        centroids[i] = avgVector.getArr();
      }
    }
    iterations++;
    // 如果每个节点都归属了类别，且不存在质心（聚类中心）移动或者迭代次数超过1000，则停止
    if (nodes.every(node => node.clusterId !== undefined) && centroidsEqualAvg || iterations >= 1000) {
      break;
    }
  }

  // get the cluster edges
  const clusterEdges = [];
  const clusterEdgeMap = {};
  edges.forEach(edge => {
    const { source, target } = edge;
    const sourceClusterId = nodes.find(node => node.id === source)?.clusterId;
    const targetClusterId = nodes.find(node => node.id === target)?.clusterId;
    const newEdgeId = `${sourceClusterId}---${targetClusterId}`;
    if (clusterEdgeMap[newEdgeId]) {
      clusterEdgeMap[newEdgeId].count++;
    } else {
      const newEdge = {
        source: sourceClusterId,
        target: targetClusterId,
        count: 1
      };
      clusterEdgeMap[newEdgeId] = newEdge;
      clusterEdges.push(newEdge);
    }
  });

  return { clusters, clusterEdges };
}

export default kMeans;
