import UnionFind from './structs/union-find';
import MinBinaryHeap from './structs/binary-heap';
import { Graph, IEdge, IMSTAlgorithm, IMSTAlgorithmOpt } from './types';
import { clone } from '@antv/util';
import { getEdgesByNodeId } from './utils';

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
    const edgeQueue = new MinBinaryHeap(compareWeight);
    getEdgesByNodeId(currNode.id, edges).forEach((edge) => {
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
            getEdgesByNodeId(source, edges).forEach((edge) => {
                edgeQueue.insert(edge);
            });
        }
        if (!visited.has(target)) {
            visited.add(target);
            getEdgesByNodeId(target, edges).forEach((edge) => {
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
    // 若指定weight，则将所有的边按权值从小到大排序
    const weightEdges = clone(edges);
    if (weightProps) {
        weightEdges.sort((a: IEdge, b: IEdge) => {
            return (a.data[weightProps] as number) - (b.data[weightProps] as number);
        });
    }
    const disjointSet = new UnionFind(nodes.map((n) => n.id));

    // 从权值最小的边开始，如果这条边连接的两个节点于图G中不在同一个连通分量中，则添加这条边
    // 直到遍历完所有点或边
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
