import { detectAllCycles, detectDirectedCycle } from '../../packages/graph/src'
import { dataTransformer } from '../utils/data';
import { Graph } from "@antv/graphlib";
import detectCycleTestData from '../data/detect-cycle-test-data.json';

const data = dataTransformer({
    nodes: [
        {
            id: 'A',
        },
        {
            id: 'B',
        },
        {
            id: 'C',
        },
        {
            id: 'D',
        },
        {
            id: 'E',
        },
        {
            id: 'F',
        },
        {
            id: 'G',
        },
    ],
    edges: [
        {
            source: 'A',
            target: 'B',
        },
        {
            source: 'B',
            target: 'C',
        },
        {
            source: 'A',
            target: 'C',
        },
        {
            source: 'D',
            target: 'A',
        },
        {
            source: 'D',
            target: 'E',
        },
        {
            source: 'E',
            target: 'F',
        },
    ],
});

const graph = new Graph(data);
describe('detectDirectedCycle', () => {
    it('should detect directed cycle', () => {
        let result = detectDirectedCycle(graph);
        expect(result).toBeNull();
        const cycleEdge = {
            id: 'edge-6',
            source: 'F',
            target: 'D',
            data: {}
        }
        graph.addEdge(cycleEdge);
        result = detectDirectedCycle(graph);
        expect(result).toEqual({
            D: 'F',
            F: 'E',
            E: 'D',
        });
        graph.removeEdge('edge-6');
    });

    it('detect all cycles in directed graph', () => {
        graph.addEdge({
            id: 'edge-6',
            data: {},
            source: 'C',
            target: 'D',
        });

        const result = detectAllCycles(graph, true);
        expect(result.length).toEqual(2);
        const result2 = detectAllCycles(graph, true, ['B']);
        expect(result2.length).toEqual(1);
        expect(result2[0]).toEqual({
            A: { id: 'B', data: {} },
            B: { id: 'C', data: {} },
            C: { id: 'D', data: {} },
            D: { id: 'A', data: {} },
        });
        graph.removeEdge('edge-6');
    });

    it('detect cycle in undirected graph', () => {
        const result = detectAllCycles(graph);
        expect(result.length).toEqual(1);
        graph.addEdge({
            id: 'edge-6',
            data: {},
            source: 'C',
            target: 'D',
        });
        const result2 = detectAllCycles(graph, false, ['B'], false);
        expect(Object.keys(result2[0]).sort()).toEqual(['A', 'C', 'D']);
    });

    it('test another graph', () => {
        const graphData = {
            nodes: [
                {
                    id: '0',
                    label: '0',
                },
                {
                    id: '1',
                    label: '1',
                },
                {
                    id: '2',
                    label: '2',
                },
                {
                    id: '3',
                    label: '3',
                },
                {
                    id: '4',
                    label: '4',
                },
                {
                    id: '5',
                    label: '5',
                },
                {
                    id: '6',
                    label: '6',
                },
                {
                    id: '7',
                    label: '7',
                },
                {
                    id: '8',
                    label: '8',
                },
                {
                    id: '9',
                    label: '9',
                },
                {
                    id: '10',
                    label: '10',
                },
                {
                    id: '11',
                    label: '11',
                },
                {
                    id: '12',
                    label: '12',
                },
                {
                    id: '13',
                    label: '13',
                },
                {
                    id: '14',
                    label: '14',
                },
                {
                    id: '15',
                    label: '15',
                },
                {
                    id: '16',
                    label: '16',
                },
                {
                    id: '17',
                    label: '17',
                },
                {
                    id: '18',
                    label: '18',
                },
                {
                    id: '19',
                    label: '19',
                },
                {
                    id: '20',
                    label: '20',
                },
                {
                    id: '21',
                    label: '21',
                },
                {
                    id: '22',
                    label: '22',
                },
                {
                    id: '23',
                    label: '23',
                },
                {
                    id: '24',
                    label: '24',
                },
                {
                    id: '25',
                    label: '25',
                },
                {
                    id: '26',
                    label: '26',
                },
                {
                    id: '27',
                    label: '27',
                },
                {
                    id: '28',
                    label: '28',
                },
                {
                    id: '29',
                    label: '29',
                },
                {
                    id: '30',
                    label: '30',
                },
                {
                    id: '31',
                    label: '31',
                },
                {
                    id: '32',
                    label: '32',
                },
                {
                    id: '33',
                    label: '33',
                },
            ],
            edges: [
                {
                    source: '0',
                    target: '1',
                },
                {
                    source: '0',
                    target: '2',
                },
                {
                    source: '3',
                    target: '0',
                },
                {
                    source: '0',
                    target: '4',
                },
                {
                    source: '5',
                    target: '0',
                },
                {
                    source: '0',
                    target: '7',
                },
                {
                    source: '0',
                    target: '8',
                },
                {
                    source: '0',
                    target: '9',
                },
                {
                    source: '0',
                    target: '10',
                },
                {
                    source: '0',
                    target: '11',
                },
                {
                    source: '0',
                    target: '13',
                },
                {
                    source: '14',
                    target: '0',
                },
                {
                    source: '0',
                    target: '15',
                },
                {
                    source: '0',
                    target: '16',
                },
                {
                    source: '2',
                    target: '3',
                },
                {
                    source: '4',
                    target: '5',
                },
                {
                    source: '4',
                    target: '6',
                },
                {
                    source: '5',
                    target: '6',
                },
                {
                    source: '7',
                    target: '13',
                },
                {
                    source: '8',
                    target: '14',
                },
                {
                    source: '9',
                    target: '10',
                },
                {
                    source: '10',
                    target: '22',
                },
                {
                    source: '10',
                    target: '14',
                },
                {
                    source: '10',
                    target: '12',
                },
                {
                    source: '10',
                    target: '24',
                },
                {
                    source: '10',
                    target: '21',
                },
                {
                    source: '10',
                    target: '20',
                },
                {
                    source: '11',
                    target: '24',
                },
                {
                    source: '11',
                    target: '22',
                },
                {
                    source: '11',
                    target: '14',
                },
                {
                    source: '12',
                    target: '13',
                },
                {
                    source: '16',
                    target: '17',
                },
                {
                    source: '16',
                    target: '18',
                },
                {
                    source: '16',
                    target: '21',
                },
                {
                    source: '16',
                    target: '22',
                },
                {
                    source: '17',
                    target: '18',
                },
                {
                    source: '17',
                    target: '20',
                },
                {
                    source: '18',
                    target: '19',
                },
                {
                    source: '19',
                    target: '20',
                },
                {
                    source: '19',
                    target: '33',
                },
                {
                    source: '19',
                    target: '22',
                },
                {
                    source: '19',
                    target: '23',
                },
                {
                    source: '20',
                    target: '21',
                },
                {
                    source: '21',
                    target: '22',
                },
                {
                    source: '22',
                    target: '24',
                },
                {
                    source: '22',
                    target: '25',
                },
                {
                    source: '22',
                    target: '26',
                },
                {
                    source: '22',
                    target: '23',
                },
                {
                    source: '22',
                    target: '28',
                },
                {
                    source: '22',
                    target: '30',
                },
                {
                    source: '22',
                    target: '31',
                },
                {
                    source: '22',
                    target: '32',
                },
                {
                    source: '22',
                    target: '33',
                },
                {
                    source: '23',
                    target: '28',
                },
                {
                    source: '23',
                    target: '27',
                },
                {
                    source: '23',
                    target: '29',
                },
                {
                    source: '23',
                    target: '30',
                },
                {
                    source: '23',
                    target: '31',
                },
                {
                    source: '23',
                    target: '33',
                },
                {
                    source: '32',
                    target: '33',
                },
            ],
        };
        const graph = new Graph(dataTransformer(graphData));
        const result = detectAllCycles(graph, true, ['14']);
        const result2 = detectAllCycles(graph);
        expect(result.length).toEqual(4);
        expect(result2.length).toEqual(27);
    });
    it('test a large graph', () => {
        detectCycleTestData.nodes.forEach((node: any) => {
            node.label = node.olabel;
            node.degree = 0;
            data.edges.forEach((edge) => {
                if (edge.source === node.id || edge.target === node.id) {
                    node.degree++;
                }
            });
            const graph = new Graph(dataTransformer(detectCycleTestData));

            const directedCycles = detectAllCycles(graph, true);
            expect(directedCycles.length).toEqual(0);
            const undirectedCycles = detectAllCycles(graph, false, ['1084'], false);
            expect(undirectedCycles.length).toEqual(1548);
        });
    });
});
