import { IAlgorithmCallbacks, GraphData } from './types'
import { getNeighbors } from './util'

function initCallbacks(callbacks: IAlgorithmCallbacks = {} as IAlgorithmCallbacks) {
  const initiatedCallback = callbacks;

  const stubCallback = () => {};

  const allowTraversalCallback = (() => {
    const seen = {};
    return ({ next }) => {
      if (!seen[next]) {
        seen[next] = true;
        return true;
      }
      return false;
    };
  })();

  initiatedCallback.allowTraversal = callbacks.allowTraversal || allowTraversalCallback;
  initiatedCallback.enter = callbacks.enter || stubCallback;
  initiatedCallback.leave = callbacks.leave || stubCallback;

  return initiatedCallback;
}

/**
 * @param {Graph} graph
 * @param {GraphNode} currentNode
 * @param {GraphNode} previousNode
 * @param {Callbacks} callbacks
 */
function depthFirstSearchRecursive(
  graphData: GraphData,
  currentNode: string,
  previousNode: string,
  callbacks: IAlgorithmCallbacks,
) {
  callbacks.enter({
    current: currentNode,
    previous: previousNode,
  });

  getNeighbors(currentNode, graphData.edges, 'target').forEach((nextNode) => {
    if (
      callbacks.allowTraversal({
        previous: previousNode,
        current: currentNode,
        next: nextNode,
      })
    ) {
      depthFirstSearchRecursive(graphData, nextNode, currentNode, callbacks);
    }
  });

  callbacks.leave({
    current: currentNode,
    previous: previousNode,
  });
}

/**
 * 深度优先遍历图
 * @param data GraphData 图数据
 * @param startNodeId 开始遍历的节点的 ID
 * @param originalCallbacks 回调
 */
export default function depthFirstSearch(
  graphData: GraphData,
  startNodeId: string,
  callbacks?: IAlgorithmCallbacks,
) {
  depthFirstSearchRecursive(graphData, startNodeId, '', initCallbacks(callbacks));
}
