import { Graph } from "@antv/graphlib";
import { labelPropagation } from '../../packages/graph/src';
import { dataTransformer } from "../utils/data";
import labelPropagationTestData from '../data/label-propagation-test-data.json';


describe('label propagation', () => {
    it('simple label propagation', () => {
        const oldData = {
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
        };
        const data = dataTransformer(oldData);
        const graph = new Graph(data);
        const clusteredData = labelPropagation(graph, false, 'weight');
        expect(clusteredData.clusters.length).not.toBe(0);
        expect(clusteredData.clusterEdges.length).not.toBe(0);
    });

    it('label propagation with large graph', () => {
        const data = dataTransformer(labelPropagationTestData);
        const graph = new Graph(data);
        const clusteredData = labelPropagation(graph, false, 'weight');
        expect(clusteredData.clusters.length).not.toBe(0);
        expect(clusteredData.clusterEdges.length).not.toBe(0);
    }
});
