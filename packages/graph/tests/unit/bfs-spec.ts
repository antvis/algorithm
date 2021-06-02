import { breadthFirstSearch } from '../../src';

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
    {
      id: 'H',
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
  ],
};

describe('breadthFirstSearch', () => {
  it('should perform BFS operation on graph', () => {
    const enterNodeCallback = jest.fn();
    const leaveNodeCallback = jest.fn();

    // Traverse graphs without callbacks first.
    breadthFirstSearch({ graphData: data, startNodeId: 'A' });

    // Traverse graph with enterNode and leaveNode callbacks.
    breadthFirstSearch({
      graphData: data,
      startNodeId: 'A',
      originalCallbacks: {
        enter: enterNodeCallback,
        leave: leaveNodeCallback,
      },
    });

    expect(enterNodeCallback).toHaveBeenCalledTimes(7);
    expect(leaveNodeCallback).toHaveBeenCalledTimes(7);

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
        enterNodeParamsMap[callIndex].previousNode && enterNodeParamsMap[callIndex].previousNode,
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
        leaveNodeParamsMap[callIndex].previousNode && leaveNodeParamsMap[callIndex].previousNode,
      );
    }
  });

  it('should allow to create custom node visiting logic', () => {
    const enterNodeCallback = jest.fn();
    const leaveNodeCallback = jest.fn();

    // Traverse graph with enterNode and leaveNode callbacks.
    breadthFirstSearch({
      graphData: data,
      startNodeId: 'A',
      originalCallbacks: {
        enter: enterNodeCallback,
        leave: leaveNodeCallback,
        allowTraversal: ({ current, next }) => {
          return !(current === 'A' && next === 'B');
        },
      },
    });

    expect(enterNodeCallback).toHaveBeenCalledTimes(5);
    expect(leaveNodeCallback).toHaveBeenCalledTimes(5);

    const enterNodeParamsMap = [
      { currentNode: 'A', previousNode: '' },
      { currentNode: 'D', previousNode: 'A' },
      { currentNode: 'E', previousNode: 'D' },
      { currentNode: 'F', previousNode: 'E' },
      { currentNode: 'D', previousNode: 'F' },
    ];

    for (let callIndex = 0; callIndex < 5; callIndex += 1) {
      const params = enterNodeCallback.mock.calls[callIndex][0];
      expect(params.current).toEqual(enterNodeParamsMap[callIndex].currentNode);
      expect(params.previous).toEqual(enterNodeParamsMap[callIndex].previousNode);
    }

    const leaveNodeParamsMap = [
      { currentNode: 'A', previousNode: '' },
      { currentNode: 'D', previousNode: 'A' },
      { currentNode: 'E', previousNode: 'D' },
      { currentNode: 'F', previousNode: 'E' },
      { currentNode: 'D', previousNode: 'F' },
    ];

    for (let callIndex = 0; callIndex < 5; callIndex += 1) {
      const params = leaveNodeCallback.mock.calls[callIndex][0];
      expect(params.current).toEqual(leaveNodeParamsMap[callIndex].currentNode);
      expect(params.previous).toEqual(leaveNodeParamsMap[callIndex].previousNode);
    }
  });
});
