import { GraphData } from "./types";
import degree from './degree'
import { getNeighbors } from "./util";

/**
 * PageRank https://en.wikipedia.org/wiki/PageRank
 * refer: https://github.com/anvaka/ngraph.pagerank
 * @param graph 
 * @param epsilon 判断是否收敛的精度值，默认 0.000001
 * @param linkProb 阻尼系数（dumping factor），指任意时刻，用户访问到某节点后继续访问该节点链接的下一个节点的概率，经验值 0.85
 */
const pageRank = (graphData: GraphData, epsilon?: number, linkProb?: number): {
  [key: string]: number;
} => {
  if (typeof epsilon !== 'number') epsilon = 0.000001;
  if (typeof linkProb !== 'number') linkProb = 0.85;

  let distance = 1;
  let leakedRank = 0;
  let maxIterations = 1000;

  const { nodes, edges } = graphData;
  const nodesCount = nodes.length;
  let currentRank;
  const curRanks = {};
  const prevRanks = {}

  // Initialize pageranks 初始化
  for (let j = 0; j < nodesCount; ++j) {
    const node = nodes[j];
    const nodeId = node.id;
    curRanks[nodeId] = (1 / nodesCount)
    prevRanks[nodeId] = (1 / nodesCount)
  }

  const nodeDegree = degree(graphData)
  while (maxIterations > 0 && distance > epsilon) {
    leakedRank = 0;
    for (let j = 0; j < nodesCount; ++j) {
      const node = nodes[j];
      const nodeId = node.id;
      currentRank = 0;
      if (nodeDegree[node.id].inDegree === 0) {
        curRanks[nodeId] = 0;
      } else {
        const neighbors = getNeighbors(nodeId, edges, 'source');
        for (let i = 0; i < neighbors.length; ++i) {
          const neighbor = neighbors[i];
          const outDegree: number = nodeDegree[neighbor].outDegree;
          if (outDegree > 0) currentRank += (prevRanks[neighbor] / outDegree);
        }
        curRanks[nodeId] = linkProb * currentRank;
        leakedRank += curRanks[nodeId];
      }
    }

    leakedRank = (1 - leakedRank) / nodesCount;
    distance = 0;
    for (let j = 0; j < nodesCount; ++j) {
      const node = nodes[j];
      const nodeId = node.id;
      currentRank = curRanks[nodeId] + leakedRank;
      distance += Math.abs(currentRank - prevRanks[nodeId]);
      prevRanks[nodeId] = currentRank;
    }
    maxIterations -= 1
  }

  return prevRanks;
}

export default pageRank
