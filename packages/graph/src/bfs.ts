import Queue from './structs/queue'
import { Graph, IAlgorithmCallbacks, NodeID } from './types';

/**
* @param startNodeId The ID of the bfs traverse starting node.
* @param callbacks Optional object containing callback functions.
    - allowTraversal: Determines if BFS should traverse from the vertex along its edges to its neighbors. By default, a node can only be traversed once.
    - enterNode: Called when BFS visits a node.
    - leaveNode: Called after BFS visits the node.
*/
function initCallbacks(startNodeId: NodeID, callbacks: IAlgorithmCallbacks = {} as IAlgorithmCallbacks) {
  const initiatedCallback = callbacks;
  const stubCallback = () => { };
  const allowTraversalCallback = () => true;
  initiatedCallback.allowTraversal = callbacks.allowTraversal || allowTraversalCallback;
  initiatedCallback.enter = callbacks.enter || stubCallback;
  initiatedCallback.leave = callbacks.leave || stubCallback;
  return initiatedCallback;
}

/**
Performs breadth-first search (BFS) traversal on a graph.
@param graph - The graph to perform BFS on.
@param startNodeId - The ID of the starting node for BFS.
@param originalCallbacks - Optional object containing callback functions for BFS.
*/
const breadthFirstSearch = (
  graph: Graph,
  startNodeId: NodeID,
  originalCallbacks?: IAlgorithmCallbacks,
) => {
  const visit = new Set<NodeID>();
  const callbacks = initCallbacks(startNodeId, originalCallbacks);
  const nodeQueue = new Queue();
  // init Queue. Enqueue node ID.
  nodeQueue.enqueue(startNodeId);
  visit.add(startNodeId);
  let previousNodeId: NodeID = '';
  // 遍历队列中的所有顶点
  while (!nodeQueue.isEmpty()) {
    const currentNodeId: NodeID = nodeQueue.dequeue();
    callbacks.enter({
      current: currentNodeId,
      previous: previousNodeId,
    });

    // Enqueue all neighbors of currentNode
    graph.getNeighbors(currentNodeId).forEach((nextNode) => {
      const nextNodeId = nextNode.id;
      if (
        callbacks.allowTraversal({
          previous: previousNodeId,
          current: currentNodeId,
          next: nextNodeId,
        }) && !visit.has(nextNodeId)
      ) {
        visit.add(nextNodeId);
        nodeQueue.enqueue(nextNodeId);
      }
    });
    callbacks.leave({
      current: currentNodeId,
      previous: previousNodeId,
    });
    previousNodeId = currentNodeId;
  }
};

export default breadthFirstSearch;
