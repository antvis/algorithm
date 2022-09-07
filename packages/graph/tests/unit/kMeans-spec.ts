import { kMeans } from '../../src';
import { GraphData, NodeConfig } from '../../src/types';
import propertiesGraphData from './data/cluster-origin-properties-data.json';

describe('kMeans abnormal demo', () => {
  it('no properties demo: ', () => {
    const noPropertiesData = {
      nodes: [
        {
          id: 'node-0',
        },
        {
          id: 'node-1',
        },
        {
          id: 'node-2',
        },
        {
          id: 'node-3',
        }
      ],
      edges: [],
    }
    const { clusters, clusterEdges } = kMeans(noPropertiesData, 2);
    expect(clusters.length).toBe(1);
    expect(clusterEdges.length).toBe(0);
  });
});

describe('kMeans normal demo', () => {
  const simpleGraphData = {
    nodes: [
      {
        id: 'node-0',
        properties: {
          amount: 10,
          city: '10001',
        }
      },
      {
        id: 'node-1',
        properties: {
          amount: 10000,
          city: '10002',
        }
      },
      {
        id: 'node-2',
        properties: {
          amount: 3000,
          city: '10003',
        }
      },
      {
        id: 'node-3',
        properties: {
          amount: 3200,
          city: '10003',
        }
      },
      {
        id: 'node-4',
        properties: {
          amount: 2000,
          city: '10003',
        }
      }
    ],
    edges: [
      {
        id: 'edge-0',
        source: 'node-0',
        target: 'node-1',
      },
      {
        id: 'edge-1',
        source: 'node-0',
        target: 'node-2',
      },
      {
        id: 'edge-4',
        source: 'node-3',
        target: 'node-2',
      },
      {
        id: 'edge-5',
        source: 'node-2',
        target: 'node-1',
      },
      {
        id: 'edge-6',
        source: 'node-4',
        target: 'node-1',
      },
    ]
  }
  it('simple data demo: ', () => {
    const nodes = simpleGraphData.nodes as NodeConfig[];
    const { clusters } = kMeans(simpleGraphData, 3, 'properties');
    expect(clusters.length).toBe(3);
    expect(nodes[2].clusterId).toEqual(nodes[3].clusterId);
    expect(nodes[2].clusterId).toEqual(nodes[4].clusterId);
  });

  it('complex data demo: ', () => {
    const nodes = propertiesGraphData.nodes as NodeConfig[];
    const { clusters } = kMeans(propertiesGraphData as GraphData, 3, 'properties');
    expect(clusters.length).toBe(3);
    expect(nodes[0].clusterId).toEqual(nodes[1].clusterId);
    expect(nodes[0].clusterId).toEqual(nodes[2].clusterId);
    expect(nodes[0].clusterId).toEqual(nodes[3].clusterId);
    expect(nodes[0].clusterId).toEqual(nodes[4].clusterId);
    expect(nodes[5].clusterId).toEqual(nodes[6].clusterId);
    expect(nodes[5].clusterId).toEqual(nodes[7].clusterId);
    expect(nodes[5].clusterId).toEqual(nodes[8].clusterId);
    expect(nodes[5].clusterId).toEqual(nodes[9].clusterId);
    expect(nodes[5].clusterId).toEqual(nodes[10].clusterId);
    expect(nodes[11].clusterId).toEqual(nodes[12].clusterId);
    expect(nodes[11].clusterId).toEqual(nodes[13].clusterId);
    expect(nodes[11].clusterId).toEqual(nodes[14].clusterId);
    expect(nodes[11].clusterId).toEqual(nodes[15].clusterId);
    expect(nodes[11].clusterId).toEqual(nodes[16].clusterId);
  });


  it('demo use involvedKeys: ', () => {
    const involvedKeys = ['amount'];
    const nodes = simpleGraphData.nodes as NodeConfig[];
    const { clusters } = kMeans(simpleGraphData, 3, 'properties', involvedKeys);
    expect(clusters.length).toBe(3);
    expect(nodes[2].clusterId).toEqual(nodes[3].clusterId);
    expect(nodes[2].clusterId).toEqual(nodes[4].clusterId);
  });

  it('demo use uninvolvedKeys: ', () => {
    const uninvolvedKeys = ['id', 'city'];
    const nodes = simpleGraphData.nodes as NodeConfig[];
    const { clusters } = kMeans(simpleGraphData, 3, 'properties', [], uninvolvedKeys);
    expect(clusters.length).toBe(3);
    expect(nodes[2].clusterId).toEqual(nodes[3].clusterId);
    expect(nodes[2].clusterId).toEqual(nodes[4].clusterId);
  });
});

describe('kMeans All properties values are numeric demo', () => {
  it('all properties values are numeric demo: ', () => {
    const allPropertiesValuesNumericData = {
      nodes: [
        {
          id: 'node-0',
          properties: {
            max: 1000000,
            mean: 900000,
            min: 800000,
          }
        },
        {
          id: 'node-1',
          properties: {
            max: 1600000,
            mean: 1100000,
            min: 600000,
          }
        },
        {
          id: 'node-2',
          properties: {
            max: 5000,
            mean: 3500,
            min: 2000,
          }
        },
        {
          id: 'node-3',
          properties: {
            max: 9000,
            mean: 7500,
            min: 6000,
          }
        }
      ],
      edges: [],
    }
    const { clusters, clusterEdges } = kMeans(allPropertiesValuesNumericData, 2, 'properties');
    expect(clusters.length).toBe(2);
    expect(clusterEdges.length).toBe(0);
    const nodes = allPropertiesValuesNumericData.nodes as NodeConfig[];
    expect(nodes[0].clusterId).toEqual(nodes[1].clusterId);
    expect(nodes[2].clusterId).toEqual(nodes[3].clusterId);
  });

  it('only one property and the value are numeric demo: ', () => {
    const allPropertiesValuesNumericData = {
      nodes: [
        {
          id: 'node-0',
          properties: {
            num: 10,
          }
        },
        {
          id: 'node-1',
          properties: {
            num: 12,
          }
        },
        {
          id: 'node-2',
          properties: {
            num: 56,
          }
        },
        {
          id: 'node-3',
          properties: {
            num: 300,
          }
        },
        {
          id: 'node-4',
          properties: {
            num: 350,
          }
        }
      ],
      edges: [],
    }
    const { clusters, clusterEdges } = kMeans(allPropertiesValuesNumericData, 2, 'properties');
    expect(clusters.length).toBe(2);
    expect(clusterEdges.length).toBe(0);
    const nodes = allPropertiesValuesNumericData.nodes as NodeConfig[];
    expect(nodes[0].clusterId).toEqual(nodes[1].clusterId);
    expect(nodes[0].clusterId).toEqual(nodes[2].clusterId);
    expect(nodes[3].clusterId).toEqual(nodes[4].clusterId);
  });
});
