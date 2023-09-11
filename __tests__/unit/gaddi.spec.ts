import { Graph } from '@antv/graphlib';
import { GADDI } from '../../packages/graph/src';
import { nodes77, nodes202, nodes1589, nodes20 } from '../data/gaddi-test-data';

const data3 = {
  nodes: [
    {
      id: '0',
      data: {
        cluster: 'F',
      },
    },
    {
      id: '1',
      data: {
        cluster: 'F',
      },
    },
    {
      id: '2',
      data: {
        cluster: 'B',
      },
    },
    {
      id: '3',
      data: {
        cluster: 'B',
      },
    },
    {
      id: '4',
      data: {
        cluster: 'B',
      },
    },
    {
      id: '5',
      data: {
        cluster: 'B',
      },
    },
    {
      id: '6',
      data: {
        cluster: 'B',
      },
    },
    {
      id: '7',
      data: {
        cluster: 'B',
      },
    },
    {
      id: '8',
      data: {
        cluster: 'B',
      },
    },
    {
      id: '9',
      data: {
        cluster: 'B',
      },
    },
    {
      id: '10',
      data: {
        cluster: 'B',
      },
    },
    {
      id: '11',
      data: {
        cluster: 'B',
      },
    },
    {
      id: '12',
      data: {
        cluster: 'B',
      },
    },
    {
      id: '13',
      data: {
        cluster: 'B',
      },
    },
    {
      id: '14',
      data: {
        cluster: 'C',
      },
    },
    {
      id: '15',
      data: {
        cluster: 'C',
      },
    },
    {
      id: '16',
      data: {
        cluster: 'B',
      },
    },
    {
      id: '17',
      data: {
        cluster: 'C',
      },
    },
    {
      id: '18',
      data: {
        cluster: 'C',
      },
    },
    {
      id: '19',
      data: {
        cluster: 'B',
      },
    },
  ],
  edges: [
    {
      id: 'edge-0.08338243451400973',
      source: '0',
      target: '1',
      data: {
        cluster: 'b',
      },
    },
    {
      id: 'edge-0.9538984876112504',
      source: '0',
      target: '2',
      data: {
        cluster: 'b',
      },
    },
    {
      id: 'edge-0.5610650101657038',
      source: '1',
      target: '3',
      data: {
        cluster: 'b',
      },
    },
    {
      id: 'edge-0.6339807332841931',
      source: '2',
      target: '4',
      data: {
        cluster: 'e',
      },
    },
    {
      id: 'edge-0.9110431395664749',
      source: '2',
      target: '5',
      data: {
        cluster: 'e',
      },
    },
    {
      id: 'edge-0.17120532721066772',
      source: '3',
      target: '6',
      data: {
        cluster: 'e',
      },
    },
    {
      id: 'edge-0.06410930423423311',
      source: '3',
      target: '7',
      data: {
        cluster: 'e',
      },
    },
    {
      id: 'edge-0.7144629421427284',
      source: '4',
      target: '2',
      data: {
        cluster: 'b',
      },
    },
    {
      id: 'edge-0.2697689400551728',
      source: '4',
      target: '9',
      data: {
        cluster: 'e',
      },
    },
    {
      id: 'edge-0.5952356362426905',
      source: '5',
      target: '10',
      data: {
        cluster: 'e',
      },
    },
    {
      id: 'edge-0.02101777124296822',
      source: '6',
      target: '11',
      data: {
        cluster: 'b',
      },
    },
    {
      id: 'edge-0.966142346306492',
      source: '6',
      target: '12',
      data: {
        cluster: 'e',
      },
    },
    {
      id: 'edge-0.5763065078005702',
      source: '7',
      target: '13',
      data: {
        cluster: 'e',
      },
    },
    {
      id: 'edge-0.027081416081647047',
      source: '8',
      target: '14',
      data: {
        cluster: 'c',
      },
    },
    {
      id: 'edge-0.620526080828502',
      source: '8',
      target: '15',
      data: {
        cluster: 'b',
      },
    },
    {
      id: 'edge-0.8846666190325727',
      source: '9',
      target: '16',
      data: {
        cluster: 'e',
      },
    },
    {
      id: 'edge-0.07190256509651016',
      source: '10',
      target: '16',
      data: {
        cluster: 'e',
      },
    },
    {
      id: 'edge-0.1555601171040133',
      source: '11',
      target: '17',
      data: {
        cluster: 'c',
      },
    },
    {
      id: 'edge-0.25060396902963533',
      source: '11',
      target: '18',
      data: {
        cluster: 'c',
      },
    },
    {
      id: 'edge-0.8657381210149271',
      source: '12',
      target: '19',
      data: {
        cluster: 'e',
      },
    },
    {
      id: 'edge-0.14987167523057177',
      source: '13',
      target: '19',
      data: {
        cluster: 'e',
      },
    },
  ],
};

