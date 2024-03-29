import { nodesCosineSimilarity } from '../../src';
import { NodeConfig } from '../../src/types';
import propertiesGraphData from './data/cluster-origin-properties-data.json';

describe('nodesCosineSimilarity abnormal demo', () => {
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
    const { allCosineSimilarity, similarNodes } = nodesCosineSimilarity(nodes as NodeConfig[], nodes[0]);
    expect(allCosineSimilarity.length).toBe(3);
    expect(similarNodes.length).toBe(3);
    expect(allCosineSimilarity[0]).toBe(1);
    expect(allCosineSimilarity[1]).toBe(0);
    expect(allCosineSimilarity[2]).toBe(0);
  });
});

describe('nodesCosineSimilarity normal demo', () => {
  it('simple demo: ', () => {
    const nodes = [
      {
        id: 'node-0',
        properties: {
          amount: 10,
        }
      },
      {
        id: 'node-2',
        properties: {
          amount: 100,
        }
      },
      {
        id: 'node-3',
        properties: {
          amount: 1000,
        }
      },
      {
        id: 'node-4',
        properties: {
          amount: 50,
        }
      }
    ];
    const { allCosineSimilarity, similarNodes } = nodesCosineSimilarity(nodes as NodeConfig[], nodes[0], 'properties');
    expect(allCosineSimilarity.length).toBe(3);
    expect(similarNodes.length).toBe(3);
    allCosineSimilarity.forEach(data => {
      expect(data).toBeGreaterThanOrEqual(0);
      expect(data).toBeLessThanOrEqual(1);
    })
  });

  it('complex demo: ', () => {
    const { nodes } = propertiesGraphData;
    const { allCosineSimilarity, similarNodes } = nodesCosineSimilarity(nodes as NodeConfig[], nodes[16], 'properties');
    expect(allCosineSimilarity.length).toBe(16);
    expect(similarNodes.length).toBe(16);
    allCosineSimilarity.forEach(data => {
      expect(data).toBeGreaterThanOrEqual(0);
      expect(data).toBeLessThanOrEqual(1);
    })
  });


  it('demo use involvedKeys: ', () => {
    const involvedKeys = ['amount', 'wifi'];
    const { nodes } = propertiesGraphData;
    const { allCosineSimilarity, similarNodes } = nodesCosineSimilarity(nodes as NodeConfig[], nodes[16], 'properties', involvedKeys);
    expect(allCosineSimilarity.length).toBe(16);
    expect(similarNodes.length).toBe(16);
    allCosineSimilarity.forEach(data => {
      expect(data).toBeGreaterThanOrEqual(0);
      expect(data).toBeLessThanOrEqual(1);
    })
    expect(similarNodes[0].id).toBe('node-11');
  });

  it('demo use uninvolvedKeys: ', () => {
    const uninvolvedKeys = ['amount'];
    const { nodes } = propertiesGraphData;
    const { allCosineSimilarity, similarNodes } = nodesCosineSimilarity(nodes as NodeConfig[], nodes[16], 'properties', [], uninvolvedKeys);
    expect(allCosineSimilarity.length).toBe(16);
    expect(similarNodes.length).toBe(16);
    allCosineSimilarity.forEach(data => {
      expect(data).toBeGreaterThanOrEqual(0);
      expect(data).toBeLessThanOrEqual(1);
    })
    expect(similarNodes[0].id).toBe('node-11');
  });
});
