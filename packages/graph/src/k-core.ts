import { Graph } from "./types";

/**
Finds the k-core of a given graph.
@param graph - The input graph.
@param k - The minimum degree required for a node to be considered part of the k-core. Default is 1.
@returns An object containing the nodes and edges of the k-core.
*/
export function kCore(
    graph: Graph,
    k: number = 1,) {
    const nodes = graph.getAllNodes();
    let edges = graph.getAllEdges();
    nodes.sort((a, b) => graph.getDegree(a.id, 'both') - graph.getDegree(b.id, 'both'));
    const i = 0;
    while (true) {
        const curNode = nodes[i];
        if (graph.getDegree(curNode.id, 'both') >= k) break;
        nodes.splice(i, 1);// remove node
        edges = edges.filter((e) => !(e.source === i || e.target === i));
    }
    return { nodes, edges };
}