const pattern1 = {
  nodes: [
    {
      id: '0',
      data: {
        cluster: 'F',
      },
    },
    {
      id: '1',
      data: {
        cluster: 'F',
      },
    },
    {
      id: '2',
      data: {
        cluster: 'B',
      },
    },
  ],
  edges: [
    {
      id: 'pedge-1',
      source: '0',
      target: '1',
      data: {
        cluster: 'b',
      },
    },
    {
      id: 'pedge-2',
      source: '0',
      target: '2',
      data: {
        cluster: 'b',
      },
    },
  ],
};

const pattern2 = {
  nodes: [
    {
      id: '11',
      data: {
        cluster: 'B',
      },
    },
    {
      id: '17',
      data: {
        cluster: 'C',
      },
    },
    {
      id: '18',
      data: {
        cluster: 'C',
      },
    },
  ],
  edges: [
    {
      id: 'p2-edge-1',
      source: '11',
      target: '17',
      data: {
        cluster: 'c',
      },
    },
    {
      id: 'p2-edge-2',
      source: '11',
      target: '18',
      data: {
        cluster: 'b',
      },
    },
  ],
};

const circlePattern = {
  nodes: [
    {
      id: '1',
      data: {
        cluster: 'B',
      },
    },
    {
      id: '2',
      data: {
        cluster: 'B',
      },
    },
    {
      id: '3',
      data: {
        cluster: 'B',
      },
    },
    {
      id: '4',
      data: {
        cluster: 'B',
      },
    },
    {
      id: '5',
      data: {
        cluster: 'B',
      },
    },
    {
      id: '6',
      data: {
        cluster: 'B',
      },
    },
  ],
  edges: [
    {
      id: 'edge-0.6743779589170014',
      source: '1',
      target: '2',
      data: {
        cluster: 'e',
      },
    },
    {
      id: 'edge-0.22861083620146805',
      source: '2',
      target: '3',
      data: {
        cluster: 'e',
      },
    },
    {
      id: 'edge-0.28467629792241245',
      source: '3',
      target: '4',
      data: {
        cluster: 'e',
      },
    },
    {
      id: 'edge-0.9617896696169548',
      source: '4',
      target: '5',
      data: {
        cluster: 'e',
      },
    },
    {
      id: 'edge-0.4618290406313039',
      source: '5',
      target: '6',
      data: {
        cluster: 'e',
      },
    },
    {
      id: 'edge-0.10413260508650302',
      source: '6',
      target: '1',
      data: {
        cluster: 'e',
      },
    },
  ],
};

