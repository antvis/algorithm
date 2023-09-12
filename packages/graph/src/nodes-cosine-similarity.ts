import { clone } from '@antv/util';
import { getAllProperties, oneHot } from './utils';
import { NodeSimilarity } from './types';
import { cosineSimilarity } from './cosine-similarity';

/**
Calculates the cosine similarity based on node attributes using the nodes-cosine-similarity algorithm.
This algorithm is used to find similar nodes based on a seed node in a graph.
@param nodes - The data of graph nodes.
@param seedNode - The seed node for similarity calculation.
@param involvedKeys - The collection of keys that are involved in the calculation.
@param uninvolvedKeys - The collection of keys that are not involved in the calculation.
@returns An array of nodes that are similar to the seed node based on cosine similarity.
*/
export const nodesCosineSimilarity = (
  nodes: NodeSimilarity[] = [],
  seedNode: NodeSimilarity,
  involvedKeys: string[] = [],
  uninvolvedKeys: string[] = [],
): {
  allCosineSimilarity: number[],
  similarNodes: NodeSimilarity[],
} => {
  const similarNodes = clone(nodes.filter(node => node.id !== seedNode.id));
  const seedNodeIndex = nodes.findIndex(node => node.id === seedNode.id);
  // Collection of all node properties
  const properties = getAllProperties(nodes);
  // One-hot feature vectors for all node properties
  const allPropertiesWeight = oneHot(properties, involvedKeys, uninvolvedKeys) as number[][];
  // Seed node properties
  const seedNodeProperties = allPropertiesWeight[seedNodeIndex];
  const allCosineSimilarity: number[] = [];
  similarNodes.forEach((node: NodeSimilarity, index: number) => {
    const nodeProperties = allPropertiesWeight[index];
    // Calculate the cosine similarity between node vector and seed node vector
    const cosineSimilarityValue = cosineSimilarity(nodeProperties, seedNodeProperties);
    allCosineSimilarity.push(cosineSimilarityValue);
    node.data.cosineSimilarity = cosineSimilarityValue;
  });
  // Sort the returned nodes according to cosine similarity
  similarNodes.sort((a: NodeSimilarity, b: NodeSimilarity) => b.data.cosineSimilarity - a.data.cosineSimilarity);
  return { allCosineSimilarity, similarNodes };
}
