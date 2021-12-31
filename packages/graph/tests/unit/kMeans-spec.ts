import { clone } from '@antv/util';
import { kMeans } from '../../src';
import { NodeConfig } from '../../src/types';
import propertiesGraphData from './data/cluster-origin-properties-data.json';

describe('kMeans abnormal demo', () => {
  it('no properties demo: ', () => {
    const nodes = [
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
    ];
    const clusters = kMeans(nodes as NodeConfig[], 2);
    expect(clusters.length).toBe(2);
  });
});

describe('kMeans normal demo', () => {
  const simpleNodes = [
    {
      id: 'node-0',
      properties: {
        amount: 10,
        age: 20,
      }
    },
    {
      id: 'node-1',
      properties: {
        amount: 100,
        age: 20,
      }
    },
    {
      id: 'node-2',
      properties: {
        amount: 1000,
        age: 40,
      }
    },
    {
      id: 'node-3',
      properties: {
        amount: 10,
        age: 20,
      }
    },
    {
      id: 'node-4',
      properties: {
        amount: 1000,
        age: 30,
      }
    }
  ] as NodeConfig[];
  it('simple data demo: ', () => {
    const nodes = clone(simpleNodes);
    const clusters = kMeans(nodes, 3);
    expect(clusters.length).toBe(3);
    expect(nodes[0].clusterId).toEqual(nodes[3].clusterId);
    expect(nodes[2].clusterId).toEqual(nodes[4].clusterId);
  });

  it('complex data demo: ', () => {
    const nodes = propertiesGraphData.nodes as NodeConfig[];
    const clusters = kMeans(nodes, 3);
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
    const nodes = clone(simpleNodes);
    const clusters = kMeans(nodes, 3, involvedKeys);
    expect(clusters.length).toBe(3);
    expect(nodes[0].clusterId).toEqual(nodes[3].clusterId);
    expect(nodes[2].clusterId).toEqual(nodes[4].clusterId);
  });

  it('demo use uninvolvedKeys: ', () => {
    const uninvolvedKeys = ['amount'];
    const nodes = clone(simpleNodes);
    const clusters = kMeans(nodes, 3, [], uninvolvedKeys);
    expect(clusters.length).toBe(3);
    expect(nodes[0].clusterId).toEqual(nodes[3].clusterId);
    expect(nodes[0].clusterId).toEqual(nodes[1].clusterId);
  });
});