describe('gSpan', () => {
  it('gSpan match pattern 1', () => {
    const graphCore = new Graph(data3);
    const matchedSubGraphs = GADDI(
      graphCore,
      pattern1,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster'
    );
    expect(matchedSubGraphs.length).toBe(2);
    matchedSubGraphs.forEach((graph) => {
      expect(graph.nodes[0].data.cluster).toBe('B');
      expect(graph.nodes[1].data.cluster).toBe('F');
      expect(graph.nodes[2].data.cluster).toBe('F');
      expect(graph.edges[0].data.cluster).toBe('b');
      expect(graph.edges[1].data.cluster).toBe('b');
    });
  });
  it('gSpan match pattern 2', () => {
    const matchedSubGraphs = GADDI(
      new Graph(data3),
      pattern2,
      false,
      2,
      1,
      'cluster',
      'cluster'
    );
    console.log('test2', matchedSubGraphs);
    expect(matchedSubGraphs.length).toBe(1);
    // expect(matchedSubGraphs.nodes)
  });
  it('gSpan match circular', () => {
    const matchedSubGraphs = GADDI(
      new Graph(data3),
      circlePattern,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster'
    );
    expect(matchedSubGraphs.length).toBe(2);
    matchedSubGraphs.forEach((graph) => {
      graph.nodes.forEach((node) => {
        expect(node.data.cluster).toBe('B');
      });
      graph.edges.forEach((edge) => {
        expect(edge.data.cluster).toBe('e');
      });
    });
  });
  it('gSpan match circular2 with a parallel edge', () => {
    const circlePattern2 = {
      nodes: [
        {
          id: '1',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '2',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '3',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '4',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '5',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '6',
          data: {
            cluster: 'B',
          },
        },
      ],
      edges: [
        {
          id: 'edge-0.42477369317166525',
          source: '1',
          target: '2',
          data: {
            cluster: 'e',
          },
        },
        {
          id: 'edge-0.8428047456975589',
          source: '2',
          target: '3',
          data: {
            cluster: 'e',
          },
        },
        {
          id: 'edge-0.9656786081779836',
          source: '3',
          target: '4',
          data: {
            cluster: 'e',
          },
        },
        {
          id: 'edge-0.5334304163594565',
          source: '4',
          target: '5',
          data: {
            cluster: 'e',
          },
        },
        {
          id: 'edge-0.692950106628371',
          source: '4',
          target: '5',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.7740666865191763',
          source: '5',
          target: '6',
          data: {
            cluster: 'e',
          },
        },
        {
          id: 'edge-0.6494155903568832',
          source: '6',
          target: '1',
          data: {
            cluster: 'e',
          },
        },
      ],
    };
    const matchedSubGraphs = GADDI(
      new Graph(data3),
      circlePattern2,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster'
    );
    console.log('circle 2', matchedSubGraphs);
    expect(matchedSubGraphs.length).toBe(1);

    matchedSubGraphs[0].nodes.forEach((node) => {
      expect(node.data.cluster).toBe('B');
    });
    matchedSubGraphs[0].edges.forEach((edge, i) => {
      if (i === 2) {
        expect(edge.data.cluster).toBe('b');
        return;
      }
      expect(edge.data.cluster).toBe('e');
    });
  });
  // 平行边可能被匹配成多条单独边
  it('gSpan match two parallel edges', () => {
    const pattern3 = {
      nodes: [
        { id: 'node1', data: { cluster: 'B' } },
        { id: 'node2', data: { cluster: 'B' } },
      ],
      edges: [
        {
          id: 'p3-edge-1',
          source: 'node1',
          target: 'node2',
          data: { cluster: 'b' },
        },
        {
          id: 'p3-edge-2',
          source: 'node1',
          target: 'node2',
          data: { cluster: 'e' },
        },
      ],
    };
    const matchedSubGraphs = GADDI(
      new Graph(data3),
      pattern3,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster'
    );
    console.log('test3', matchedSubGraphs);
    // expect(matchedSubGraphs.length).toBe(2);
    // matchedSubGraphs.forEach((graph) => {
    //   expect(graph.nodes[0].data.cluster).toBe("F");
    //   expect(graph.nodes[1].data.cluster).toBe("F");
    //   expect(graph.nodes[2].data.cluster).toBe("B");
    //   expect(graph.edges[0].data.cluster).toBe("b");
    //   expect(graph.edges[1].data.cluster).toBe("b");
    // });
  });
});

describe('gSpan directed', () => {
  it('gSpan match pattern 1', () => {
    const pattern11 = {
      nodes: [
        {
          id: '0',
          data: {
            cluster: 'F',
          },
        },
        {
          id: '1',
          data: {
            cluster: 'F',
          },
        },
        {
          id: '2',
          data: {
            cluster: 'B',
          },
        },
      ],
      edges: [
        {
          id: 'edge-0.08192985717375234',
          source: '0',
          target: '1',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.3680626849736408',
          source: '0',
          target: '2',
          data: {
            cluster: 'b',
          },
        },
      ],
    };
    const matchedSubGraphs = GADDI(
      new Graph(data3),
      pattern11,
      true,
      undefined,
      undefined,
      'cluster',
      'cluster'
    );
    expect(matchedSubGraphs.length).toBe(2);
    expect(matchedSubGraphs[0].nodes[0].id).toBe('2');
    expect(matchedSubGraphs[0].nodes[1].id).toBe('0');
    expect(matchedSubGraphs[0].nodes[2].id).toBe('1');
  });
});

