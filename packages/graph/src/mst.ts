import UnionFind from './structs/union-find';
import MinBinaryHeap from './structs/binary-heap';
import { Graph, IEdge, IMSTAlgorithm, IMSTAlgorithmOpt } from './types';
import { clone } from '@antv/util';

/**
Calculates the Minimum Spanning Tree (MST) of a graph using the Prim's algorithm.The MST is a subset of edges that forms a tree connecting all nodes with the minimum possible total edge weight.
@param graph - The graph for which the MST needs to be calculated.
@param weightProps - Optional. The property name in the edge data object that represents the weight of the edge.If provided, the algorithm will consider the weight of edges based on this property.If not provided, the algorithm will assume all edges have a weight of 0.
@returns An array of selected edges that form the Minimum Spanning Tree (MST) of the graph.
*/
const primMST: IMSTAlgorithm = (graph, weightProps?) => {
    const selectedEdges: IEdge[] = [];
    const nodes = graph.getAllNodes();
    const edges = graph.getAllEdges();
    if (nodes.length === 0) {
        return selectedEdges;
    }
    // From the first node
    const currNode = nodes[0];
    const visited = new Set();
    visited.add(currNode);
    // Using binary heap to maintain the weight of edges from other nodes that have joined the node
    const compareWeight = (a: IEdge, b: IEdge) => {
        if (weightProps) {
            a.data;
            return (a.data[weightProps] as number) - (b.data[weightProps] as number);
        }
        return 0;
    };
    const edgeQueue = new MinBinaryHeap<IEdge>(compareWeight);

    graph.getRelatedEdges(currNode.id, 'both').forEach((edge) => {
        edgeQueue.insert(edge);
    });
    while (!edgeQueue.isEmpty()) {
        // Select the node with the least edge weight between the added node and the added node
        const currEdge: IEdge = edgeQueue.delMin();
        const source = currEdge.source;
        const target = currEdge.target;
        if (visited.has(source) && visited.has(target)) continue;
        selectedEdges.push(currEdge);
        if (!visited.has(source)) {
            visited.add(source);
            graph.getRelatedEdges(source, 'both').forEach((edge) => {
                edgeQueue.insert(edge);
            });
        }
        if (!visited.has(target)) {
            visited.add(target);
            graph.getRelatedEdges(target, 'both').forEach((edge) => {
                edgeQueue.insert(edge);
            });
        }
    }
    return selectedEdges;
};

/**
Calculates the Minimum Spanning Tree (MST) of a graph using the Kruskal's algorithm.The MST is a subset of edges that forms a tree connecting all nodes with the minimum possible total edge weight.
@param graph - The graph for which the MST needs to be calculated.
@param weightProps - Optional. The property name in the edge data object that represents the weight of the edge.If provided, the algorithm will consider the weight of edges based on this property.If not provided, the algorithm will assume all edges have a weight of 0.
@returns An array of selected edges that form the Minimum Spanning Tree (MST) of the graph.
*/
const kruskalMST: IMSTAlgorithm = (graph, weightProps?) => {
    const selectedEdges: IEdge[] = [];
    const nodes = graph.getAllNodes();
    const edges = graph.getAllEdges();
    if (nodes.length === 0) {
        return selectedEdges;
    }
    // If you specify weight, all edges are sorted by weight from smallest to largest
    const weightEdges = clone(edges);
    if (weightProps) {
        weightEdges.sort((a: IEdge, b: IEdge) => {
            return (a.data[weightProps] as number) - (b.data[weightProps] as number);
        });
    }
    const disjointSet = new UnionFind(nodes.map((n) => n.id));
    // Starting with the edge with the least weight, if the two nodes connected by this edge are not in the same connected component in graph G, the edge is added.
    while (weightEdges.length > 0) {
        const curEdge = weightEdges.shift();
        const source = curEdge.source;
        const target = curEdge.target;
        if (!disjointSet.connected(source, target)) {
            selectedEdges.push(curEdge);
            disjointSet.union(source, target);
        }
    }
    return selectedEdges;
};

/**
Calculates the Minimum Spanning Tree (MST) of a graph using either Prim's or Kruskal's algorithm.The MST is a subset of edges that forms a tree connecting all nodes with the minimum possible total edge weight.
@param graph - The graph for which the MST needs to be calculated.
@param weightProps - Optional. The property name in the edge data object that represents the weight of the edge.If provided, the algorithm will consider the weight of edges based on this property.If not provided, the algorithm will assume all edges have a weight of 0.
@param algo - Optional. The algorithm to use for calculating the MST. Can be either 'prim' for Prim's algorithm, 'kruskal' for Kruskal's algorithm, or undefined to use the default algorithm (Kruskal's algorithm).
@returns An array of selected edges that form the Minimum Spanning Tree (MST) of the graph.
*/
export const minimumSpanningTree = (graph: Graph, weightProps?: string, algo?: 'prim' | 'kruskal' | undefined): IEdge[] => {
    const algos: IMSTAlgorithmOpt = {
        'prim': primMST,
        'kruskal': kruskalMST,
    };
    return (algo && algos[algo](graph, weightProps)) || kruskalMST(graph, weightProps);
};
