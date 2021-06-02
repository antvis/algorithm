import Stack from '../../src/structs/stack';

describe('stack unit test', () => {
  it('init stack', () => {
    const stack = new Stack();
    for (let i = 0; i < 4; i++) {
      stack.push({
        nodes: [
          {
            id: `node${i}`,
          },
        ],
      });
    }

    const result = stack.pop();
    // console.log(stack.toArray());
    expect(result).toEqual({
      nodes: [
        {
          id: 'node3',
        },
      ],
    });

    expect(stack.peek()).toEqual({
      nodes: [
        {
          id: 'node2',
        },
      ],
    });

    expect(stack.isMaxStack()).toBe(false);
    expect(stack.isEmpty()).toBe(false);

    stack.push({
      nodes: [
        {
          id: 'node5',
        },
      ],
    });
    stack.push({
      nodes: [
        {
          id: 'node6',
        },
      ],
    });

    expect(stack.isMaxStack()).toBe(false);
    stack.clear();
    expect(stack.length).toBe(0);
  });

  it('init stack with maxStep', () => {
    const stack = new Stack(3);
    for (let i = 0; i < 5; i++) {
      stack.push({
        nodes: [
          {
            id: `node${i}`,
          },
        ],
      });
    }
    expect(stack.length).toBe(3);

    expect(stack.toArray()).toEqual([
      {
        nodes: [{ id: 'node4' }],
      },
      {
        nodes: [{ id: 'node3' }],
      },
      {
        nodes: [{ id: 'node2' }],
      },
    ]);

    stack.clear();
    expect(stack.length).toBe(0);
  });
});