describe('GADDI switch nodes', () => {
  it('gSpan match pattern 1', () => {
    const pattern1 = {
      nodes: [
        { id: 'Person', data: { dataType: 'Person' } },
        { id: 'Enterprise', data: { dataType: 'Enterprise' } },
      ],
      edges: [
        {
          id: 'edge-1613700998017',
          source: 'Person',
          target: 'Enterprise',
          data: {
            dataType: 'Person2Enterprise#Guarantee',
            rules: [],
          },
        },
      ],
    };
    const res1 = GADDI(
      new Graph(nodes20),
      pattern1,
      true,
      undefined,
      undefined,
      'dataType',
      'dataType'
    );
    expect(res1.length).toBe(6);
    const pattern2 = {
      nodes: [
        { id: 'Enterprise', data: { dataType: 'Enterprise' } },
        { id: 'Person', data: { dataType: 'Person' } },
      ],
      edges: [
        {
          id: 'edge-1613700998017',
          source: 'Person',
          target: 'Enterprise',
          data: {
            dataType: 'Person2Enterprise#Guarantee',
            rules: [],
          },
        },
      ],
    };
    const res2 = GADDI(
      new Graph(nodes20),
      pattern2,
      true,
      undefined,
      undefined,
      'dataType',
      'dataType'
    );
    expect(res2.length).toBe(6);
  });
});

