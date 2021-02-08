import { getAlgorithm } from './utils';
import { nodes77, nodes202 } from './data/test-data';

const data3 = {
  nodes: [
    {
      id: '0',
      cluster: 'F',
    },
    {
      id: '1',
      cluster: 'F',
    },
    {
      id: '2',
      cluster: 'B',
    },
    {
      id: '3',
      cluster: 'B',
    },
    {
      id: '4',
      cluster: 'B',
    },
    {
      id: '5',
      cluster: 'B',
    },
    {
      id: '6',
      cluster: 'B',
    },
    {
      id: '7',
      cluster: 'B',
    },
    {
      id: '8',
      cluster: 'B',
    },
    {
      id: '9',
      cluster: 'B',
    },
    {
      id: '10',
      cluster: 'B',
    },
    {
      id: '11',
      cluster: 'B',
    },
    {
      id: '12',
      cluster: 'B',
    },
    {
      id: '13',
      cluster: 'B',
    },
    {
      id: '14',
      cluster: 'C',
    },
    {
      id: '15',
      cluster: 'C',
    },
    {
      id: '16',
      cluster: 'B',
    },
    {
      id: '17',
      cluster: 'C',
    },
    {
      id: '18',
      cluster: 'C',
    },
    {
      id: '19',
      cluster: 'B',
    },
  ],
  edges: [
    {
      source: '0',
      target: '1',
      cluster: 'b',
    },
    {
      source: '0',
      target: '2',
      cluster: 'b',
    },
    {
      source: '1',
      target: '3',
      cluster: 'b',
    },
    {
      source: '2',
      target: '4',
      cluster: 'e',
    },
    {
      source: '2',
      target: '5',
      cluster: 'e',
    },
    {
      source: '3',
      target: '6',
      cluster: 'e',
    },
    {
      source: '3',
      target: '7',
      cluster: 'e',
    },
    {
      source: '4',
      target: '2',
      cluster: 'b',
    },
    {
      source: '4',
      target: '9',
      cluster: 'e',
    },
    {
      source: '5',
      target: '10',
      cluster: 'e',
    },
    {
      source: '6',
      target: '11',
      cluster: 'b',
    },
    {
      source: '6',
      target: '12',
      cluster: 'e',
    },
    {
      source: '7',
      target: '13',
      cluster: 'e',
    },
    {
      source: '8',
      target: '14',
      cluster: 'c',
    },
    {
      source: '8',
      target: '15',
      cluster: 'b',
    },
    {
      source: '9',
      target: '16',
      cluster: 'e',
    },
    {
      source: '10',
      target: '16',
      cluster: 'e',
    },
    {
      source: '11',
      target: '17',
      cluster: 'c',
    },
    {
      source: '11',
      target: '18',
      cluster: 'c',
    },
    {
      source: '12',
      target: '19',
      cluster: 'e',
    },
    {
      source: '13',
      target: '19',
      cluster: 'e',
    },
  ],
};

const pattern1 = {
  nodes: [
    {
      id: '0',
      cluster: 'F',
    },
    {
      id: '1',
      cluster: 'F',
    },
    {
      id: '2',
      cluster: 'B',
    },
  ],
  edges: [
    {
      source: '0',
      target: '1',
      cluster: 'b',
    },
    {
      source: '0',
      target: '2',
      cluster: 'b',
    },
  ],
};

describe('(Async) gSpan', () => {
  it('gSpan match pattern 1', async () => {
    const { GADDIAsync } = await getAlgorithm();
    const matchedSubGraphs = await GADDIAsync(
      data3,
      pattern1,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster',
    );
    expect(matchedSubGraphs.length).toBe(2);
    matchedSubGraphs.forEach(graph => {
      expect(graph.nodes[0].cluster).toBe('F');
      expect(graph.nodes[1].cluster).toBe('F');
      expect(graph.nodes[2].cluster).toBe('B');
      expect(graph.edges[0].cluster).toBe('b');
      expect(graph.edges[1].cluster).toBe('b');
    });
  });
});

