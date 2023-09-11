import { nodesCosineSimilarity } from "../../packages/graph/src";
import propertiesGraphData from '../data/cluster-origin-properties-data.json';
import { NodeSimilarity } from "../../packages/graph/src/types";

describe('nodesCosineSimilarity abnormal demo', () => {
    it('no properties demo: ', () => {
        const nodes = [
            {
                id: 'node-0',
                data: {},
            },
            {
                id: 'node-1',
                data: {},
            },
            {
                id: 'node-2',
                data: {},
            },
            {
                id: 'node-3',
                data: {},
            }
        ];
        const { allCosineSimilarity, similarNodes } = nodesCosineSimilarity(nodes as NodeSimilarity[], nodes[0]);
        expect(allCosineSimilarity.length).toBe(3);
        expect(similarNodes.length).toBe(3);
        expect(allCosineSimilarity[0]).toBe(0);
        expect(allCosineSimilarity[1]).toBe(0);
        expect(allCosineSimilarity[2]).toBe(0);
    });
});


describe('nodesCosineSimilarity normal demo', () => {
    it('simple demo: ', () => {
        const nodes = [
            {
                id: 'node-0',
                data: {
                    amount: 10,
                }
            },
            {
                id: 'node-2',
                data: {
                    amount: 100,
                }
            },
            {
                id: 'node-3',
                data: {
                    amount: 1000,
                }
            },
            {
                id: 'node-4',
                data: {
                    amount: 50,
                }
            }
        ];
        const { allCosineSimilarity, similarNodes } = nodesCosineSimilarity(nodes as NodeSimilarity[], nodes[0], ['amount']);
        expect(allCosineSimilarity.length).toBe(3);
        expect(similarNodes.length).toBe(3);
        allCosineSimilarity.forEach(data => {
            expect(data).toBeGreaterThanOrEqual(0);
            expect(data).toBeLessThanOrEqual(1);
        })
    });

    it('complex demo: ', () => {
        const { nodes } = propertiesGraphData;
        const { allCosineSimilarity, similarNodes } = nodesCosineSimilarity(nodes as NodeSimilarity[], nodes[16]);
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
        const { allCosineSimilarity, similarNodes } = nodesCosineSimilarity(nodes as NodeSimilarity[], nodes[16], involvedKeys);
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
        const { allCosineSimilarity, similarNodes } = nodesCosineSimilarity(nodes as NodeSimilarity[], nodes[16], [], uninvolvedKeys);
        expect(allCosineSimilarity.length).toBe(16);
        expect(similarNodes.length).toBe(16);
        allCosineSimilarity.forEach(data => {
            expect(data).toBeGreaterThanOrEqual(0);
            expect(data).toBeLessThanOrEqual(1);
        })
        expect(similarNodes[0].id).toBe('node-11');
    });
});
