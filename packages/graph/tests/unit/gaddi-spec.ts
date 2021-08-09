import GADDI from '../../src/gaddi';
import { nodes77, nodes202, nodes1589, nodes20 } from './data/test-data';

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

const pattern2 = {
  nodes: [
    {
      id: '11',
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
  ],
  edges: [
    {
      source: '11',
      target: '17',
      cluster: 'c',
    },
    {
      source: '11',
      target: '18',
      cluster: 'b',
    },
  ],
};

const circlePattern = {
  nodes: [
    { id: '1', cluster: 'B' },
    { id: '2', cluster: 'B' },
    { id: '3', cluster: 'B' },
    { id: '4', cluster: 'B' },
    { id: '5', cluster: 'B' },
    { id: '6', cluster: 'B' },
  ],
  edges: [
    { source: '1', target: '2', cluster: 'e' },
    { source: '2', target: '3', cluster: 'e' },
    { source: '3', target: '4', cluster: 'e' },
    { source: '4', target: '5', cluster: 'e' },
    { source: '5', target: '6', cluster: 'e' },
    { source: '6', target: '1', cluster: 'e' },
  ],
};

describe('gSpan', () => {
  it('gSpan match pattern 1', () => {
    const matchedSubGraphs = GADDI(
      data3,
      pattern1,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster',
    );
    console.log('test1', matchedSubGraphs);
    expect(matchedSubGraphs.length).toBe(2);
    matchedSubGraphs.forEach(graph => {
      expect(graph.nodes[0].cluster).toBe('F');
      expect(graph.nodes[1].cluster).toBe('F');
      expect(graph.nodes[2].cluster).toBe('B');
      expect(graph.edges[0].cluster).toBe('b');
      expect(graph.edges[1].cluster).toBe('b');
    });
  });
  it('gSpan match pattern 2', () => {
    const matchedSubGraphs = GADDI(data3, pattern2, false, 2, 1, 'cluster', 'cluster');
    console.log('test2', matchedSubGraphs);
    expect(matchedSubGraphs.length).toBe(1);
    // expect(matchedSubGraphs.nodes)
  });
  it('gSpan match circular', () => {
    const matchedSubGraphs = GADDI(
      data3,
      circlePattern,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster',
    );
    expect(matchedSubGraphs.length).toBe(2);
    matchedSubGraphs.forEach(graph => {
      graph.nodes.forEach(node => {
        expect(node.cluster).toBe('B');
      });
      graph.edges.forEach(edge => {
        expect(edge.cluster).toBe('e');
      });
    });
  });
  it('gSpan match circular2 with a parallel edge', () => {
    const circlePattern2 = {
      nodes: [
        { id: '1', cluster: 'B' },
        { id: '2', cluster: 'B' },
        { id: '3', cluster: 'B' },
        { id: '4', cluster: 'B' },
        { id: '5', cluster: 'B' },
        { id: '6', cluster: 'B' },
      ],
      edges: [
        { source: '1', target: '2', cluster: 'e' },
        { source: '2', target: '3', cluster: 'e' },
        { source: '3', target: '4', cluster: 'e' },
        { source: '4', target: '5', cluster: 'e' }, // 平行边
        { source: '4', target: '5', cluster: 'b' }, // 平行边
        { source: '5', target: '6', cluster: 'e' },
        { source: '6', target: '1', cluster: 'e' },
      ],
    };
    const matchedSubGraphs = GADDI(
      data3,
      circlePattern2,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster',
    );
    console.log('circle 2', matchedSubGraphs);
    expect(matchedSubGraphs.length).toBe(1);

    matchedSubGraphs[0].nodes.forEach(node => {
      expect(node.cluster).toBe('B');
    });
    matchedSubGraphs[0].edges.forEach((edge, i) => {
      if (i === 2) {
        expect(edge.cluster).toBe('b');
        return;
      }
      expect(edge.cluster).toBe('e');
    });
  });
  // 平行边可能被匹配成多条单独边
  it('gSpan match two parallel edges', () => {
    const pattern3 = {
      nodes: [
        { id: 'node1', cluster: 'B' },
        { id: 'node2', cluster: 'B' },
      ],
      edges: [
        { source: 'node1', target: 'node2', cluster: 'b' },
        { source: 'node1', target: 'node2', cluster: 'e' },
      ],
    };
    const matchedSubGraphs = GADDI(
      data3,
      pattern3,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster',
    );
    console.log('test3', matchedSubGraphs);
    // expect(matchedSubGraphs.length).toBe(2);
    // matchedSubGraphs.forEach((graph) => {
    //   expect(graph.nodes[0].cluster).toBe("F");
    //   expect(graph.nodes[1].cluster).toBe("F");
    //   expect(graph.nodes[2].cluster).toBe("B");
    //   expect(graph.edges[0].cluster).toBe("b");
    //   expect(graph.edges[1].cluster).toBe("b");
    // });
  });
});

describe('gSpan directed', () => {
  it('gSpan match pattern 1', () => {
    const pattern11 = {
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
    const matchedSubGraphs = GADDI(
      data3,
      pattern11,
      true,
      undefined,
      undefined,
      'cluster',
      'cluster',
    );
    expect(matchedSubGraphs.length).toBe(1);
    expect(matchedSubGraphs[0].nodes[0].id).toBe('0');
    expect(matchedSubGraphs[0].nodes[1].id).toBe('1');
    expect(matchedSubGraphs[0].nodes[2].id).toBe('2');
  });
});

describe('GADDI switch nodes', () => {
  it('gSpan match pattern 1', () => {
    const pattern1 = {
      nodes: [
        { id: 'Person', dataType: 'Person' },
        { id: 'Enterprise', dataType: 'Enterprise' },
      ],
      edges: [
        {
          id: 'edge-1613700998017',
          source: 'Person',
          target: 'Enterprise',
          dataType: 'Person2Enterprise#Guarantee',
          rules: [],
        },
      ],
    };
    const res1 = GADDI(nodes20, pattern1, true, undefined, undefined, 'dataType', 'dataType');
    expect(res1.length).toBe(5);
    const pattern2 = {
      nodes: [
        { id: 'Enterprise', dataType: 'Enterprise' },
        { id: 'Person', dataType: 'Person' },
      ],
      edges: [
        {
          id: 'edge-1613700998017',
          source: 'Person',
          target: 'Enterprise',
          dataType: 'Person2Enterprise#Guarantee',
          rules: [],
        },
      ],
    };
    const res2 = GADDI(nodes20, pattern2, true, undefined, undefined, 'dataType', 'dataType');
    expect(res2.length).toBe(6);
  });
});

describe('Performance: gSpan 77 nodes G', () => {
  // 100ms
  it('pattern 3 nodes', () => {
    const patternWith3Nodes = {
      nodes: [
        { id: 'pn1', cluster: 'A' },
        { id: 'pn2', cluster: 'B' },
        { id: 'pn3', cluster: 'A' },
      ],
      edges: [
        { source: 'pn1', target: 'pn2', cluster: 'b' },
        { source: 'pn1', target: 'pn3', cluster: 'a' },
      ],
    };
    const begin = performance.now();
    const result = GADDI(
      nodes77,
      patternWith3Nodes,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster',
    );
    console.log('77 nodes graph matching 3 nodes pattern', performance.now() - begin);
    result.forEach(re => {
      console.log(JSON.stringify(re));
    });

    expect(result.length).toBe(5);
    expect(result[0].nodes[0].id).toBe('33');
    expect(result[1].nodes[0].id).toBe('43');
    expect(result[2].nodes[0].id).toBe('55');
    expect(result[3].nodes[0].id).toBe('57');
    expect(result[4].nodes[0].id).toBe('65');

    expect(result[3].nodes.length).toBe(4);
    expect(result[4].nodes.length).toBe(5);
  });
  // 100ms
  it('pattern 5 nodes', () => {
    const patternWith5Nodes = {
      nodes: [
        { id: 'pn1', cluster: 'A' },
        { id: 'pn2', cluster: 'C' },
        { id: 'pn3', cluster: 'C' },
        { id: 'pn4', cluster: 'B' },
      ],
      edges: [
        { source: 'pn1', target: 'pn2', cluster: 'c' },
        { source: 'pn1', target: 'pn3', cluster: 'c' },
        { source: 'pn3', target: 'pn2', cluster: 'c' },
        { source: 'pn3', target: 'pn4', cluster: 'b' },
        { source: 'pn2', target: 'pn4', cluster: 'b' },
        { source: 'pn1', target: 'pn4', cluster: 'c' },
      ],
    };
    const begin = performance.now();
    const result = GADDI(
      nodes77,
      patternWith5Nodes,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster',
    );
    console.log('77 nodes graph matching 5 nodes pattern', performance.now() - begin);
    result.forEach(re => {
      console.log(JSON.stringify(re));
    });
    expect(result.length).toBe(2);
    expect(result[0].nodes[0].id).toBe('0');
    expect(result[1].nodes[0].id).toBe('55');

    expect(result[0].nodes.length).toBe(4);
    expect(result[1].nodes.length).toBe(5);
  });
  it('pattern 10 nodes', () => {
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
    const result = GADDI(
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

describe('Performance: 202 nodes G', () => {
  it('pattern with 4 nodes', () => {
    const patternWith4Nodes = {
      nodes: [
        { id: 'pn1', cluster: 'E' },
        { id: 'pn2', cluster: 'D' },
        { id: 'pn3', cluster: 'B' },
        { id: 'pn4', cluster: 'B' },
      ],
      edges: [
        { source: 'pn1', target: 'pn2', cluster: 'c' },
        { source: 'pn2', target: 'pn3', cluster: 'a' },
        { source: 'pn3', target: 'pn4', cluster: 'a' },
        { source: 'pn1', target: 'pn4', cluster: 'c' },
      ],
    };
    const begin = performance.now();
    const result = GADDI(
      nodes202,
      patternWith4Nodes,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster',
    );
    console.log('202 nodes graph matching 4 nodes pattern', performance.now() - begin);
    result.forEach(re => {
      console.log(JSON.stringify(re));
    });
    expect(result.length).toBe(1);
    expect(result[0].nodes[0].id).toBe('100');
    expect(result[0].nodes.length).toBe(4);
  });
  it('pattern with 7 nodes', () => {
    const patternWith7Nodes = {
      nodes: [
        { id: 'pn1', cluster: 'B' },
        { id: 'pn2', cluster: 'C' },
        { id: 'pn3', cluster: 'C' },
        { id: 'pn4', cluster: 'D' },
        { id: 'pn5', cluster: 'E' },
        { id: 'pn6', cluster: 'C' },
        { id: 'pn7', cluster: 'B' },
      ],
      edges: [
        { source: 'pn1', target: 'pn2', cluster: 'c' },
        { source: 'pn2', target: 'pn3', cluster: 'c' },
        { source: 'pn3', target: 'pn4', cluster: 'a' },
        { source: 'pn4', target: 'pn5', cluster: 'c' },
        { source: 'pn5', target: 'pn1', cluster: 'c' },
        { source: 'pn4', target: 'pn6', cluster: 'a' },
        { source: 'pn4', target: 'pn7', cluster: 'a' },
        { source: 'pn6', target: 'pn7', cluster: 'c' },
      ],
    };
    const begin = performance.now();
    const result = GADDI(
      nodes202,
      patternWith7Nodes,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster',
    );
    console.log('202 nodes graph matching 7 nodes pattern', performance.now() - begin);
    result.forEach(re => {
      console.log(JSON.stringify(re));
    });
    expect(result.length).toBe(6);
    expect(result[0].nodes[0].id).toBe('2');
    expect(result[1].nodes[0].id).toBe('77');
    expect(result[2].nodes[0].id).toBe('87');
    expect(result[3].nodes[0].id).toBe('132');
    expect(result[4].nodes[0].id).toBe('157');
    expect(result[5].nodes[0].id).toBe('167');
  });
  it('pattern with 7 nodes, directed', () => {
    const patternWith7Nodes = {
      nodes: [
        { id: 'pn1', cluster: 'B' },
        { id: 'pn2', cluster: 'C' },
        { id: 'pn3', cluster: 'C' },
        { id: 'pn4', cluster: 'D' },
        { id: 'pn5', cluster: 'E' },
        { id: 'pn6', cluster: 'C' },
        { id: 'pn7', cluster: 'B' },
      ],
      edges: [
        { source: 'pn1', target: 'pn2', cluster: 'c' },
        { source: 'pn1', target: 'pn5', cluster: 'c' },
        { source: 'pn3', target: 'pn2', cluster: 'c' },
        { source: 'pn4', target: 'pn3', cluster: 'a' },
        { source: 'pn5', target: 'pn4', cluster: 'c' },
        { source: 'pn4', target: 'pn6', cluster: 'a' },
        { source: 'pn4', target: 'pn7', cluster: 'a' },
        { source: 'pn7', target: 'pn6', cluster: 'c' },
      ],
    };
    const begin = performance.now();
    const result = GADDI(
      nodes202,
      patternWith7Nodes,
      true,
      undefined,
      undefined,
      'cluster',
      'cluster',
    );
    console.log('202 nodes graph matching 7 nodes pattern, directed', performance.now() - begin);
    result.forEach(re => {
      console.log(JSON.stringify(re));
    });
    expect(result.length).toBe(1);
    expect(result[0].nodes[0].id).toBe('167');
    expect(result[0].nodes.length).toBe(7);
  });
  it('pattern with 14 nodes, directed', () => {
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
    const result = GADDI(
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
    // expect(result.length).toBe(8);
    // expect(result[7].nodes[0].id).toBe("100");
  });
});
describe('Performance: 1589 nodes G', () => {
  it('pattern with 4 nodes', () => {
    const patternWith4Nodes = {
      nodes: [
        { id: 'pn1', cluster: 'A' },
        { id: 'pn2', cluster: 'B' },
        { id: 'pn3', cluster: 'C' },
        { id: 'pn4', cluster: 'A' },
      ],
      edges: [
        { source: 'pn1', target: 'pn2', cluster: 'B' },
        { source: 'pn1', target: 'pn3', cluster: 'C' },
        { source: 'pn2', target: 'pn3', cluster: 'A' },
        { source: 'pn3', target: 'pn4', cluster: 'C' },
      ],
    };
    const begin = performance.now();
    const result = GADDI(
      nodes1589,
      patternWith4Nodes,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster',
    );
    console.log(
      '1589 nodes graph matching 4 nodes pattern',
      performance.now() - begin,
      result.length,
    );
    result.forEach(re => {
      console.log(JSON.stringify(re));
    });

    expect(result.length).toBe(163);
  });
  // TODO: 爆栈
  xit('pattern with 6 nodes full-connected', () => {
    const patternWith6Nodes = {
      nodes: [
        { id: 'pn1', cluster: 'B' },
        { id: 'pn2', cluster: 'C' },
        { id: 'pn3', cluster: 'A' },
        { id: 'pn4', cluster: 'C' },
        { id: 'pn4', cluster: 'B' },
        { id: 'pn4', cluster: 'A' },
      ],
      edges: [
        { source: 'pn1', target: 'pn2', cluster: 'A' },
        { source: 'pn1', target: 'pn3', cluster: 'B' },
        { source: 'pn1', target: 'pn4', cluster: 'A' },
        { source: 'pn1', target: 'pn5', cluster: 'C' },
        { source: 'pn1', target: 'pn6', cluster: 'B' },

        { source: 'pn2', target: 'pn3', cluster: 'C' },
        { source: 'pn2', target: 'pn4', cluster: 'B' },
        { source: 'pn2', target: 'pn5', cluster: 'A' },
        { source: 'pn2', target: 'pn6', cluster: 'C' },

        { source: 'pn3', target: 'pn3', cluster: 'C' },
        { source: 'pn3', target: 'pn5', cluster: 'B' },
        { source: 'pn3', target: 'pn6', cluster: 'A' },

        { source: 'pn4', target: 'pn5', cluster: 'A' },
        { source: 'pn4', target: 'pn6', cluster: 'C' },

        { source: 'pn5', target: 'pn6', cluster: 'B' },
      ],
    };
    const begin = performance.now();
    const result = GADDI(
      nodes1589,
      patternWith6Nodes,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster',
    );
    console.log(
      '1589 nodes graph matching 6 nodes full-connected pattern',
      performance.now() - begin,
      result.length,
    );
    result.forEach(re => {
      console.log(JSON.stringify(re));
    });
  });
});

describe('Prune', () => {
  it('Prune', () => {
    const dataPrune = {
      "nodes":[
        {
          "id":"0",
          "cluster":"B"
        },
        {
          "id":"1",
          "cluster":"B"
        },
        {
          "id":"2",
          "cluster":"B"
        },
        {
          "id":"3",
          "cluster":"C"
        },
      ],
      "edges":[
        {
          "source":"0",
          "target":"1",
          "cluster":"b"
        },
        {
          "source":"1",
          "target":"2",
          "cluster":"b"
        },
        {
          "source":"1",
          "target":"3",
          "cluster":"b"
        },
      ]
    }
    
    const dataPrune2 = {
      "nodes":[
        {
          "id":"0",
          "cluster":"B"
        },
        {
          "id":"1",
          "cluster":"B"
        },
        {
          "id":"2",
          "cluster":"B"
        },
        {
          "id":"3",
          "cluster":"B"
        },
        {
          "id":"4",
          "cluster":"B"
        },
        {
          "id":"5",
          "cluster":"B"
        },
        {
          "id":"6",
          "cluster":"B"
        },
        {
          "id":"7",
          "cluster":"B"
        },
        {
          "id":"8",
          "cluster":"B"
        },
        {
          "id":"9",
          "cluster":"B"
        },
        {
          "id":"10",
          "cluster":"B"
        },
        {
          "id":"11",
          "cluster":"C"
        },
      ],
      "edges":[
        {
          "source":"0",
          "target":"6",
          "cluster":"b"
        },
        {
          "source":"1",
          "target":"6",
          "cluster":"b"
        },
        {
          "source":"2",
          "target":"6",
          "cluster":"b"
        },
        {
          "source":"3",
          "target":"6",
          "cluster":"b"
        },
        {
          "source":"4",
          "target":"6",
          "cluster":"b"
        },
        {
          "source":"5",
          "target":"6",
          "cluster":"b"
        },
        {
          "source":"6",
          "target":"7",
          "cluster":"b"
        },
        {
          "source":"6",
          "target":"8",
          "cluster":"b"
        },
        {
          "source":"6",
          "target":"9",
          "cluster":"b"
        },
        {
          "source":"6",
          "target":"10",
          "cluster":"b"
        },
        {
          "source":"6",
          "target":"11",
          "cluster":"b"
        },
      ]
    }
    const p = {
      nodes: [
        {
          id: '0',
          cluster: 'B',
        },
        {
          id: '1',
          cluster: 'B',
        },
        {
          id: '2',
          cluster: 'B',
        },
        {
          id: '3',
          cluster: 'C',
        },
      ],
      edges: [
        {
          source: '0',
          target: '1',
          cluster: 'b',
        },
        {
          source: '2',
          target: '1',
          cluster: 'b',
        },
        {
          source: '1',
          target: '3',
          cluster: 'b',
        },
      ],
    };

    const result = GADDI(
      dataPrune2,
      p,
      true,
      undefined,
      undefined,
      'cluster',
      'cluster',
    );

    // console.log('res', result);
    // // console.log(JSON.stringify(data3));

    // result.forEach(re => {
    //   console.log(JSON.stringify(re));
    // });
    expect(result.length).toBe(1);
  })
})
