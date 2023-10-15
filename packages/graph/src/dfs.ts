import { Graph, IAlgorithmCallbacks, NodeID } from './types';

/**
 * Initializes the callback functions for the depth-first search algorithm.
 * @param callbacks (Optional) The original callbacks object containing custom callback functions.
 * @returns The initialized callbacks object.
 */
function initCallbacks(callbacks: IAlgorithmCallbacks = {} as IAlgorithmCallbacks) {
  const initiatedCallback = callbacks;
  const stubCallback = () => { };
  const allowTraversalCallback = () => true;
  initiatedCallback.allowTraversal = callbacks.allowTraversal || allowTraversalCallback;
  initiatedCallback.enter = callbacks.enter || stubCallback;
  initiatedCallback.leave = callbacks.leave || stubCallback;
  return initiatedCallback;
}

/**
 * Recursively performs a depth-first search on a graph starting from a specified node.
 * @param graph The graph to perform the depth-first search on.
 * @param currentNodeId The ID of the current node being visited.
 * @param previousNodeId The ID of the previous node visited.
 * @param callbacks The callback functions for the depth-first search algorithm.
 * @param visit A set containing the visited node IDs.
 * @param directed A boolean indicating whether the graph is directed.
 * @param visitOnce A boolean indicating whether each node should be visited only once.
 */
function depthFirstSearchRecursive(
  graph: Graph,
  currentNodeId: NodeID,
  previousNodeId: NodeID,
  callbacks: IAlgorithmCallbacks,
  visit: Set<NodeID>,
  directed: boolean,
  visitOnce: boolean,
) {
  callbacks.enter({
    current: currentNodeId,
    previous: previousNodeId,
  });
  const neighbors = directed
    ?
    graph.getRelatedEdges(currentNodeId, "out").map((e) => graph.getNode(e.target))
    :
    graph.getNeighbors(currentNodeId)
    ;
  neighbors.forEach((nextNode) => {
    const nextNodeId = nextNode.id;
    // `Visit` is not considered when judging recursive conditions
    if (
      visitOnce ?
        (callbacks.allowTraversal({
          previous: previousNodeId,
          current: currentNodeId,
          next: nextNodeId,
        }) && !visit.has(nextNodeId))
        :
        callbacks.allowTraversal({
          previous: previousNodeId,
          current: currentNodeId,
          next: nextNodeId,
        })
    ) {
      visit.add(nextNodeId);
      depthFirstSearchRecursive(graph, nextNodeId, currentNodeId, callbacks, visit, directed, visitOnce);
    }
  });
  callbacks.leave({
    current: currentNodeId,
    previous: previousNodeId,
  });
}

/**
 * Performs a depth-first search on a graph starting from a specified node.
 * @param graph The graph to perform the depth-first search on.
 * @param startNodeId The ID of the node to start the search from.
 * @param originalCallbacks (Optional) The original callbacks object containing custom callback functions.
 * @param directed A boolean indicating whether the graph is directed (default: false).
 * @param visitOnce A boolean indicating whether each node should be visited only once (default: true).
 */
export function depthFirstSearch(
  graph: Graph,
  startNodeId: NodeID,
  originalCallbacks?: IAlgorithmCallbacks,
  directed: boolean = false,
  visitOnce: boolean = true
) {
  const visit = new Set<NodeID>();
  visit.add(startNodeId);
  depthFirstSearchRecursive(graph, startNodeId, '', initCallbacks(originalCallbacks), visit, directed, visitOnce);
}
