import { GraphData, DegreeType } from "./types";

const degree = (graphData: GraphData): DegreeType => {
  const degrees: DegreeType = {};
  const { nodes, edges } = graphData

  nodes.forEach((node) => {
    degrees[node.id] = {
      degree: 0,
      inDegree: 0,
      outDegree: 0,
    };
  });

  edges.forEach((edge) => {
    degrees[edge.source].degree++;
    degrees[edge.source].outDegree++;
    degrees[edge.target].degree++;
    degrees[edge.target].inDegree++;
  });

  return degrees;
};

export default degree;

/**
 * 获取指定节点的入度
 * @param graphData 图数据
 * @param nodeId 节点ID
 */
export const getInDegree = (graphData: GraphData, nodeId: string) => {
  const nodeDegree = degree(graphData)
  if (nodeDegree[nodeId]) {
    return degree(graphData)[nodeId].inDegree
  }
  return 0
}

/**
 * 获取指定节点的出度
 * @param graphData 图数据
 * @param nodeId 节点ID
 */
export const getOutDegree = (graphData: GraphData, nodeId: string) => {
  const nodeDegree = degree(graphData)
  if (nodeDegree[nodeId]) {
    return degree(graphData)[nodeId].outDegree
  }
  return 0
}
