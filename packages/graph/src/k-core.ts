
import { clone } from '@antv/util';
import degree from './degree';
import { GraphData } from './types';
/**
 *  k-core算法 找出符合指定核心度的紧密关联的子图结构
 * @param graphData 图数据
 * @param k 核心度数
 */
const kCore = (
    graphData: GraphData,
    k: number = 1,
  ): GraphData => {
    const data = clone(graphData);
    const { nodes = [] } = data;
    let { edges = [] } = data;
    while (true) {
        // 获取图中节点的度数
        const degrees = degree({ nodes, edges});
        const nodeIds = Object.keys(degrees);
        // 按照度数进行排序
        nodeIds.sort((a, b) => degrees[a]?.degree - degrees[b]?.degree);
        const minIndexId = nodeIds[0];
        if (!nodes.length || degrees[minIndexId]?.degree >= k) {
            break;
        }
        const originIndex = nodes.findIndex(node => node.id === minIndexId);
        // 移除度数小于k的节点
        nodes.splice(originIndex, 1);
        // 移除度数小于k的节点相关的边
        edges = edges.filter(edge => !(edge.source === minIndexId || edge.target === minIndexId));
    }
    
    return { nodes, edges };
}

export default kCore;
