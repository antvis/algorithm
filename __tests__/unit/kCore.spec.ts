import { Edge, Graph, Node } from "@antv/graphlib";
import { kCore } from "../../packages/graph/src";

const graph = new Graph<any, any>({
    nodes: [
        {
            id: 'A',
            data: {}
        },
        {
            id: 'B',
            data: {}
        },
        {
            id: 'C',
            data: {}
        },
        {
            id: 'D',
            data: {}
        },
        {
            id: 'E',
            data: {}
        },
        {
            id: 'F',
            data: {}
        },
        {
            id: 'G',
            data: {}
        },
        {
            id: 'H',
            data: {}
        },
    ],
    edges: [
        {
            id: 'e1',
            source: 'A',
            target: 'B',
            data: {}
        },
        {
            id: 'e2',
            source: 'B',
            target: 'C',
            data: {}
        },
        {
            id: 'e3',
            source: 'C',
            target: 'G',
            data: {}
        },
        {
            id: 'e4',
            source: 'A',
            target: 'D',
            data: {}
        },
        {
            id: 'e5',
            source: 'A',
            target: 'E',
            data: {}
        },
        {
            id: 'e6',
            source: 'E',
            target: 'F',
            data: {}
        },
        {
            id: 'e7',
            source: 'F',
            target: 'D',
            data: {}
        },
        {
            id: 'e8',
            source: 'D',
            target: 'E',
            data: {}
        },
    ],
});

const validateEdge = (edge: Edge<any>, nodes: Node<any>[]) => {
    return nodes.findIndex(n => edge.source === n.id) >= 0 && nodes.findIndex(n => edge.target === n.id) >= 0;
}
describe('k-core algorithm unit test', () => {
    const nodes = graph.getAllNodes();
    const edges = graph.getAllEdges();
    it('k=1', () => {
        const { nodes: kNodes, edges: kEdges } = kCore(graph, 1);
        expect(kNodes.length).toBe(nodes.filter(n => graph.getDegree(n.id) >= 1).length);
        expect(kEdges).toStrictEqual(edges.filter(e => validateEdge(e, nodes)));
    });

    it('k=2', () => {
        const { nodes: kNodes, edges: kEdges } = kCore(graph, 2);
        expect(kNodes.length).toBe(nodes.filter(n => graph.getDegree(n.id) >= 2).length);
        expect(kEdges).toStrictEqual(edges.filter(e => validateEdge(e, nodes)));
    });

    it('k=3', () => {
        const { nodes: kNodes, edges: kEdges } = kCore(graph, 3);
        expect(kNodes.length).toBe(nodes.filter(n => graph.getDegree(n.id) >= 3).length);
        expect(kEdges).toStrictEqual(edges.filter(e => validateEdge(e, nodes)));
    });
});