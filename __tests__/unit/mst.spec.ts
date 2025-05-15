import { minimumSpanningTree } from "../../packages/graph/src";
import { Graph } from "@antv/graphlib";

const data = {
    nodes: [
        {
            id: 'A',
            data: {},
        },
        {
            id: 'B',
            data: {},
        },
        {
            id: 'C',
            data: {},
        },
        {
            id: 'D',
            data: {},
        },
        {
            id: 'E',
            data: {},
        },
        {
            id: 'F',
            data: {},
        },
        {
            id: 'G',
            data: {},
        },
    ],
    edges: [
        {
            id: 'edge1',
            source: 'A',
            target: 'B',
            data: {
                weight: 1,
            }
        },
        {
            id: 'edge2',
            source: 'B',
            target: 'C',
            data: {
                weight: 1,
            }
        },
        {
            id: 'edge3',
            source: 'A',
            target: 'C',
            data: {
                weight: 2,
            }
        },
        {
            id: 'edge4',
            source: 'D',
            target: 'A',
            data: {
                weight: 3,
            }
        },
        {
            id: 'edge5',
            source: 'D',
            target: 'E',
            data: {
                weight: 4,
            }
        },
        {
            id: 'edge6',
            source: 'E',
            target: 'F',
            data: {
                weight: 2,
            }
        },
        {
            id: 'edge7',
            source: 'F',
            target: 'D',
            data: {
                weight: 3,
            }
        },
    ],
};
const graph = new Graph(data);
describe('minimumSpanningTree', () => {
    it('test kruskal algorithm', () => {
        let result = minimumSpanningTree(graph, 'weight');
        let totalWeight = 0;
        for (let edge of result) {
            totalWeight += edge.data.weight;
        }
        expect(totalWeight).toEqual(10);
    });

    it('test prim algorithm', () => {
        let result = minimumSpanningTree(graph, 'weight', 'prim');
        let totalWeight = 0;
        for (let edge of result) {
            totalWeight += edge.data.weight;
        }
        expect(totalWeight).toEqual(10);
    });
});