describe('Performance: gSpan 77 nodes G', () => {
  // 100ms
  it('pattern 3 nodes', () => {
    const patternWith3Nodes = {
      nodes: [
        { id: 'pn1', data: { cluster: 'A' } },
        { id: 'pn2', data: { cluster: 'B' } },
        { id: 'pn3', data: { cluster: 'A' } },
      ],
      edges: [
        {
          id: 'p4-edge-1',
          source: 'pn1',
          target: 'pn2',
          data: { cluster: 'b' },
        },
        {
          id: 'p4-edge-2',
          source: 'pn1',
          target: 'pn3',
          data: { cluster: 'a' },
        },
      ],
    };
    const begin = performance.now();
    const result = GADDI(
      new Graph(nodes77),
      patternWith3Nodes,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster'
    );
    console.log(
      '77 nodes graph matching 3 nodes pattern',
      performance.now() - begin
    );
    result.forEach((re) => {
      console.log(JSON.stringify(re));
    });

    expect(result.length).toBe(5);
    expect(result[0].nodes[0].id).toBe('11');
    expect(result[1].nodes[0].id).toBe('48');
    expect(result[2].nodes[0].id).toBe('60');
    expect(result[3].nodes[0].id).toBe('63');
    expect(result[4].nodes[0].id).toBe('66');

    expect(result[3].nodes.length).toBe(4);
    expect(result[4].nodes.length).toBe(3);
  });
  // 100ms
  it('pattern 5 nodes', () => {
    const patternWith5Nodes = {
      nodes: [
        {
          id: 'pn1',
          data: {
            cluster: 'A',
          },
        },
        {
          id: 'pn2',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'pn3',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'pn4',
          data: {
            cluster: 'B',
          },
        },
      ],
      edges: [
        {
          id: 'edge-0.7443251984519861',
          source: 'pn1',
          target: 'pn2',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.9853001965849568',
          source: 'pn1',
          target: 'pn3',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.4020452668717929',
          source: 'pn3',
          target: 'pn2',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.17850753263738572',
          source: 'pn3',
          target: 'pn4',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.11349992003063503',
          source: 'pn2',
          target: 'pn4',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.9896596436859824',
          source: 'pn1',
          target: 'pn4',
          data: {
            cluster: 'c',
          },
        },
      ],
    };
    const begin = performance.now();
    const result = GADDI(
      new Graph(nodes77),
      patternWith5Nodes,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster'
    );
    console.log(
      '77 nodes graph matching 5 nodes pattern',
      performance.now() - begin
    );
    result.forEach((re) => {
      console.log(JSON.stringify(re));
    });
    expect(result.length).toBe(2);
    expect(result[0].nodes[0].id).toBe('11');
    expect(result[1].nodes[0].id).toBe('26');

    expect(result[0].nodes.length).toBe(7);
    expect(result[1].nodes.length).toBe(4);
  });
  it('pattern 10 nodes', () => {
    const patternWith10Nodes = {
      nodes: [
        {
          id: 'pn1',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'pn2',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'pn3',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'pn4',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'pn5',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'pn6',
          data: {
            cluster: 'A',
          },
        },
        {
          id: 'pn7',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'pn8',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'pn9',
          data: {
            cluster: 'A',
          },
        },
        {
          id: 'pn10',
          data: {
            cluster: 'B',
          },
        },
      ],
      edges: [
        {
          id: 'edge-0.49811811736590594',
          source: 'pn1',
          target: 'pn2',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.3108286621514387',
          source: 'pn1',
          target: 'pn3',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.5362696318738058',
          source: 'pn1',
          target: 'pn4',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.2581433676228688',
          source: 'pn1',
          target: 'pn5',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.8075488833250957',
          source: 'pn1',
          target: 'pn6',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.21127614133068606',
          source: 'pn1',
          target: 'pn7',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.1563969630013453',
          source: 'pn1',
          target: 'pn8',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.6010043061195691',
          source: 'pn2',
          target: 'pn3',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.13859898720996888',
          source: 'pn2',
          target: 'pn4',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.11287184351593438',
          source: 'pn2',
          target: 'pn5',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.853138911525565',
          source: 'pn2',
          target: 'pn6',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.9545662639947321',
          source: 'pn2',
          target: 'pn7',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.16149044382902744',
          source: 'pn2',
          target: 'pn8',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.5844470600554277',
          source: 'pn3',
          target: 'pn4',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.27134167856974867',
          source: 'pn3',
          target: 'pn5',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.2851054184506281',
          source: 'pn3',
          target: 'pn6',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.7040742308385957',
          source: 'pn3',
          target: 'pn7',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.8893916753255282',
          source: 'pn3',
          target: 'pn8',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.8506246275860265',
          source: 'pn4',
          target: 'pn5',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.158284553750363',
          source: 'pn4',
          target: 'pn6',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.5973775878848873',
          source: 'pn4',
          target: 'pn7',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.194214404474649',
          source: 'pn4',
          target: 'pn8',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.11496528435188291',
          source: 'pn5',
          target: 'pn6',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.9403238130895326',
          source: 'pn5',
          target: 'pn7',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.1555665480046966',
          source: 'pn5',
          target: 'pn8',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.3176240353598032',
          source: 'pn6',
          target: 'pn7',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.682857971789463',
          source: 'pn6',
          target: 'pn8',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.7065126054775828',
          source: 'pn7',
          target: 'pn8',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.571132365680477',
          source: 'pn8',
          target: 'pn9',
          data: {
            cluster: 'a',
          },
        },
        {
          id: 'edge-0.3772610754231518',
          source: 'pn8',
          target: 'pn10',
          data: {
            cluster: 'a',
          },
        },
      ],
    };
    const begin = performance.now();
    const result = GADDI(
      new Graph(nodes77),
      patternWith10Nodes,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster'
    );
    console.log(
      '77 nodes graph matching 10 nodes pattern',
      performance.now() - begin,
      result.length
    );
    result.forEach((re) => {
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
        {
          id: 'pn1',
          data: {
            cluster: 'E',
          },
        },
        {
          id: 'pn2',
          data: {
            cluster: 'D',
          },
        },
        {
          id: 'pn3',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'pn4',
          data: {
            cluster: 'B',
          },
        },
      ],
      edges: [
        {
          id: 'edge-0.3462664680646945',
          source: 'pn1',
          target: 'pn2',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.3659087892682116',
          source: 'pn2',
          target: 'pn3',
          data: {
            cluster: 'a',
          },
        },
        {
          id: 'edge-0.4061347706895744',
          source: 'pn3',
          target: 'pn4',
          data: {
            cluster: 'a',
          },
        },
        {
          id: 'edge-0.26416200117867406',
          source: 'pn1',
          target: 'pn4',
          data: {
            cluster: 'c',
          },
        },
      ],
    };
    const begin = performance.now();
    const result = GADDI(
      new Graph(nodes202),
      patternWith4Nodes,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster'
    );
    console.log(
      '202 nodes graph matching 4 nodes pattern',
      performance.now() - begin
    );
    result.forEach((re) => {
      console.log(JSON.stringify(re));
    });
    expect(result.length).toBe(1);
    expect(result[0].nodes[0].id).toBe('67');
    expect(result[0].nodes.length).toBe(4);
  });
  it('pattern with 7 nodes', () => {
    const patternWith7Nodes = {
      nodes: [
        {
          id: 'pn1',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'pn2',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'pn3',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'pn4',
          data: {
            cluster: 'D',
          },
        },
        {
          id: 'pn5',
          data: {
            cluster: 'E',
          },
        },
        {
          id: 'pn6',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'pn7',
          data: {
            cluster: 'B',
          },
        },
      ],
      edges: [
        {
          id: 'edge-0.5870526666138531',
          source: 'pn1',
          target: 'pn2',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.6788288914519547',
          source: 'pn2',
          target: 'pn3',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.8064334345924178',
          source: 'pn3',
          target: 'pn4',
          data: {
            cluster: 'a',
          },
        },
        {
          id: 'edge-0.9374896941202728',
          source: 'pn4',
          target: 'pn5',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.9184405554911137',
          source: 'pn5',
          target: 'pn1',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.07761229167201766',
          source: 'pn4',
          target: 'pn6',
          data: {
            cluster: 'a',
          },
        },
        {
          id: 'edge-0.21237311448001783',
          source: 'pn4',
          target: 'pn7',
          data: {
            cluster: 'a',
          },
        },
        {
          id: 'edge-0.2894099278321791',
          source: 'pn6',
          target: 'pn7',
          data: {
            cluster: 'c',
          },
        },
      ],
    };
    const begin = performance.now();
    const result = GADDI(
      new Graph(nodes202),
      patternWith7Nodes,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster'
    );
    console.log(
      '202 nodes graph matching 7 nodes pattern',
      performance.now() - begin
    );
    result.forEach((re) => {
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
        {
          id: 'pn1',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'pn2',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'pn3',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'pn4',
          data: {
            cluster: 'D',
          },
        },
        {
          id: 'pn5',
          data: {
            cluster: 'E',
          },
        },
        {
          id: 'pn6',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'pn7',
          data: {
            cluster: 'B',
          },
        },
      ],
      edges: [
        {
          id: 'edge-0.898607921909873',
          source: 'pn1',
          target: 'pn2',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.6226469518013837',
          source: 'pn1',
          target: 'pn5',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.6066686967978825',
          source: 'pn3',
          target: 'pn2',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.07826364791706686',
          source: 'pn4',
          target: 'pn3',
          data: {
            cluster: 'a',
          },
        },
        {
          id: 'edge-0.28260824415873587',
          source: 'pn5',
          target: 'pn4',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.1189109394923169',
          source: 'pn4',
          target: 'pn6',
          data: {
            cluster: 'a',
          },
        },
        {
          id: 'edge-0.23919265487780295',
          source: 'pn4',
          target: 'pn7',
          data: {
            cluster: 'a',
          },
        },
        {
          id: 'edge-0.5510249949377384',
          source: 'pn7',
          target: 'pn6',
          data: {
            cluster: 'c',
          },
        },
      ],
    };
    const begin = performance.now();
    const result = GADDI(
      new Graph(nodes202),
      patternWith7Nodes,
      true,
      undefined,
      undefined,
      'cluster',
      'cluster'
    );
    console.log(
      '202 nodes graph matching 7 nodes pattern, directed',
      performance.now() - begin
    );
    result.forEach((re) => {
      console.log(JSON.stringify(re));
    });
    expect(result.length).toBe(1);
    expect(result[0].nodes[0].id).toBe('167');
    expect(result[0].nodes.length).toBe(7);
  });
  it('pattern with 14 nodes, directed', () => {
    const patternWith14Nodes = {
      nodes: [
        {
          id: 'pn1',
          data: {
            cluster: 'D',
          },
        },
        {
          id: 'pn2',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'pn3',
          data: {
            cluster: 'D',
          },
        },
        {
          id: 'pn4',
          data: {
            cluster: 'D',
          },
        },
        {
          id: 'pn5',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'pn6',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'pn7',
          data: {
            cluster: 'E',
          },
        },
        {
          id: 'pn8',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'pn9',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'pn10',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'pn11',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'pn12',
          data: {
            cluster: 'A',
          },
        },
        {
          id: 'pn13',
          data: {
            cluster: 'E',
          },
        },
        {
          id: 'pn14',
          data: {
            cluster: 'B',
          },
        },
      ],
      edges: [
        {
          id: 'edge-0.7106061009077658',
          source: 'pn2',
          target: 'pn1',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.628968548905904',
          source: 'pn3',
          target: 'pn1',
          data: {
            cluster: 'a',
          },
        },
        {
          id: 'edge-0.8416466431671159',
          source: 'pn4',
          target: 'pn1',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.7302767990647832',
          source: 'pn1',
          target: 'pn5',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.5467945218547585',
          source: 'pn6',
          target: 'pn1',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.15267563895766645',
          source: 'pn7',
          target: 'pn1',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.26286279393723255',
          source: 'pn8',
          target: 'pn1',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.9159459623063093',
          source: 'pn1',
          target: 'pn9',
          data: {
            cluster: 'a',
          },
        },
        {
          id: 'edge-0.272940049859387',
          source: 'pn10',
          target: 'pn1',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.2950771917502619',
          source: 'pn11',
          target: 'pn1',
          data: {
            cluster: 'a',
          },
        },
        {
          id: 'edge-0.3768706834813713',
          source: 'pn1',
          target: 'pn12',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.9004083636419395',
          source: 'pn1',
          target: 'pn13',
          data: {
            cluster: 'c',
          },
        },
        {
          id: 'edge-0.9613119889463126',
          source: 'pn14',
          target: 'pn13',
          data: {
            cluster: 'c',
          },
        },
      ],
    };
    const begin = performance.now();
    const result = GADDI(
      new Graph(nodes202),
      patternWith14Nodes,
      true,
      undefined,
      undefined,
      'cluster',
      'cluster'
    );

    console.log(
      '202 nodes graph matching 14 nodes pattern, directed',
      performance.now() - begin,
      result.length
    );
    result.forEach((re) => {
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
        {
          id: 'pn1',
          data: {
            cluster: 'A',
          },
        },
        {
          id: 'pn2',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'pn3',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'pn4',
          data: {
            cluster: 'A',
          },
        },
      ],
      edges: [
        {
          id: 'edge-0.7019124790843014',
          source: 'pn1',
          target: 'pn2',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'edge-0.7694967395320613',
          source: 'pn1',
          target: 'pn3',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'edge-0.17986599787898694',
          source: 'pn2',
          target: 'pn3',
          data: {
            cluster: 'A',
          },
        },
        {
          id: 'edge-0.17450508771099238',
          source: 'pn3',
          target: 'pn4',
          data: {
            cluster: 'C',
          },
        },
      ],
    };
    const begin = performance.now();
    const result = GADDI(
      new Graph(nodes1589),
      patternWith4Nodes,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster'
    );
    console.log(
      '1589 nodes graph matching 4 nodes pattern',
      performance.now() - begin,
      result.length
    );
    result.forEach((re) => {
      console.log(JSON.stringify(re));
    });

    expect(result.length).toBe(163);
  });
  // TODO: 爆栈
  it('pattern with 6 nodes full-connected', () => {
    const patternWith6Nodes = {
      nodes: [
        {
          id: 'pn1',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'pn2',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'pn3',
          data: {
            cluster: 'A',
          },
        },
        {
          id: 'pn4',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'pn5',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'pn6',
          data: {
            cluster: 'A',
          },
        },
      ],
      edges: [
        {
          id: 'edge-0.13788832813458018',
          source: 'pn1',
          target: 'pn2',
          data: {
            cluster: 'A',
          },
        },
        {
          id: 'edge-0.23939194653978513',
          source: 'pn1',
          target: 'pn3',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'edge-0.41745846944637144',
          source: 'pn1',
          target: 'pn4',
          data: {
            cluster: 'A',
          },
        },
        {
          id: 'edge-0.4509154730355722',
          source: 'pn1',
          target: 'pn5',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'edge-0.9257354686511656',
          source: 'pn1',
          target: 'pn6',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'edge-0.21124048973496912',
          source: 'pn2',
          target: 'pn3',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'edge-0.7475789066195164',
          source: 'pn2',
          target: 'pn4',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'edge-0.57667006311099',
          source: 'pn2',
          target: 'pn5',
          data: {
            cluster: 'A',
          },
        },
        {
          id: 'edge-0.37221806660871226',
          source: 'pn2',
          target: 'pn6',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'edge-0.9492883979946696',
          source: 'pn3',
          target: 'pn3',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'edge-0.9568204100929036',
          source: 'pn3',
          target: 'pn5',
          data: {
            cluster: 'B',
          },
        },
        {
          id: 'edge-0.056762818943291604',
          source: 'pn3',
          target: 'pn6',
          data: {
            cluster: 'A',
          },
        },
        {
          id: 'edge-0.12518022695734143',
          source: 'pn4',
          target: 'pn5',
          data: {
            cluster: 'A',
          },
        },
        {
          id: 'edge-0.7730404042634065',
          source: 'pn4',
          target: 'pn6',
          data: {
            cluster: 'C',
          },
        },
        {
          id: 'edge-0.17324349736721834',
          source: 'pn5',
          target: 'pn6',
          data: {
            cluster: 'B',
          },
        },
      ],
    };
    const begin = performance.now();
    const result = GADDI(
      new Graph(nodes1589),
      patternWith6Nodes,
      false,
      undefined,
      undefined,
      'cluster',
      'cluster'
    );
    console.log(
      '1589 nodes graph matching 6 nodes full-connected pattern',
      performance.now() - begin,
      result.length
    );
    result.forEach((re) => {
      console.log(JSON.stringify(re));
    });
  });
});

