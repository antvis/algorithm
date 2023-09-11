import breadthFirstSearch from "../../packages/graph/src/bfs";
import { Graph } from "@antv/graphlib";

const data = {
  nodes: [
    {
      id: 'A',
      data: {}
    },
    {
      id: 'B',
      data: {}
    },
    {
      id: 'C',
      data: {}
    },
    {
      id: 'D',
      data: {}
    },
    {
      id: 'E',
      data: {}
    },
    {
      id: 'F',
      data: {}
    },
    {
      id: 'G',
      data: {}
    },
  ],
  edges: [
    {
      id: 'e1',
      source: 'A',
      target: 'B',
      data: {}
    },
    {
      id: 'e2',
      source: 'B',
      target: 'C',
      data: {}
    },
    {
      id: 'e3',
      source: 'C',
      target: 'G',
      data: {}
    },
    {
      id: 'e4',
      source: 'A',
      target: 'D',
      data: {}
    },
    {
      id: 'e5',
      source: 'A',
      target: 'E',
      data: {}
    },
    {
      id: 'e6',
      source: 'E',
      target: 'F',
      data: {}
    },
    {
      id: 'e7',
      source: 'F',
      target: 'D',
      data: {}
    },
    {
      id: 'e8',
      source: 'D',
      target: 'E',
      data: {}
    },
  ],
};
const graph = new Graph<any, any>(data);

describe('breadthFirstSearch', () => {
  it('should perform BFS operation on graph', () => {
    const enterNodeCallback = jest.fn();
    const leaveNodeCallback = jest.fn();

    // Traverse graphs without callbacks first.
    breadthFirstSearch(graph, 'A');

    // Traverse graph with enterNode and leaveNode callbacks.
    breadthFirstSearch(graph, 'A', {
      enter: enterNodeCallback,
      leave: leaveNodeCallback,
    });
    expect(enterNodeCallback).toHaveBeenCalledTimes(graph.getAllNodes().length);
    expect(leaveNodeCallback).toHaveBeenCalledTimes(graph.getAllNodes().length);

    const nodeA = 'A';
    const nodeB = 'B';
    const nodeC = 'C';
    const nodeD = 'D';
    const nodeE = 'E';
    const nodeF = 'F';
    const nodeG = 'G';

    const enterNodeParamsMap = [
      { currentNode: nodeA, previousNode: '' },
      { currentNode: nodeB, previousNode: nodeA },
      { currentNode: nodeD, previousNode: nodeB },
      { currentNode: nodeE, previousNode: nodeD },
      { currentNode: nodeC, previousNode: nodeE },
      { currentNode: nodeF, previousNode: nodeC },
      { currentNode: nodeG, previousNode: nodeF },
    ];

    for (let callIndex = 0; callIndex < 6; callIndex += 1) {
      const params = enterNodeCallback.mock.calls[callIndex][0];
      expect(params.current).toEqual(enterNodeParamsMap[callIndex].currentNode);
      expect(params.previous).toEqual(
        enterNodeParamsMap[callIndex].previousNode &&
        enterNodeParamsMap[callIndex].previousNode,
      );
    }

    const leaveNodeParamsMap = [
      { currentNode: nodeA, previousNode: '' },
      { currentNode: nodeB, previousNode: nodeA },
      { currentNode: nodeD, previousNode: nodeB },
      { currentNode: nodeE, previousNode: nodeD },
      { currentNode: nodeC, previousNode: nodeE },
      { currentNode: nodeF, previousNode: nodeC },
      { currentNode: nodeG, previousNode: nodeF },
    ];

    for (let callIndex = 0; callIndex < 6; callIndex += 1) {
      const params = leaveNodeCallback.mock.calls[callIndex][0];
      expect(params.current).toEqual(leaveNodeParamsMap[callIndex].currentNode);
      expect(params.previous).toEqual(
        leaveNodeParamsMap[callIndex].previousNode &&
        leaveNodeParamsMap[callIndex].previousNode,
      );
    }
  });

  it('should allow to create custom node visiting logic', () => {

    const enterNodeCallback = jest.fn();
    const leaveNodeCallback = jest.fn();

    // Traverse graph with enterNode and leaveNode callbacks.
    breadthFirstSearch(graph, 'A', {
      enter: enterNodeCallback,
      leave: leaveNodeCallback,
      allowTraversal: ({ current, next }) => {
        return !(current === 'A' && next === 'B');
      },
    });

    expect(enterNodeCallback).toHaveBeenCalledTimes(4);
    expect(leaveNodeCallback).toHaveBeenCalledTimes(4);

    const enterNodeParamsMap = [
      { currentNode: 'A', previousNode: '' },
      { currentNode: 'D', previousNode: 'A' },
      { currentNode: 'E', previousNode: 'D' },
      { currentNode: 'F', previousNode: 'E' },
      { currentNode: 'D', previousNode: 'F' },
    ];

    for (let callIndex = 0; callIndex < 4; callIndex += 1) {
      const params = enterNodeCallback.mock.calls[callIndex][0];
      expect(params.current).toEqual(enterNodeParamsMap[callIndex].currentNode);
      expect(params.previous).toEqual(
        enterNodeParamsMap[callIndex].previousNode,
      );
    }

    const leaveNodeParamsMap = [
      { currentNode: 'A', previousNode: '' },
      { currentNode: 'D', previousNode: 'A' },
      { currentNode: 'E', previousNode: 'D' },
      { currentNode: 'F', previousNode: 'E' },
      { currentNode: 'D', previousNode: 'F' },
    ];

    for (let callIndex = 0; callIndex < 4; callIndex += 1) {
      const params = leaveNodeCallback.mock.calls[callIndex][0];
      expect(params.current).toEqual(leaveNodeParamsMap[callIndex].currentNode);
      expect(params.previous).toEqual(
        leaveNodeParamsMap[callIndex].previousNode,
      );
    }
  });
});
