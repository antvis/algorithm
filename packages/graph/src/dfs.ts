import { Graph, IAlgorithmCallbacks, NodeID } from './types';

function initCallbacks(callbacks: IAlgorithmCallbacks = {} as IAlgorithmCallbacks) {
  const initiatedCallback = callbacks;
  const stubCallback = () => { };
  const allowTraversalCallback = () => true;
  initiatedCallback.allowTraversal = callbacks.allowTraversal || allowTraversalCallback;
  initiatedCallback.enter = callbacks.enter || stubCallback;
  initiatedCallback.leave = callbacks.leave || stubCallback;

  return initiatedCallback;
}

function depthFirstSearchRecursive(
  graph: Graph,
  currentNodeId: NodeID,
  previousNodeId: NodeID,
  callbacks: IAlgorithmCallbacks,
  visit: Set<NodeID>
) {
  callbacks.enter({
    current: currentNodeId,
    previous: previousNodeId,
  });
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
      depthFirstSearchRecursive(graph, nextNodeId, currentNodeId, callbacks, visit);
    }
  });
  callbacks.leave({
    current: currentNodeId,
    previous: previousNodeId,
  });
}

export function depthFirstSearch(
  graph: Graph,
  startNodeId: NodeID,
  originalCallbacks?: IAlgorithmCallbacks,
) {
  const visit = new Set<NodeID>();
  visit.add(startNodeId);
  depthFirstSearchRecursive(graph, startNodeId, '', initCallbacks(originalCallbacks), visit);
}
