import { findShortestPathAsync, findAllPathAsync } from '../../src';

const data = {
  nodes: [
    {
      id: 'A',
      label: 'A',
    },
    {
      id: 'B',
      label: 'B',
    },
    {
      id: 'C',
      label: 'C',
    },
    {
      id: 'D',
      label: 'D',
    },
    {
      id: 'E',
      label: 'E',
    },
    {
      id: 'F',
      label: 'F',
    },
    {
      id: 'G',
      label: 'G',
    },
    {
      id: 'H',
      label: 'H',
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
      target: 'E',
    },
  ],
};

describe('(Async) Shortest Path from source to target on graph', () => {
  it('find the shortest path', async done => {
    const { length, path } = await findShortestPathAsync({
      graphData: data,
      start: 'A',
      end: 'C',
    });
    expect(length).toBe(2);
    expect(path).toStrictEqual(['A', 'B', 'C']);
    done();
  });

  it('find all shortest paths', async done => {
    const { length, allPath } = await findShortestPathAsync({
      graphData: data,
      start: 'A',
      end: 'F',
    });
    expect(length).toBe(2);
    expect(allPath[0]).toStrictEqual(['A', 'E', 'F']);
    expect(allPath[1]).toStrictEqual(['A', 'D', 'F']);

    const {
      length: directedLenght,
      path: directedPath,
      allPath: directedAllPath,
    } = await findShortestPathAsync({
      graphData: data,
      start: 'A',
      end: 'F',
      directed: true,
    });
    expect(directedLenght).toBe(2);
    expect(directedAllPath[0]).toStrictEqual(['A', 'E', 'F']);
    expect(directedPath).toStrictEqual(['A', 'E', 'F']);
    done();
  });

  it('find all paths', async done => {
    const allPath = await findAllPathAsync({
      graphData: data,
      start: 'A',
      end: 'E',
    });
    expect(allPath.length).toBe(3);
    expect(allPath[0]).toStrictEqual(['A', 'D', 'F', 'E']);
    expect(allPath[1]).toStrictEqual(['A', 'D', 'E']);
    expect(allPath[2]).toStrictEqual(['A', 'E']);
    done();
  });

  it('find all paths in directed graph', async done => {
    const allPath = await findAllPathAsync({
      graphData: data,
      start: 'A',
      end: 'E',
      directed: true,
    });
    expect(allPath.length).toStrictEqual(2);
    expect(allPath[0]).toStrictEqual(['A', 'D', 'E']);
    expect(allPath[1]).toStrictEqual(['A', 'E']);
    done();
  });

  it('find all shortest paths in weighted graph', async done => {
    data.edges.forEach((edge: any, i) => {
      edge.weight = ((i % 2) + 1) * 2;
      if (edge.source === 'F' && edge.target === 'D') edge.weight = 10;
    });
    const { length, path, allPath } = await findShortestPathAsync({
      graphData: data,
      start: 'A',
      end: 'F',
      weightPropertyName: 'weight',
    });
    expect(length).toBe(6);
    expect(allPath[0]).toStrictEqual(['A', 'E', 'F']);
    expect(path).toStrictEqual(['A', 'E', 'F']);
    done();
  });
});
