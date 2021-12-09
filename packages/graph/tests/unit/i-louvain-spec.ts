import { louvain } from '../../src';
import { GraphData } from '../../src/types';
import propertiesGraphData from './data/cluster-origin-properties-data.json';

describe('i-louvain', () => {
  it('i-louvain: add inertialModularity', () => {
    const clusteredData = louvain(propertiesGraphData as GraphData, false, 'weight', 0.01);
    expect(clusteredData.clusters.length).toBe(3);
    expect(clusteredData.clusters[0].sumTot).toBe(4);
    expect(clusteredData.clusters[1].sumTot).toBe(3);
    expect(clusteredData.clusters[2].sumTot).toBe(3);
    expect(clusteredData.clusterEdges.length).toBe(7);
  });
});
