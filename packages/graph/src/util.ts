import { EdgeConfig, GraphData, Matrix } from './types'

/**
 * 获取指定节点的所有邻居
 * @param nodeId 节点 ID
 * @param edges 图中的所有边数据
 * @param type 邻居类型
 */
export const getNeighbors = (nodeId: string, edges: EdgeConfig[] = [], type?: 'target' | 'source' | undefined): string[] => {
  const currentEdges = edges.filter(edge => edge.source === nodeId || edge.target === nodeId)
  if (type === 'target') {
    // 当前节点为 source，它所指向的目标节点
    const neighhborsConverter = (edge: EdgeConfig) => {
      return edge.source === nodeId;
    };
    return currentEdges.filter(neighhborsConverter).map((edge) => edge.target);
  }
  if (type === 'source') {
    // 当前节点为 target，它所指向的源节点
    const neighhborsConverter = (edge: EdgeConfig) => {
      return edge.target === nodeId;
    };
    return currentEdges.filter(neighhborsConverter).map((edge) => edge.source);
  }

  // 若未指定 type ，则返回所有邻居
  const neighhborsConverter = (edge: EdgeConfig) => {
    return edge.source === nodeId ? edge.target : edge.source;
  };
  return currentEdges.map(neighhborsConverter);
}

/**
 * 获取指定节点的出边
 * @param nodeId 节点 ID
 * @param edges 图中的所有边数据
 */
export const getOutEdgesNodeId = (nodeId: string, edges: EdgeConfig[]) => {
  return edges.filter(edge => edge.source === nodeId)
}

/**
 * 获取指定节点的边，包括出边和入边
 * @param nodeId 节点 ID
 * @param edges 图中的所有边数据
 */
export const getEdgesByNodeId = (nodeId: string, edges: EdgeConfig[]) => {
  return edges.filter(edge => edge.source === nodeId || edge.target === nodeId)
}

/**
 * 生成唯一的 ID，规则是序号 + 时间戳
 * @param index 序号
 */
export const uniqueId = (index: number = 0) => {
  const random1 = `${Math.random()}`.split('.')[1].substr(0, 5);
  const random2 = `${Math.random()}`.split('.')[1].substr(0, 5);
  return `${index}-${random1}${random2}`
};
