import { Graph, INode, NodeID } from './types';
/**
 * Generate all connected components for an undirected graph
 * @param graph
 */
export const detectConnectedComponents = (graph: Graph): INode[][] => {
  const nodes = graph.getAllNodes();
  const allComponents: INode[][] = [];
  const visited: { [key: NodeID]: boolean } = {};
  const nodeStack: INode[] = [];
  const getComponent = (node: INode) => {
    nodeStack.push(node);
    visited[node.id] = true;
    const neighbors = graph.getNeighbors(node.id);
    for (let i = 0; i < neighbors.length; ++i) {
      const neighbor = neighbors[i].id;
      if (!visited[neighbor]) {
        const targetNode = nodes.filter(node => node.id === neighbor)
        if (targetNode.length > 0) {
          getComponent(targetNode[0]);
        }
      }
    }
  };
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!visited[node.id]) {
      // For DFS traversal of undirected graphs, a connected component is obtained after each call
      getComponent(node);
      const component = [];
      while (nodeStack.length > 0) {
        component.push(nodeStack.pop());
      }
      allComponents.push(component);
    }
  }
  return allComponents;
}

/**
 * Tarjan's Algorithm O(|V|+|E|)
 * For directed graph only
 * a directed graph is said to be strongly connected if "every vertex is reachable from every other vertex".
 * refer: http://en.wikipedia.org/wiki/Tarjan%27s_strongly_connected_components_algorithm
 * @param graph
 * @return a list of strongly connected components
 */
export const detectStrongConnectComponents = (graph: Graph): INode[][] => {
  const nodes = graph.getAllNodes();
  const nodeStack: INode[] = [];
  //Assist to determine whether it is already in the stack to reduce the search overhead
  const inStack: { [key: NodeID]: boolean } = {};
  const indices: { [key: NodeID]: number } = {};
  const lowLink: { [key: NodeID]: number } = {};
  const allComponents: INode[][] = [];
  let index = 0;
  const getComponent = (node: INode) => {
    // Set the depth index for v to the smallest unused index
    indices[node.id] = index;
    lowLink[node.id] = index;
    index += 1;
    nodeStack.push(node);
    inStack[node.id] = true;
    const relatedEdges = graph.getRelatedEdges(node.id, "out");
    for (let i = 0; i < relatedEdges.length; i++) {
      const targetNodeID = relatedEdges[i].target;
      if (!indices[targetNodeID] && indices[targetNodeID] !== 0) {
        const targetNode = nodes.filter(node => node.id === targetNodeID)
        if (targetNode.length > 0) {
          getComponent(targetNode[0]);
        }
        // tree edge
        lowLink[node.id] = Math.min(lowLink[node.id], lowLink[targetNodeID]);
      } else if (inStack[targetNodeID]) {
        // back edge, target node is in the current SCC
        lowLink[node.id] = Math.min(lowLink[node.id], indices[targetNodeID]);
      }
    }
    // If node is a root node, generate an SCC
    if (lowLink[node.id] === indices[node.id]) {
      const component = [];
      while (nodeStack.length > 0) {
        const tmpNode = nodeStack.pop();
        inStack[tmpNode.id] = false;
        component.push(tmpNode);
        if (tmpNode === node) break;
      }
      if (component.length > 0) {
        allComponents.push(component);
      }
    }
  };
  for (const node of nodes) {
    if (!indices[node.id] && indices[node.id] !== 0) {
      getComponent(node);
    }
  }
  return allComponents;
}

export function getConnectedComponents(graph: Graph, directed?: boolean): INode[][] {
  if (directed) return detectStrongConnectComponents(graph);
  return detectConnectedComponents(graph);
}
