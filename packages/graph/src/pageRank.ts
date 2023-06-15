import { ID } from "@antv/graphlib";
import { Graph } from "./types";

/**
 * PageRank https://en.wikipedia.org/wiki/PageRank
 * refer: https://github.com/anvaka/ngraph.pagerank
 * @param graph
 * @param tolerance
 * @param alpha
 * @param maxIterations
 */
export const pageRank = (
  graph: Graph,
  tolerance = 1e-5,
  alpha = 0.85,
  maxIterations = 1000
): { id: ID; score: number }[] => {
  let distance = 1;
  let leakedRank = 0;

  const nodes = graph.getAllNodes();
  const edges = graph.getAllEdges();
  const nodesCount = nodes.length;
  let currentRank: number;
  const curRanks: Record<ID, number> = {};
  const prevRanks: Record<ID, number> = {};

  // Initialize pageranks 初始化
  for (let j = 0; j < nodesCount; ++j) {
    const node = nodes[j];
    const nodeId = node.id;
    curRanks[nodeId] = 1 / nodesCount;
    prevRanks[nodeId] = 1 / nodesCount;
  }

  const nodeDegree = degree(graphData);
  while (maxIterations > 0 && distance > tolerance) {
    leakedRank = 0;
    for (let j = 0; j < nodesCount; ++j) {
      const node = nodes[j];
      const nodeId = node.id;
      currentRank = 0;
      if (nodeDegree[node.id].inDegree === 0) {
        curRanks[nodeId] = 0;
      } else {
        const neighbors = graph.getRelatedEdges(nodeId, "in");
        for (let i = 0; i < neighbors.length; ++i) {
          const neighbor = neighbors[i];
          const outDegree: number = nodeDegree[neighbor].outDegree;
          if (outDegree > 0) currentRank += prevRanks[neighbor] / outDegree;
        }
        curRanks[nodeId] = alpha * currentRank;
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
    maxIterations -= 1;
  }

  return prevRanks;
};
