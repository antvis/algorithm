import { Graph } from "@antv/graphlib";
import { louvain, iLouvain } from "../../packages/graph/src";
import * as propertiesGraphData from "../data/cluster-origin-properties-data.json";

describe('Louvain', () => {
  it('simple louvain', () => {
    const graph = new Graph<any, any>({
      nodes: [
        { id: '0', data: {} }, { id: '1', data: {} }, { id: '2', data: {} }, { id: '3', data: {} }, { id: '4', data: {} },
        { id: '5', data: {} }, { id: '6', data: {} }, { id: '7', data: {} }, { id: '8', data: {} }, { id: '9', data: {} },
        { id: '10', data: {} }, { id: '11', data: {} }, { id: '12', data: {} }, { id: '13', data: {} }, { id: '14', data: {} },
      ],
      edges: [
        { id: 'e1', source: '0', target: '1', data: {} }, { id: 'e2', source: '0', target: '2', data: {} }, { id: 'e3', source: '0', target: '3', data: {} }, { id: 'e4', source: '0', target: '4', data: {} },
        { id: 'e5', source: '1', target: '2', data: {} }, { id: 'e6', source: '1', target: '3', data: {} }, { id: 'e7', source: '1', target: '4', data: {} },
        { id: 'e8', source: '2', target: '3', data: {} }, { id: 'e9', source: '2', target: '4', data: {} },
        { id: 'e10', source: '3', target: '4', data: {} },
        { id: 'e11', source: '0', target: '0', data: {} },
        { id: 'e12', source: '0', target: '0', data: {} },
        { id: 'e13', source: '0', target: '0', data: {} },
    
        { id: 'e14', source: '5', target: '6', data: {weight: 5} }, { id: 'e15', source: '5', target: '7', data: {} }, { id: 'e16', source: '5', target: '8', data: {} }, { id: 'e17', source: '5', target: '9', data: {} },
        { id: 'e18', source: '6', target: '7', data: {} }, { id: 'e19', source: '6', target: '8', data: {} }, { id: 'e20', source: '6', target: '9', data: {} },
        { id: 'e21', source: '7', target: '8', data: {} }, { id: 'e22', source: '7', target: '9', data: {} },
        { id: 'e23',source: '8', target: '9', data: {} },
    
        { id: 'e24',source: '10', target: '11', data: {} }, { id: 'e25',source: '10', target: '12', data: {} }, { id: 'e26',source: '10', target: '13', data: {} }, { id: 'e27',source: '10', target: '14', data: {} },
        { id: 'e28',source: '11', target: '12', data: {} }, { id: 'e29',source: '11', target: '13', data: {} }, { id: 'e30',source: '11', target: '14', data: {} },
        { id: 'e31',source: '12', target: '13', data: {} }, { id: 'e32',source: '12', target: '14', data: {} },
        { id: 'e33',source: '13', target: '14', data: { weight: 5 } },
    
        { id: 'e34',source: '0', target: '5', data: {}},
        { id: 'e35',source: '5', target: '10', data: {} },
        { id: 'e36',source: '10', target: '0', data: {} },
        { id: 'e37',source: '10', target: '0', data: {} },
      ],
    });
    const clusteredData = louvain(graph, false, 'weight');
    expect(clusteredData.clusters.length).toBe(3);
    expect(clusteredData.clusters[0].sumTot).toBe(3);
    expect(clusteredData.clusters[1].sumTot).toBe(2);
    expect(clusteredData.clusterEdges.length).toBe(6);
    expect(clusteredData.clusterEdges[0].data.count).toBe(13);
    expect(clusteredData.clusterEdges[1].data.count).toBe(10);
    expect(clusteredData.clusterEdges[1].data.weight).toBe(14);
    expect(clusteredData.nodeToCluster.get('0')).toBe('1');
    expect(clusteredData.nodeToCluster.get('1')).toBe('1');
    expect(clusteredData.nodeToCluster.get('2')).toBe('1');
    expect(clusteredData.nodeToCluster.get('3')).toBe('1');
    expect(clusteredData.nodeToCluster.get('4')).toBe('1');
    expect(clusteredData.nodeToCluster.get('5')).toBe('2');
    expect(clusteredData.nodeToCluster.get('6')).toBe('2');
    expect(clusteredData.nodeToCluster.get('7')).toBe('2');
    expect(clusteredData.nodeToCluster.get('8')).toBe('2');
    expect(clusteredData.nodeToCluster.get('9')).toBe('2');
    expect(clusteredData.nodeToCluster.get('10')).toBe('3');
    expect(clusteredData.nodeToCluster.get('11')).toBe('3');
    expect(clusteredData.nodeToCluster.get('12')).toBe('3');
    expect(clusteredData.nodeToCluster.get('13')).toBe('3');
    expect(clusteredData.nodeToCluster.get('14')).toBe('3');
  });

  // it('louvain with large graph', () => { // https://gw.alipayobjects.com/os/antvdemo/assets/data/relations.json
  //   fetch('https://gw.alipayobjects.com/os/basement_prod/da5a1b47-37d6-44d7-8d10-f3e046dabf82.json')
  //     .then((res) => res.json())
  //     .then((data) => { // 1589 nodes, 2747 edges
  //       const clusteredData = louvain(data, false, 'weight');
  //       expect(clusteredData.clusters.length).toBe(495);
  //       expect(clusteredData.clusterEdges.length).toBe(505);
  //     });
  // });

  it('louvain: add inertialModularity', () => {
    const graph = new Graph(propertiesGraphData);
    const clusteredData = iLouvain(graph, false, 'weight', 0.01);
    expect(clusteredData.clusters.length).toBe(3);
    expect(clusteredData.clusters[0].sumTot).toBe(3);
    expect(clusteredData.clusters[1].sumTot).toBe(3);
    expect(clusteredData.clusters[2].sumTot).toBe(4);
    expect(clusteredData.clusterEdges.length).toBe(7);
  });
});