describe('Prune', () => {
  it('Prune', () => {
    const dataPrune = {
      nodes: [
        {
          id: '0',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '1',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '2',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '3',
          data: {
            cluster: 'C',
          },
        },
      ],
      edges: [
        {
          id: 'edge-0.29440279439195516',
          source: '0',
          target: '1',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.7825543504752381',
          source: '1',
          target: '2',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.6413307372249752',
          source: '1',
          target: '3',
          data: {
            cluster: 'b',
          },
        },
      ],
    };

    const dataPrune2 = {
      nodes: [
        {
          id: '0',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '1',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '2',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '3',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '4',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '5',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '6',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '7',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '8',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '9',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '10',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '11',
          data: {
            cluster: 'C',
          },
        },
      ],
      edges: [
        {
          id: 'edge-0.6062332351158723',
          source: '0',
          target: '6',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.1530238502615775',
          source: '1',
          target: '6',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.06311710747585053',
          source: '2',
          target: '6',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.7767523461330159',
          source: '3',
          target: '6',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.410684436479148',
          source: '4',
          target: '6',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.43896900099152525',
          source: '5',
          target: '6',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.8940589416958993',
          source: '6',
          target: '7',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.17819639720121416',
          source: '6',
          target: '8',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.4586136024892884',
          source: '6',
          target: '9',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.15938072661257174',
          source: '6',
          target: '10',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.19298427403165586',
          source: '6',
          target: '11',
          data: {
            cluster: 'b',
          },
        },
      ],
    };
    const p = {
      nodes: [
        {
          id: '0',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '1',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '2',
          data: {
            cluster: 'B',
          },
        },
        {
          id: '3',
          data: {
            cluster: 'C',
          },
        },
      ],
      edges: [
        {
          id: 'edge-0.3714552255077763',
          source: '0',
          target: '1',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.28421618356248635',
          source: '2',
          target: '1',
          data: {
            cluster: 'b',
          },
        },
        {
          id: 'edge-0.47947209208258723',
          source: '1',
          target: '3',
          data: {
            cluster: 'b',
          },
        },
      ],
    };

    const result = GADDI(
      new Graph(dataPrune2),
      p,
      true,
      undefined,
      undefined,
      'cluster',
      'cluster'
    );

    // console.log('res', result);
    // // console.log(JSON.stringify(data3));

    // result.forEach(re => {
    //   console.log(JSON.stringify(re));
    // });
    expect(result.length).toBe(1);
  });
});
