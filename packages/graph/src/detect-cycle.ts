import { ID, Node } from '@antv/graphlib';
import { depthFirstSearch } from './dfs';
import {
  getConnectedComponents,
  detectStrongConnectComponents,
} from './connected-component';
import { Graph, IAlgorithmCallbacks, INode, NodeData } from './types';

/**
 * Detects a directed cycle in a graph.
 *
 * @param graph The graph to detect the directed cycle in.
 * @returns An object representing the detected directed cycle, where each key-value pair represents a node ID and its parent node ID in the cycle.
 */
export const detectDirectedCycle = (
  graph: Graph
): {
  [key: ID]: ID;
} => {
  let cycle: {
    [key: ID]: ID;
  } = null;
  const nodes = graph.getAllNodes();
  const dfsParentMap: { [key: ID]: ID } = {};
  // The set of all nodes that are not being accessed
  const unvisitedSet: { [key: ID]: Node<NodeData> } = {};
  // The set of nodes being accessed
  const visitingSet: { [key: ID]: ID } = {};
  // The set of all nodes that have been accessed
  const visitedSet: { [key: ID]: ID } = {};
  // init unvisitedSet
  nodes.forEach((node) => {
    unvisitedSet[node.id] = node;
  });
  const callbacks: IAlgorithmCallbacks = {
    enter: ({ current: currentNodeId, previous: previousNodeId }) => {
      if (visitingSet[currentNodeId]) {
        // 如果当前节点正在访问中，则说明检测到环路了
        cycle = {};
        let currentCycleNodeId = currentNodeId;
        let previousCycleNodeId = previousNodeId;
        while (previousCycleNodeId !== currentNodeId) {
          cycle[currentCycleNodeId] = previousCycleNodeId;
          currentCycleNodeId = previousCycleNodeId;
          previousCycleNodeId = dfsParentMap[previousCycleNodeId];
        }
        cycle[currentCycleNodeId] = previousCycleNodeId;
      } else {
        visitingSet[currentNodeId] = currentNodeId;
        delete unvisitedSet[currentNodeId];
        dfsParentMap[currentNodeId] = previousNodeId;
      }
    },
    leave: ({ current: currentNodeId }) => {
      visitedSet[currentNodeId] = currentNodeId;
      delete visitingSet[currentNodeId];
    },
    allowTraversal: () => {
      if (cycle) {
        return false;
      }
      return true;
    },
  };
  for (const key of Object.keys(unvisitedSet)) {
    depthFirstSearch(graph, key, callbacks, true, false);
  }
  return cycle;
};

/**
 * Detects all undirected cycles in a graph.
 * @param graph The graph to detect cycles in.
 * @param nodeIds Optional array of node IDs to filter cycles by.
 * @param include Specifies whether the filtered cycles should be included (true) or excluded (false).
 * @returns An array of objects representing the detected cycles in the graph.
 */
export const detectAllUndirectedCycle = (
  graph: Graph,
  nodeIds?: ID[],
  include = true
) => {
  const allCycles: { [key: ID]: INode }[] = [];
  const components = getConnectedComponents(graph, false);
  // loop through all connected components
  for (const component of components) {
    if (!component.length) continue;
    const root = component[0];
    const rootId = root.id;
    const stack = [root];
    const parent = { [rootId]: root };
    const used = { [rootId]: new Set() };
    // walk a spanning tree to find cycles
    while (stack.length > 0) {
      const curNode = stack.pop();
      const curNodeId = curNode.id;
      const neighbors = graph.getNeighbors(curNodeId);
      // const neighbors = getNeighbors(curNodeId, graphData.edges);
      for (let i = 0; i < neighbors.length; i += 1) {
        const neighborId = neighbors[i].id;
        const neighbor = graph
          .getAllNodes()
          .find((node) => node.id === neighborId);
        if (neighborId === curNodeId) {
          allCycles.push({ [neighborId]: curNode });
        } else if (!(neighborId in used)) {
          // visit a new node
          parent[neighborId] = curNode;
          stack.push(neighbor);
          used[neighborId] = new Set([curNode]);
        } else if (!used[curNodeId].has(neighbor)) {
          // a cycle found
          let cycleValid = true;
          const cyclePath = [neighbor, curNode];
          let p = parent[curNodeId];
          while (used[neighborId].size && !used[neighborId].has(p)) {
            cyclePath.push(p);
            if (p === parent[p.id]) break;
            else p = parent[p.id];
          }
          cyclePath.push(p);
          if (nodeIds && include) {
            cycleValid = false;
            if (
              cyclePath.findIndex((node) => nodeIds.indexOf(node.id) > -1) > -1
            ) {
              cycleValid = true;
            }
          } else if (nodeIds && !include) {
            if (
              cyclePath.findIndex((node) => nodeIds.indexOf(node.id) > -1) > -1
            ) {
              cycleValid = false;
            }
          }
          // Format node list to cycle
          if (cycleValid) {
            const cycle: { [key: ID]: INode } = {};
            for (let index = 1; index < cyclePath.length; index += 1) {
              cycle[cyclePath[index - 1].id] = cyclePath[index];
            }
            if (cyclePath.length) {
              cycle[cyclePath[cyclePath.length - 1].id] = cyclePath[0];
            }
            allCycles.push(cycle);
          }
          used[neighborId].add(curNode);
        }
      }
    }
  }
  return allCycles;
};

/**
 * Detects all directed cycles in a graph.
 * @param graph The graph to detect cycles in.
 * @param nodeIds Optional array of node IDs to filter cycles by.
 * @param include Specifies whether the filtered cycles should be included (true) or excluded (false).
 * @returns An array of objects representing the detected cycles in the graph.
 */
