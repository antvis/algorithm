import { Graph } from "./types";

export function kCore(
    graph: Graph,
    k: number = 1,) {
    const nodes = graph.getAllNodes();
    let edges = graph.getAllEdges();
    nodes.sort((a, b) => graph.getDegree(a.id, 'both') - graph.getDegree(b.id, 'both'));
    let i = 0;
    while (true) {
        const curNode = nodes[i];
        if (graph.getDegree(curNode.id, 'both') >= k) break;
        nodes.splice(i, 1);//remove node
        edges = edges.filter(e => !(e.source === i || e.target === i));
    }
    return { nodes, edges };
}