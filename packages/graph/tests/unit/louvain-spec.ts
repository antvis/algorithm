import { louvain } from '../../src';
import { GraphData } from '../../src/types';

describe('louvain', () => {

  it('simple louvain', () => {
    const data: GraphData = {
      nodes: [
        { id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' },
        { id: '5' }, { id: '6' }, { id: '7' }, { id: '8' }, { id: '9' },
        { id: '10' }, { id: '11' }, { id: '12' }, { id: '13' }, { id: '14' },
      ],
      edges: [
        { source: '0', target: '1' }, { source: '0', target: '2' }, { source: '0', target: '3' }, { source: '0', target: '4' },
        { source: '1', target: '2' }, { source: '1', target: '3' }, { source: '1', target: '4' },
        { source: '2', target: '3' }, { source: '2', target: '4' },
        { source: '3', target: '4' },
        { source: '0', target: '0' },
        { source: '0', target: '0' },
        { source: '0', target: '0' },

        { source: '5', target: '6', weight: 5 }, { source: '5', target: '7' }, { source: '5', target: '8' }, { source: '5', target: '9' },
        { source: '6', target: '7' }, { source: '6', target: '8' }, { source: '6', target: '9' },
        { source: '7', target: '8' }, { source: '7', target: '9' },
        { source: '8', target: '9' },

        { source: '10', target: '11' }, { source: '10', target: '12' }, { source: '10', target: '13' }, { source: '10', target: '14' },
        { source: '11', target: '12' }, { source: '11', target: '13' }, { source: '11', target: '14' },
        { source: '12', target: '13' }, { source: '12', target: '14' },
        { source: '13', target: '14', weight: 5 },

        { source: '0', target: '5' },
        { source: '5', target: '10' },
        { source: '10', target: '0' },
        { source: '10', target: '0' },
      ]
    }
    const clusteredData = louvain(data, false, 'weight');
    expect(clusteredData.clusters.length).toBe(3);
    expect(clusteredData.clusters[0].sumTot).toBe(3);
    expect(clusteredData.clusters[1].sumTot).toBe(2);
    expect(clusteredData.clusterEdges.length).toBe(6);
    expect(clusteredData.clusterEdges[0].count).toBe(13);
    expect(clusteredData.clusterEdges[1].count).toBe(10);
    expect(clusteredData.clusterEdges[1].weight).toBe(14);
  });
  it('louvain with large graph', () => { // https://gw.alipayobjects.com/os/antvdemo/assets/data/relations.json
    fetch('https://gw.alipayobjects.com/os/basement_prod/da5a1b47-37d6-44d7-8d10-f3e046dabf82.json')
      .then((res) => res.json())
      .then((data) => { // 1589 nodes, 2747 edges
        const clusteredData = louvain(data, false, 'weight');
        expect(clusteredData.clusters.length).toBe(495);
        expect(clusteredData.clusterEdges.length).toBe(505);
      });
  });
});
