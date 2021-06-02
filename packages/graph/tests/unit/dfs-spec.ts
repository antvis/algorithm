import { depthFirstSearch } from '../../src';

const data = {
  nodes: [
    {
      id: 'A',
    },
    {
      id: 'B',
    },
    {
      id: 'C',
    },
    {
      id: 'D',
    },
    {
      id: 'E',
    },
    {
      id: 'F',
    },
    {
      id: 'G',
    },
  ],
  edges: [
    {
      source: 'A',
      target: 'B',
    },
    {
      source: 'B',
      target: 'C',
    },
    {
      source: 'C',
      target: 'G',
    },
    {
      source: 'A',
      target: 'D',
    },
    {
      source: 'A',
      target: 'E',
    },
    {
      source: 'E',
      target: 'F',
    },
    {
      source: 'F',
      target: 'D',
    },
    {
      source: 'D',
      target: 'G',
    },
  ],
};

describe('depthFirstSearch', () => {
  it('should perform DFS operation on graph', () => {
    const enterNodeCallback = jest.fn();
    const leaveNodeCallback = jest.fn();

    // Traverse graphs without callbacks first to check default ones.
    depthFirstSearch({ graphData: data, startNodeId: 'A' });

    // Traverse graph with enterNode and leaveNode callbacks.
    depthFirstSearch({
      graphData: data,
      startNodeId: 'A',
      originalCallbacks: {
        enter: enterNodeCallback,
        leave: leaveNodeCallback,
      },
    });

    expect(enterNodeCallback).toHaveBeenCalledTimes(data.nodes.length);
    expect(leaveNodeCallback).toHaveBeenCalledTimes(data.nodes.length);

    const enterNodeParamsMap = [
      { currentNode: 'A', previousNode: '' },
      { currentNode: 'B', previousNode: 'A' },
      { currentNode: 'C', previousNode: 'B' },
      { currentNode: 'G', previousNode: 'C' },
      { currentNode: 'D', previousNode: 'A' },
      { currentNode: 'E', previousNode: 'A' },
      { currentNode: 'F', previousNode: 'E' },
    ];

    for (let callIndex = 0; callIndex < data.nodes.length; callIndex += 1) {
      const params = enterNodeCallback.mock.calls[callIndex][0];
      expect(params.current).toEqual(enterNodeParamsMap[callIndex].currentNode);
      expect(params.previous).toEqual(enterNodeParamsMap[callIndex].previousNode);
    }

    const leaveNodeParamsMap = [
      { currentNode: 'G', previousNode: 'C' },
      { currentNode: 'C', previousNode: 'B' },
      { currentNode: 'B', previousNode: 'A' },
      { currentNode: 'D', previousNode: 'A' },
      { currentNode: 'F', previousNode: 'E' },
      { currentNode: 'E', previousNode: 'A' },
      { currentNode: 'A', previousNode: '' },
    ];

    for (let callIndex = 0; callIndex < data.nodes.length; callIndex += 1) {
      const params = leaveNodeCallback.mock.calls[callIndex][0];
      expect(params.current).toEqual(leaveNodeParamsMap[callIndex].currentNode);
      expect(params.previous).toEqual(leaveNodeParamsMap[callIndex].previousNode);
    }
  });

  it('allow users to redefine node visiting logic', () => {
    const enterNodeCallback = jest.fn();
    const leaveNodeCallback = jest.fn();

    depthFirstSearch({
      graphData: data,
      startNodeId: 'A',
      originalCallbacks: {
        enter: enterNodeCallback,
        leave: leaveNodeCallback,
        allowTraversal: ({ current: currentNode, next: nextNode }) => {
          return !(currentNode === 'A' && nextNode === 'B');
        },
      },
    });

    expect(enterNodeCallback).toHaveBeenCalledTimes(7);
    expect(leaveNodeCallback).toHaveBeenCalledTimes(7);

    const enterNodeParamsMap = [
      { currentNode: 'A', previousNode: '' },
      { currentNode: 'D', previousNode: 'A' },
      { currentNode: 'G', previousNode: 'D' },
      { currentNode: 'E', previousNode: 'A' },
      { currentNode: 'F', previousNode: 'E' },
      { currentNode: 'D', previousNode: 'F' },
      { currentNode: 'G', previousNode: 'D' },
    ];

    for (let callIndex = 0; callIndex < data.nodes.length; callIndex += 1) {
      const params = enterNodeCallback.mock.calls[callIndex][0];
      expect(params.current).toEqual(enterNodeParamsMap[callIndex].currentNode);
      expect(params.previous && params.previous).toEqual(
        enterNodeParamsMap[callIndex].previousNode,
      );
    }

    const leaveNodeParamsMap = [
      { currentNode: 'G', previousNode: 'D' },
      { currentNode: 'D', previousNode: 'A' },
      { currentNode: 'G', previousNode: 'D' },
      { currentNode: 'D', previousNode: 'F' },
      { currentNode: 'F', previousNode: 'E' },
      { currentNode: 'E', previousNode: 'A' },
      { currentNode: 'A', previousNode: '' },
    ];

    for (let callIndex = 0; callIndex < data.nodes.length; callIndex += 1) {
      const params = leaveNodeCallback.mock.calls[callIndex][0];
      expect(params.current).toEqual(leaveNodeParamsMap[callIndex].currentNode);
      expect(params.previous).toEqual(leaveNodeParamsMap[callIndex].previousNode);
    }
  });
});
