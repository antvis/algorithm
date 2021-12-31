
import { clone, isObjectLike } from '@antv/util';
import { getAllProperties } from './utils/node-properties';
import { oneHot } from './utils/data-preprocessing';
import Vector from './utils/vector';
import { NodeConfig } from './types';
/**
 *  k-means算法 根据节点属性之间的欧氏距离将节点聚类为K个簇
 * @param originNodes 节点集合 
 * @param k 质心（聚类中心）个数
 */
const kMeans = (
    originNodes: NodeConfig[],
    k: number = 3,
    involvedKeys: string[] = [],
    uninvolvedKeys: string[] = [],
    propertyKey: string = 'properties',
  ) : NodeConfig[][] => {
    const nodes = clone(originNodes);
    // 所有节点属性集合
    const properties = getAllProperties(nodes, propertyKey);
    // 所有节点属性one-hot特征向量集合s
    const allPropertiesWeight = oneHot(properties, involvedKeys, uninvolvedKeys);
    // 记录节点的原始index，与allPropertiesWeight对应
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].originIndex = i;
    }
    // 初始化质心（聚类中心）
    const centroids = [];
    const centroidIndexList = [];
    const clusters = [];
    for (let i = 0; i < k; i ++) {
      if (i === 0) {
        // 随机选取质心（聚类中心）
        const randomIndex = Math.floor(Math.random() * nodes.length);
        centroids[i] = allPropertiesWeight[randomIndex];
        centroidIndexList.push(randomIndex);
        clusters[i] = [nodes[randomIndex]];
        nodes[randomIndex].clusterId = i;
      } else {
        let maxEuclideanDistance = -Infinity;
        let maxEuclideanDistanceIndex = 0;
        // 选取与已有质心平均距离最远的点做为新的质心
        for (let m = 0; m < nodes.length; m++) {
          if (!centroidIndexList.includes(m)) {
            let totalEuclideanDistance = 0;
            for (let j = 0; j < centroids.length; j++) {
              // 求节点到质心的欧式距离
              const euclideanDistance = new Vector(allPropertiesWeight[nodes[m].originIndex]).euclideanDistance(new Vector(centroids[j]));
              totalEuclideanDistance += euclideanDistance;
            }
            // 节点到各质心的平均欧式距离
            const avgEuclideanDistance = totalEuclideanDistance / centroids.length;
            // 记录节点到已有质心最远的的距离
            if (avgEuclideanDistance > maxEuclideanDistance) {
              maxEuclideanDistance = avgEuclideanDistance;
              maxEuclideanDistanceIndex = m;
            }
          }
        }
        centroids[i] = allPropertiesWeight[maxEuclideanDistanceIndex];
        centroidIndexList.push(maxEuclideanDistanceIndex);
        clusters[i] = [nodes[maxEuclideanDistanceIndex]];
        nodes[maxEuclideanDistanceIndex].clusterId = i;
      }
    }

    let iterations = 0;
    while (true) {
      for (let i = 0; i < nodes.length; i++) {
        let minEuclideanDistanceIndex = 0;
        let minEuclideanDistance = Infinity;
        if (!(iterations === 0 && centroidIndexList.includes(i))) {
          for (let j = 0; j < centroids.length; j++) {
            // 求节点到质心的欧式距离
            const euclideanDistance = new Vector(allPropertiesWeight[i]).euclideanDistance(new Vector(centroids[j]));
            // 记录节点最近的质心的索引
            if (euclideanDistance < minEuclideanDistance) {
              minEuclideanDistance = euclideanDistance;
              minEuclideanDistanceIndex = j;
            }
          }
        
          // 从原来的类别删除节点
          if (nodes[i].clusterId !== minEuclideanDistanceIndex) {
            for (let n = 0; n < clusters[minEuclideanDistanceIndex].length; n++) {
              if (clusters[minEuclideanDistanceIndex][n].id === nodes[i].id) {
                clusters[minEuclideanDistanceIndex].splice(n, 1);
              }
            }
            // 将节点划分到距离最小的质心（聚类中心）所对应的类中
            clusters[minEuclideanDistanceIndex].push(nodes[i]);
            nodes[i].clusterId = minEuclideanDistanceIndex;
          }
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
      // 如果不存在质心（聚类中心）移动或者迭代次数超过1000，则停止
      if (centroidsEqualAvg || iterations >= 1000) {
        break;
      }
    }
    return clusters;
}

export default kMeans;
