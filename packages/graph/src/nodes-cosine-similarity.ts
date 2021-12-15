import { clone } from '@antv/util';
import { NodeConfig } from './types';
import { getPropertyWeight } from './utils/node-properties';
import cosineSimilarity from './cosine-similarity';
/**
 *  nodes-cosine-similarity算法 基于节点属性计算余弦相似度(基于种子节点寻找相似节点)
 * @param nodes 图节点数据
 * @param seedNode 种子节点
 */
const nodesCosineSimilarity = (
  nodes: NodeConfig[] = [],
  seedNode: NodeConfig,
): {
  allCosineSimilarity: number[],
  similarNodes: NodeConfig[],
} => {
  const similarNodes = clone(nodes.filter(node => node.id !== seedNode.id));
  const seedNodeIndex = nodes.findIndex(node => node.id === seedNode.id);
  // 所有节点属性特征向量集合
  const allPropertiesWeight = getPropertyWeight(nodes);
  // 种子节点属性
  const seedNodeProperties = allPropertiesWeight[seedNodeIndex];

  const allCosineSimilarity: number[] = [];
  similarNodes.forEach((node, index) => {
    if (node.id !== seedNode.id) {
      // 节点属性
      const nodeProperties = allPropertiesWeight[index];
      // 计算节点向量和种子节点向量的余弦相似度
      const cosineSimilarityValue = cosineSimilarity(nodeProperties, seedNodeProperties);
      allCosineSimilarity.push(cosineSimilarityValue);
      node.cosineSimilarity = cosineSimilarityValue;
    }
  });

  // 将返回的节点按照余弦相似度大小排序
  similarNodes.sort((a, b) => b.cosineSimilarity - a.cosineSimilarity);
  return { allCosineSimilarity, similarNodes };
}

export default nodesCosineSimilarity;
