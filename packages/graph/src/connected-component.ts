import { GraphData, NodeConfig } from "./types";
import { getNeighbors } from "./util";

/**
 * Generate all connected components for an undirected graph
 * @param graph
 */
export function detectConnectedComponents(graphData: GraphData): NodeConfig[][] {
  const { nodes, edges } = graphData
  const allComponents: NodeConfig[][] = [];
  const visited = {};
  const nodeStack: NodeConfig[] = [];

  const getComponent = (node: NodeConfig) => {
    nodeStack.push(node);
    visited[node.id] = true;
    const neighbors = getNeighbors(node.id, edges);
    for (let i = 0; i < neighbors.length; ++i) {
      const neighbor = neighbors[i];
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
      // 对于无向图进行dfs遍历，每一次调用后都得到一个连通分量
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
 * Tarjan's Algorithm 复杂度  O(|V|+|E|)
 * For directed graph only
 * a directed graph is said to be strongly connected if "every vertex is reachable from every other vertex".
 * refer: http://en.wikipedia.org/wiki/Tarjan%27s_strongly_connected_components_algorithm
 * @param graph
 * @return a list of strongly connected components
 */
export function detectStrongConnectComponents(graphData: GraphData): NodeConfig[][] {
  const { nodes, edges } = graphData
  const nodeStack: NodeConfig[] = [];
  const inStack = {}; // 辅助判断是否已经在stack中，减少查找开销
  const indices = {};
  const lowLink = {};
  const allComponents: NodeConfig[][] = [];
  let index = 0;

  const getComponent = (node: NodeConfig) => {
    // Set the depth index for v to the smallest unused index
    indices[node.id] = index;
    lowLink[node.id] = index;
    index += 1;
    nodeStack.push(node);
    inStack[node.id] = true;

    // 考虑每个邻接点
    const neighbors = getNeighbors(node.id, edges, 'target').filter((n) => nodes.map(node => node.id).indexOf(n) > -1);
    for (let i = 0; i < neighbors.length; i++) {
      const targetNodeID = neighbors[i];
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

export default function getConnectedComponents(graphData: GraphData, directed?: boolean): NodeConfig[][] {
  if (directed) return detectStrongConnectComponents(graphData);
  return detectConnectedComponents(graphData);
}
