import { depthFirstSearch } from "../../packages/graph/src";
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
describe('depthFirstSearch', () => {
  it('should perform DFS operation on graph', () => {

    const enterNodeCallback = jest.fn();
    const leaveNodeCallback = jest.fn();

    // Traverse graphs without callbacks first to check default ones.
    depthFirstSearch(graph, 'A');

    // Traverse graph with enterNode and leaveNode callbacks.
    depthFirstSearch(graph, 'A', {
      enter: enterNodeCallback,
      leave: leaveNodeCallback,
    });
    expect(enterNodeCallback).toHaveBeenCalledTimes(graph.getAllNodes().length);
    expect(leaveNodeCallback).toHaveBeenCalledTimes(graph.getAllNodes().length);

    const enterNodeParamsMap = [
      { currentNode: 'A', previousNode: '' },
      { currentNode: 'B', previousNode: 'A' },
      { currentNode: 'C', previousNode: 'B' },
      { currentNode: 'G', previousNode: 'C' },
      { currentNode: 'D', previousNode: 'A' },
      { currentNode: 'F', previousNode: 'D' },
      { currentNode: 'E', previousNode: 'F' },
    ];
    for (let callIndex = 0; callIndex < data.nodes.length; callIndex += 1) {
      const params = enterNodeCallback.mock.calls[callIndex][0];
      expect(params.previous).toEqual(
        enterNodeParamsMap[callIndex].previousNode,
      );
    }

    depthFirstSearch(graph, 'B', {
      enter: enterNodeCallback,
      leave: leaveNodeCallback,
    });
    const leaveNodeParamsMap = [
      { currentNode: 'G', previousNode: 'C' },
      { currentNode: 'C', previousNode: 'B' },
      { currentNode: 'B', previousNode: 'A' },
      { currentNode: 'E', previousNode: 'F' },
      { currentNode: 'F', previousNode: 'D' },
      { currentNode: 'D', previousNode: 'A' },
      { currentNode: 'A', previousNode: '' },
    ];

    for (let callIndex = 0; callIndex < data.nodes.length; callIndex += 1) {
      const params = leaveNodeCallback.mock.calls[callIndex][0];
      expect(params.previous).toEqual(
        leaveNodeParamsMap[callIndex].previousNode,
      );
    }
  });

  it('allow users to redefine node visiting logic', () => {
    const enterNodeCallback = jest.fn();
    const leaveNodeCallback = jest.fn();
    depthFirstSearch(graph, 'A', {
      enter: enterNodeCallback,
      leave: leaveNodeCallback,
      allowTraversal: ({ current: currentNode, next: nextNode }) => {
        return !(currentNode === 'A' && nextNode === 'B');
      },
    });
    expect(enterNodeCallback).toHaveBeenCalledTimes(4);
    expect(leaveNodeCallback).toHaveBeenCalledTimes(4);

    const enterNodeParamsMap = [
      { currentNode: 'A', previousNode: '' },
      { currentNode: 'D', previousNode: 'A' },
      { currentNode: 'F', previousNode: 'D' },
      { currentNode: 'E', previousNode: 'F' },
    ];

    for (let callIndex = 0; callIndex < 4; callIndex += 1) {
      const params = enterNodeCallback.mock.calls[callIndex][0];
      expect(params.previous && params.previous).toEqual(
        enterNodeParamsMap[callIndex].previousNode,
      );
    }
    const leaveNodeParamsMap = [
      { currentNode: 'E', previousNode: 'F' },
      { currentNode: 'F', previousNode: 'D' },
      { currentNode: 'D', previousNode: 'A' },
      { currentNode: 'A', previousNode: '' },
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