export const detectAllDirectedCycle = (
  graph: Graph,
  nodeIds?: ID[],
  include = true
) => {
  const path: INode[] = []; // stack of nodes in current pate
  const blocked = new Set<INode>();
  const B: { [key: ID]: Set<INode> } = {}; // remember portions of the graph that yield no elementary circuit
  const allCycles: { [key: ID]: INode }[] = [];
  const idx2Node: {
    [key: number]: INode;
  } = {};
  const node2Idx: { [key: ID]: number } = {};
  // unblock all blocked nodes
  const unblock = (thisNode: INode) => {
    const stack = [thisNode];
    while (stack.length > 0) {
      const node = stack.pop();
      if (blocked.has(node)) {
        blocked.delete(node);
        B[node.id].forEach((n) => {
          stack.push(n);
        });
        B[node.id].clear();
      }
    }
  };

  const circuit = (
    node: INode,
    start: INode,
    adjList: { [key: ID]: number[] }
  ) => {
    let closed = false; // whether a path is closed
    if (nodeIds && !include && nodeIds.indexOf(node.id) > -1) {
      return closed;
    }
    path.push(node);
    blocked.add(node);
    const neighbors = adjList[node.id];
    for (let i = 0; i < neighbors.length; i += 1) {
      const neighbor = idx2Node[neighbors[i]];
      if (neighbor === start) {
        const cycle: { [key: ID]: INode } = {};
        for (let index = 1; index < path.length; index += 1) {
          cycle[path[index - 1].id] = path[index];
        }
        if (path.length) {
          cycle[path[path.length - 1].id] = path[0];
        }
        allCycles.push(cycle);
        closed = true;
      } else if (!blocked.has(neighbor)) {
        if (circuit(neighbor, start, adjList)) {
          closed = true;
        }
      }
    }
    if (closed) {
      unblock(node);
    } else {
      for (let i = 0; i < neighbors.length; i += 1) {
        const neighbor = idx2Node[neighbors[i]];
        if (!B[neighbor.id].has(node)) {
          B[neighbor.id].add(node);
        }
      }
    }
    path.pop();
    return closed;
  };

  const nodes = graph.getAllNodes();

  // Johnson's algorithm, sort nodes
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    const nodeId = node.id;
    node2Idx[nodeId] = i;
    idx2Node[i] = node;
  }
  // If there are specified included nodes, the specified nodes are sorted first in order to end the search early
  if (nodeIds && include) {
    for (let i = 0; i < nodeIds.length; i++) {
      const nodeId = nodeIds[i];
      node2Idx[nodes[i].id] = node2Idx[nodeId];
      node2Idx[nodeId] = 0;
      idx2Node[0] = nodes.find((node) => node.id === nodeId);
      idx2Node[node2Idx[nodes[i].id]] = nodes[i];
    }
  }

  // Returns the adjList of the strongly connected component of the node (order > = nodeOrder)
  const getMinComponentAdj = (components: INode[][]) => {
    let minCompIdx;
    let minIdx = Infinity;
    // Find least component and the lowest node
    for (let i = 0; i < components.length; i += 1) {
      const comp = components[i];
      for (let j = 0; j < comp.length; j++) {
        const nodeIdx = node2Idx[comp[j].id];
        if (nodeIdx < minIdx) {
          minIdx = nodeIdx;
          minCompIdx = i;
        }
      }
    }
    const component = components[minCompIdx];
    const adjList: { [key: ID]: number[] } = {};
    for (let i = 0; i < component.length; i += 1) {
      const node = component[i];
      adjList[node.id] = [];
      for (const neighbor of graph
        .getRelatedEdges(node.id, 'out')
        .map((n) => n.target)
        .filter((n) => component.map((c) => c.id).indexOf(n) > -1)) {
        // 对自环情况 (点连向自身) 特殊处理：记录自环，但不加入adjList
        if (
          neighbor === node.id &&
          !(!include && nodeIds.indexOf(node.id) > -1)
        ) {
          allCycles.push({ [node.id]: node });
        } else {
          adjList[node.id].push(node2Idx[neighbor]);
        }
      }
    }
    return {
      component,
      adjList,
      minIdx,
    };
  };

  let nodeIdx = 0;
  while (nodeIdx < nodes.length) {
    const sccs = detectStrongConnectComponents(graph).filter(
      (component) => component.length > 1
    );
    if (sccs.length === 0) break;
    const scc = getMinComponentAdj(sccs);
    const { minIdx, adjList, component } = scc;
    if (component.length > 1) {
      component.forEach((node) => {
        B[node.id] = new Set();
      });
      const startNode = idx2Node[minIdx];
      // StartNode is not in the specified node to include. End the search ahead of time.
      if (nodeIds && include && nodeIds.indexOf(startNode.id) === -1) {
        return allCycles;
      }
      circuit(startNode, startNode, adjList);
      nodeIdx = minIdx + 1;
    } else {
      break;
    }
    break;
  }
  return allCycles;
};

/**
 * Detects all cycles in a graph.
 * @param graph The graph to detect cycles in.
 * @param directed Specifies whether the graph is directed (true) or undirected (false).
 * @param nodeIds Optional array of node IDs to filter cycles by.
 * @param include Specifies whether the filtered cycles should be included (true) or excluded (false).
 * @returns An array of objects representing the detected cycles in the graph.
 */
export const detectAllCycles = (
  graph: Graph,
  directed?: boolean,
  nodeIds?: string[],
  include = true
) => {
  if (directed) return detectAllDirectedCycle(graph, nodeIds, include);
  return detectAllUndirectedCycle(graph, nodeIds, include);
};