describe('(Async) Performance: gSpan 77 nodes G', () => {
  it('pattern 10 nodes', async () => {
    const patternWith10Nodes = {
      nodes: [
        { id: 'pn1', cluster: 'B' },
        { id: 'pn2', cluster: 'B' },
        { id: 'pn3', cluster: 'B' },
        { id: 'pn4', cluster: 'C' },
        { id: 'pn5', cluster: 'B' },
        { id: 'pn6', cluster: 'A' },
        { id: 'pn7', cluster: 'B' },
        { id: 'pn8', cluster: 'B' },
        { id: 'pn9', cluster: 'A' },
        { id: 'pn10', cluster: 'B' },
      ],
      edges: [
        { source: 'pn1', target: 'pn2', cluster: 'b' },
        { source: 'pn1', target: 'pn3', cluster: 'b' },
        { source: 'pn1', target: 'pn4', cluster: 'b' },
        { source: 'pn1', target: 'pn5', cluster: 'b' },
        { source: 'pn1', target: 'pn6', cluster: 'b' },
        { source: 'pn1', target: 'pn7', cluster: 'b' },
        { source: 'pn1', target: 'pn8', cluster: 'b' },

        { source: 'pn2', target: 'pn3', cluster: 'b' },
        { source: 'pn2', target: 'pn4', cluster: 'b' },
        { source: 'pn2', target: 'pn5', cluster: 'b' },
        { source: 'pn2', target: 'pn6', cluster: 'b' },
        { source: 'pn2', target: 'pn7', cluster: 'b' },
        { source: 'pn2', target: 'pn8', cluster: 'b' },

        { source: 'pn3', target: 'pn4', cluster: 'b' },
        { source: 'pn3', target: 'pn5', cluster: 'b' },
        { source: 'pn3', target: 'pn6', cluster: 'b' },
        { source: 'pn3', target: 'pn7', cluster: 'b' },
        { source: 'pn3', target: 'pn8', cluster: 'b' },

        { source: 'pn4', target: 'pn5', cluster: 'b' },
        { source: 'pn4', target: 'pn6', cluster: 'b' },
        { source: 'pn4', target: 'pn7', cluster: 'b' },
        { source: 'pn4', target: 'pn8', cluster: 'b' },

        { source: 'pn5', target: 'pn6', cluster: 'b' },
        { source: 'pn5', target: 'pn7', cluster: 'b' },
        { source: 'pn5', target: 'pn8', cluster: 'b' },

        { source: 'pn6', target: 'pn7', cluster: 'b' },
        { source: 'pn6', target: 'pn8', cluster: 'b' },

        { source: 'pn7', target: 'pn8', cluster: 'b' },

        { source: 'pn8', target: 'pn9', cluster: 'a' },
        { source: 'pn8', target: 'pn10', cluster: 'a' },
      ],
    };
    const begin = performance.now();
    const { GADDIAsync } = await getAlgorithm();
    const result = await GADDIAsync(
      nodes77,
      patternWith10Nodes,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster',
    );
    console.log(
      '77 nodes graph matching 10 nodes pattern',
      performance.now() - begin,
      result.length,
    );
    result.forEach(re => {
      console.log(JSON.stringify(re));
    });
    expect(result.length).toBe(3);

    expect(result[0].nodes[0].id).toBe('16');
    expect(result[1].nodes[0].id).toBe('17');
    expect(result[2].nodes[0].id).toBe('23');
  });
});

describe('(Async) Performance: 202 nodes G', () => {
  it('pattern with 14 nodes, directed', async () => {
    const patternWith14Nodes = {
      nodes: [
        { id: 'pn1', cluster: 'D' },
        { id: 'pn2', cluster: 'C' },
        { id: 'pn3', cluster: 'D' },
        { id: 'pn4', cluster: 'D' },
        { id: 'pn5', cluster: 'C' },
        { id: 'pn6', cluster: 'B' },
        { id: 'pn7', cluster: 'E' },
        { id: 'pn8', cluster: 'C' },
        { id: 'pn9', cluster: 'C' },
        { id: 'pn10', cluster: 'B' },
        { id: 'pn11', cluster: 'B' },
        { id: 'pn12', cluster: 'A' },
        { id: 'pn13', cluster: 'E' },
        { id: 'pn14', cluster: 'B' },
      ],
      edges: [
        { source: 'pn2', target: 'pn1', cluster: 'c' },
        { source: 'pn3', target: 'pn1', cluster: 'a' },
        { source: 'pn4', target: 'pn1', cluster: 'c' },
        { source: 'pn1', target: 'pn5', cluster: 'c' },
        { source: 'pn6', target: 'pn1', cluster: 'c' },
        { source: 'pn7', target: 'pn1', cluster: 'c' },
        { source: 'pn8', target: 'pn1', cluster: 'c' },
        { source: 'pn1', target: 'pn9', cluster: 'a' },
        { source: 'pn10', target: 'pn1', cluster: 'c' },
        { source: 'pn11', target: 'pn1', cluster: 'a' },
        { source: 'pn1', target: 'pn12', cluster: 'c' },
        { source: 'pn1', target: 'pn13', cluster: 'c' },
        { source: 'pn14', target: 'pn13', cluster: 'c' },
      ],
    };
    const begin = performance.now();
    const { GADDIAsync } = await getAlgorithm();
    const result = await GADDIAsync(
      nodes202,
      patternWith14Nodes,
      true,
      undefined,
      undefined,
      'cluster',
      'cluster',
    );

    console.log(
      '202 nodes graph matching 14 nodes pattern, directed',
      performance.now() - begin,
      result.length,
    );
    result.forEach(re => {
      console.log(JSON.stringify(re));
    });
    expect(result.length).toBe(1);
    expect(result[0].nodes[0].id).toBe('49');
  });
});
