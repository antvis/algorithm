import { clone, uniqueId } from '@antv/util';
import { GraphData } from '../types';
import {
  Graph,
  Edge,
  VACANT_NODE_LABEL,
  VACANT_GRAPH_ID,
  Node,
  VACANT_EDGE_LABEL,
} from './struct';

export interface EdgeMap {
  [key: string]: {
    // key formatted as source-target
    idx: number; // The index of the edge in the original graphData.edges.
    edge: any;
  };
}

export interface NodeMap {
  [key: string]: {
    // key formatted as node.id
    idx: number; // The index of the node in the original graphData.nodes.
    node: any;
    degree: number;
    inDegree: number;
    outDegree: number;
  };
}

interface PDFS {
  graphId: number;
  edge: any;
  preNode: any;
}

class DFSedge {
  public fromNode: number;
  public toNode: number;
  public nodeEdgeNodeLabel: {
    nodeLabel1: string;
    edgeLabel: string;
    nodeLabel2: string;
  };

  constructor(
    fromNode: number,
    toNode: number,
    fromNodeLabel: string,
    edgeLabel: string,
    toNodeLabel: string
  ) {
    this.fromNode = fromNode;
    this.toNode = toNode;
    this.nodeEdgeNodeLabel = {
      nodeLabel1: fromNodeLabel || VACANT_NODE_LABEL,
      edgeLabel: edgeLabel || VACANT_EDGE_LABEL,
      nodeLabel2: toNodeLabel || VACANT_NODE_LABEL,
    };
  }

  equalTo(other: DFSedge) {
    return (
      this.fromNode === other.fromNode &&
      this.toNode === other.toNode &&
      this.nodeEdgeNodeLabel === other.nodeEdgeNodeLabel
    );
  }

  notEqualTo(other: DFSedge) {
    return !this.equalTo(other);
  }
}

// DFScode is the array of DESedge
class DFScode {
  public dfsEdgeList: DFSedge[];
  public rmpath: any;

  constructor() {
    this.rmpath = [];
    this.dfsEdgeList = [];
  }

  equalTo(other: DFSedge[]) {
    const aLength = this.dfsEdgeList.length;
    const bLength = other.length;
    if (aLength !== bLength) return false;
    for (let i = 0; i < aLength; i++) {
      if (this.dfsEdgeList[i] !== other[i]) return false;
    }
    return true;
  }

  notEqualTo(other: DFSedge[]) {
    return !this.equalTo(other);
  }

  /** Add an edge to DFScode */
  pushBack(
    fromNode: number,
    toNode: number,
    fromNodeLabel: string,
    edgeLabel: string,
    toNodeLabel: string
  ) {
    this.dfsEdgeList.push(
      new DFSedge(fromNode, toNode, fromNodeLabel, edgeLabel, toNodeLabel)
    );
    return this.dfsEdgeList;
  }

  /** Build graph according to dfs */
  toGraph(graphId: number = VACANT_GRAPH_ID, directed = false) {
    const graph = new Graph(graphId, true, directed);
    this.dfsEdgeList.forEach((dfsEdge) => {
      const fromNodeId = dfsEdge.fromNode;
      const toNodeId = dfsEdge.toNode;
      const { nodeLabel1, edgeLabel, nodeLabel2 } = dfsEdge.nodeEdgeNodeLabel;

      if (nodeLabel1 !== VACANT_NODE_LABEL)
        graph.addNode(fromNodeId, nodeLabel1);
      if (nodeLabel2 !== VACANT_NODE_LABEL) graph.addNode(toNodeId, nodeLabel2);
      if (nodeLabel1 !== VACANT_NODE_LABEL && nodeLabel2 !== nodeLabel1)
        graph.addEdge(undefined, fromNodeId, toNodeId, edgeLabel);
    });
    return graph;
  }

  // Build rightmost path
  buildRmpath() {
    this.rmpath = [];
    let oldFrom = undefined;
    const selfLength = this.dfsEdgeList.length;
    for (let i = selfLength - 1; i >= 0; i--) {
      const dfsEdge = this.dfsEdgeList[i];
      const fromNodeIdx = dfsEdge.fromNode;
      const toNodeIdx = dfsEdge.toNode;
      if (
        fromNodeIdx < toNodeIdx &&
        (oldFrom === undefined || toNodeIdx === oldFrom)
      ) {
        this.rmpath.push(i);
        oldFrom = fromNodeIdx;
      }
    }
    return this.rmpath;
  }

  getNodeNum() {
    const nodeMap: { [key: number]: boolean } = {};
    this.dfsEdgeList.forEach((dfsEdge) => {
      if (!nodeMap[dfsEdge.fromNode]) nodeMap[dfsEdge.fromNode] = true;
      if (!nodeMap[dfsEdge.toNode]) nodeMap[dfsEdge.toNode] = true;
    });
    return Object.keys(nodeMap).length;
  }
}

class History {
  public his: object;
  public edges: Edge[];
  public nodesUsed: { [key: number]: number };
  public edgesUsed: { [key: number]: number };

  constructor(pdfs: PDFS) {
    this.his = {};
    this.nodesUsed = {};
    this.edgesUsed = {};
    this.edges = [];
    if (!pdfs) return;
    while (pdfs) {
      const e = pdfs.edge;
      this.edges.push(e);
      this.nodesUsed[e.from] = 1;
      this.nodesUsed[e.to] = 1;
      this.edgesUsed[e.id] = 1;
      pdfs = pdfs.preNode;
    }
    // reverse the order
    this.edges = this.edges.reverse();
  }

  hasNode(node: Node) {
    return this.nodesUsed[node.id] === 1;
  }

  hasEdge(edge: Edge) {
    return this.edgesUsed[edge.id] === 1;
  }
}

interface Root {
  [key: string]: {
    projected: PDFS[];
    nodeLabel1?: string;
    edgeLabel?: string;
    nodeLabel2?: string;
    fromNodeId?: number;
    toNodeId?: number;
  };
}

interface GraphDataMap {
  [key: string]: GraphData;
}
interface GraphMap {
  [key: number]: Graph;
}

interface AlgorithmProps {
  graphs: GraphMap; // Graph data
  minSupport: number; // Minimum support count, specified based on the number of graphs in the graphs list
  directed?: boolean; // Whether it is a directed graph, false by default
  minNodeNum?: number; // The minimum number of edges in each subgraph. Default is 1
  maxNodeNum?: number; // The maximum number of edges in each subgraph. Default is 4
  top?: number; // Return the top frequent subgraphs. Default is 10
  verbose?: boolean;
}

class GSpan {
  public graphs: GraphMap;
  public dfsCode: DFScode;
  public support: number;
  public frequentSize1Subgraphs: GraphData[];
  public frequentSubgraphs: Graph[];
  public reportDF: [];
  public maxNodeNum: number;
  public minNodeNum: number;
  public minSupport: number;
  public top: number;
  public directed: boolean;
  private counter: number; // The ID used for generating the graph, incremented automatically.
  public verbose: boolean;

  constructor({
    graphs,
    minSupport = 2,
    minNodeNum = 1,
    maxNodeNum = 4,
    top = 10,
    directed = false,
    verbose = false,
  }: AlgorithmProps) {
    // -------- Step 0: Initailizing -------
    this.graphs = graphs;
    this.dfsCode = new DFScode();
    this.support = 0;
    this.frequentSize1Subgraphs = [];
    this.frequentSubgraphs = [];
    this.minSupport = minSupport;
    this.top = top;
    this.directed = directed;
    this.counter = 0;
    // TODO? timestamp = {}
    this.maxNodeNum = maxNodeNum;
    this.minNodeNum = minNodeNum;
    this.verbose = verbose;
    if (this.maxNodeNum < this.minNodeNum) this.maxNodeNum = this.minNodeNum;
    this.reportDF = []; // matrix
  }

  findForwardRootEdges(graph: Graph, fromNode: Node): Edge[] {
    const result: Edge[] = [];
    const nodeMap = graph.nodeMap;
    fromNode.edges.forEach((edge) => {
      if (this.directed || fromNode.label <= nodeMap[edge.to].label)
        result.push(edge);
    });

    return result;
  }

  findBackwardEdge(
    graph: Graph,
    edge1: Edge,
    edge2: Edge,
    history: History
  ): Edge {
    if (!this.directed && edge1 === edge2) return null;
    const nodeMap = graph.nodeMap;
    const edge2To = nodeMap[edge2.to];
    const edge2ToEdges = edge2To.edges;
    const edgeLength = edge2ToEdges.length;
    for (let i = 0; i < edgeLength; i++) {
      const edge = edge2ToEdges[i];
      if (history.hasEdge(edge) || edge.to !== edge1.from) continue;
      if (!this.directed) {
        if (
          edge1.label < edge.label ||
          (edge1.label === edge.label &&
            nodeMap[edge1.to].label <= nodeMap[edge2.to].label)
        ) {
          return edge;
        }
      } else {
        if (
          nodeMap[edge1.from].label < nodeMap[edge2.to].label ||
          (nodeMap[edge1.from].label === nodeMap[edge2.to].label &&
            edge1.label <= edge.label)
        ) {
          return edge;
        }
      }
    }
    return null;
  }

  findForwardPureEdges(
    graph: Graph,
    rightmostEdge: Edge,
    minNodeLabel: string,
    history: History
  ): Edge[] {
    const result = [];
    const rightmostEdgeToId = rightmostEdge.to;
    const edges = graph.nodeMap[rightmostEdgeToId].edges;
    const edgeLength = edges.length;
    for (let i = 0; i < edgeLength; i++) {
      const edge = edges[i];
      const toNode = graph.nodeMap[edge.to];
      if (minNodeLabel <= toNode.label && !history.hasNode(toNode)) {
        result.push(edge);
      }
    }
    return result;
  }

  findForwardRmpathEdges(
    graph: Graph,
    rightmostEdge: Edge,
    minNodeLabel: string,
    history: History
  ): Edge[] {
    const result = [];
    const nodeMap = graph.nodeMap;
    const toNodeLabel = nodeMap[rightmostEdge.to].label;
    const fromNode = nodeMap[rightmostEdge.from];
    const edges = fromNode.edges;
    const edgeLength = edges.length;
    for (let i = 0; i < edgeLength; i++) {
      const edge = edges[i];
      const newToNodeLabel = nodeMap[edge.to].label;
      if (
        rightmostEdge.to === edge.to ||
        minNodeLabel > newToNodeLabel ||
        history.hasNode(nodeMap[edge.to])
      ) {
        continue;
      }
      if (
        rightmostEdge.label < edge.label ||
        (rightmostEdge.label === edge.label && toNodeLabel <= newToNodeLabel)
      ) {
        result.push(edge);
      }
    }
    return result;
  }

  getSupport(projected: PDFS[]): number {
    const graphMap: { [key: number]: boolean } = {};
    projected.forEach((pro) => {
      if (!graphMap[pro.graphId]) graphMap[pro.graphId] = true;
    });
    return Object.keys(graphMap).length;
  }

  findMinLabel(obj: Root): {
    nodeLabel1?: string;
    edgeLabel: string;
    nodeLabel2?: string;
  } {
    let minLabel: { nodeLabel1: string; edgeLabel: string; nodeLabel2: string };
    Object.keys(obj).forEach((nodeEdgeNodeLabel) => {
      const { nodeLabel1, edgeLabel, nodeLabel2 } = obj[nodeEdgeNodeLabel];
      if (!minLabel) {
        minLabel = {
          nodeLabel1,
          edgeLabel,
          nodeLabel2,
        };
        return;
      }
      if (
        nodeLabel1 < minLabel.nodeLabel1 ||
        (nodeLabel1 === minLabel.nodeLabel1 &&
          edgeLabel < minLabel.edgeLabel) ||
        (nodeLabel1 === minLabel.nodeLabel1 &&
          edgeLabel === minLabel.edgeLabel &&
          nodeLabel2 < minLabel.nodeLabel2)
      ) {
        minLabel = {
          nodeLabel1,
          edgeLabel,
          nodeLabel2,
        };
      }
    });
    return minLabel;
  }

  isMin() {
    const dfsCode = this.dfsCode;
    if (this.verbose) console.log('isMin checking', dfsCode);
    if (dfsCode.dfsEdgeList.length === 1) return true;
    const directed = this.directed;
    const graph = dfsCode.toGraph(VACANT_GRAPH_ID, directed);
    const nodeMap = graph.nodeMap;
    const dfsCodeMin = new DFScode();
    const root: Root = {};
    graph.nodes.forEach((node) => {
      const forwardEdges = this.findForwardRootEdges(graph, node);
      forwardEdges.forEach((edge) => {
        let otherNode = nodeMap[edge.to];
        const nodeEdgeNodeLabel = `${node.label}-${edge.label}-${otherNode.label}`;
        if (!root[nodeEdgeNodeLabel])
          root[nodeEdgeNodeLabel] = {
            projected: [],
            nodeLabel1: node.label,
            edgeLabel: edge.label,
            nodeLabel2: otherNode.label,
          };
        const pdfs: PDFS = {
          graphId: graph.id,
          edge,
          preNode: null,
        };
        root[nodeEdgeNodeLabel].projected.push(pdfs);
      });
    });

    // 比较 root 中每一项的 nodeEdgeNodeLabel 大小，按照 nodeLabel1、edgeLabe、nodeLabel2 的顺序比较
    let minLabel = this.findMinLabel(root); // line 419
    if (!minLabel) return;
    dfsCodeMin.dfsEdgeList.push(
      new DFSedge(
        0,
        1,
        minLabel.nodeLabel1,
        minLabel.edgeLabel,
        minLabel.nodeLabel2
      )
    );

    const projectIsMin = (projected: PDFS[]): any => {
      // right most path
      const rmpath = dfsCodeMin.buildRmpath();
      const minNodeLabel =
        dfsCodeMin.dfsEdgeList[0].nodeEdgeNodeLabel.nodeLabel1;
      const maxToC = dfsCodeMin.dfsEdgeList[rmpath[0]].toNode; // node id

      const backwardRoot: Root = {};
      let flag = false,
        newTo = 0;
      let end = directed ? -1 : 0;
      for (let i = rmpath.length - 1; i > end; i--) {
        if (flag) break;
        // line 435
        projected.forEach((p) => {
          const history = new History(p);
          const backwardEdge = this.findBackwardEdge(
            graph,
            history.edges[rmpath[i]],
            history.edges[rmpath[0]],
            history
          );
          if (backwardEdge) {
            // Line 441
            if (!backwardRoot[backwardEdge.label]) {
              backwardRoot[backwardEdge.label] = {
                projected: [],
                edgeLabel: backwardEdge.label,
              };
            }
            backwardRoot[backwardEdge.label].projected.push({
              graphId: graph.id,
              edge: backwardRoot,
              preNode: p,
            });
            newTo = dfsCodeMin.dfsEdgeList[rmpath[i]].fromNode;
            flag = true;
          }
        });
      }

      if (flag) {
        const minBackwardEdgeLabel = this.findMinLabel(backwardRoot);
        dfsCodeMin.dfsEdgeList.push(
          new DFSedge(
            maxToC,
            newTo,
            VACANT_NODE_LABEL,
            minBackwardEdgeLabel.edgeLabel,
            VACANT_NODE_LABEL
          )
        );
        const idx = dfsCodeMin.dfsEdgeList.length - 1;
        if (this.dfsCode.dfsEdgeList[idx] !== dfsCodeMin.dfsEdgeList[idx])
          return false;
        return projectIsMin(
          backwardRoot[minBackwardEdgeLabel.edgeLabel].projected
        );
      }
      const forwardRoot: Root = {};
      flag = false;
      let newFrom = 0;
      projected.forEach((p) => {
        const history = new History(p);
        const forwardPureEdges = this.findForwardPureEdges(
          graph,
          history.edges[rmpath[0]],
          minNodeLabel,
          history
        );
        if (forwardPureEdges.length > 0) {
          flag = true;
          newFrom = maxToC;
          forwardPureEdges.forEach((edge) => {
            const key = `${edge.label}-${nodeMap[edge.to].label}`;
            if (!forwardRoot[key])
              forwardRoot[key] = {
                projected: [],
                edgeLabel: edge.label,
                nodeLabel2: nodeMap[edge.to].label,
              };
            forwardRoot[key].projected.push({
              graphId: graph.id,
              edge,
              preNode: p,
            });
          });
        }
      });

      const pathLength = rmpath.length;
      for (let i = 0; i < pathLength; i++) {
        if (flag) break;
        const value = rmpath[i];
        projected.forEach((p) => {
          const history = new History(p);
          const forwardRmpathEdges = this.findForwardRmpathEdges(
            graph,
            history.edges[value],
            minNodeLabel,
            history
          );
          if (forwardRmpathEdges.length > 0) {
            flag = true;
            newFrom = dfsCodeMin.dfsEdgeList[value].fromNode;
            forwardRmpathEdges.forEach((edge) => {
              const key = `${edge.label}-${nodeMap[edge.to].label}`;
              if (!forwardRoot[key])
                forwardRoot[key] = {
                  projected: [],
                  edgeLabel: edge.label,
                  nodeLabel2: nodeMap[edge.to].label,
                };
              forwardRoot[key].projected.push({
                graphId: graph.id,
                edge,
                preNode: p,
              });
            });
          }
        });
      }

      if (!flag) return true;

      const forwardMinEdgeNodeLabel = this.findMinLabel(forwardRoot);
      dfsCodeMin.dfsEdgeList.push(
        new DFSedge(
          newFrom,
          maxToC + 1,
          VACANT_NODE_LABEL,
          forwardMinEdgeNodeLabel.edgeLabel,
          forwardMinEdgeNodeLabel.nodeLabel2
        )
      );
      const idx = dfsCodeMin.dfsEdgeList.length - 1;
      if (dfsCode.dfsEdgeList[idx] !== dfsCodeMin.dfsEdgeList[idx])
        return false;
      return projectIsMin(
        forwardRoot[
          `${forwardMinEdgeNodeLabel.edgeLabel}-${forwardMinEdgeNodeLabel.nodeLabel2}`
        ].projected
      );
    };
    const key = `${minLabel.nodeLabel1}-${minLabel.edgeLabel}-${minLabel.nodeLabel2}`;
    return projectIsMin(root[key].projected);
  }

  report() {
    if (this.dfsCode.getNodeNum() < this.minNodeNum) return;
    this.counter++;
    const graph = this.dfsCode.toGraph(this.counter, this.directed);
    this.frequentSubgraphs.push(clone(graph));
  }

  subGraphMining(projected: PDFS[]) {
    const support = this.getSupport(projected);
    if (support < this.minSupport) return;
    if (!this.isMin()) return;
    this.report();

    const nodeNum = this.dfsCode.getNodeNum();
    const rmpath = this.dfsCode.buildRmpath();
    const maxToC = this.dfsCode.dfsEdgeList[rmpath[0]].toNode;
    const minNodeLabel =
      this.dfsCode.dfsEdgeList[0].nodeEdgeNodeLabel.nodeLabel1;

    const forwardRoot: Root = {};
    const backwardRoot: Root = {};

    projected.forEach((p) => {
      const graph = this.graphs[p.graphId];
      const nodeMap = graph.nodeMap;
      const history = new History(p);
      // backward Line 526
      for (let i = rmpath.length - 1; i >= 0; i--) {
        const backwardEdge = this.findBackwardEdge(
          graph,
          history.edges[rmpath[i]],
          history.edges[rmpath[0]],
          history
        );
        if (backwardEdge) {
          const key = `${this.dfsCode.dfsEdgeList[rmpath[i]].fromNode}-${
            backwardEdge.label
          }`;
          if (!backwardRoot[key])
            backwardRoot[key] = {
              projected: [],
              toNodeId: this.dfsCode.dfsEdgeList[rmpath[i]].fromNode,
              edgeLabel: backwardEdge.label,
            };
          backwardRoot[key].projected.push({
            graphId: p.graphId,
            edge: backwardEdge,
            preNode: p,
          });
        }
      }

      // pure forward
      if (nodeNum >= this.maxNodeNum) return;
      const forwardPureEdges = this.findForwardPureEdges(
        graph,
        history.edges[rmpath[0]],
        minNodeLabel,
        history
      );
      forwardPureEdges.forEach((edge) => {
        const key = `${maxToC}-${edge.label}-${nodeMap[edge.to].label}`;
        if (!forwardRoot[key])
          forwardRoot[key] = {
            projected: [],
            fromNodeId: maxToC,
            edgeLabel: edge.label,
            nodeLabel2: nodeMap[edge.to].label,
          };
        forwardRoot[key].projected.push({
          graphId: p.graphId,
          edge,
          preNode: p,
        });
      });

      // rmpath forward
      for (let i = 0; i < rmpath.length; i++) {
        const forwardRmpathEdges = this.findForwardRmpathEdges(
          graph,
          history.edges[rmpath[i]],
          minNodeLabel,
          history
        );
        forwardRmpathEdges.forEach((edge) => {
          const key = `${this.dfsCode.dfsEdgeList[rmpath[i]].fromNode}-${
            edge.label
          }-${nodeMap[edge.to].label}`;
          if (!forwardRoot[key])
            forwardRoot[key] = {
              projected: [],
              fromNodeId: this.dfsCode.dfsEdgeList[rmpath[i]].fromNode,
              edgeLabel: edge.label,
              nodeLabel2: nodeMap[edge.to].label,
            };
          forwardRoot[key].projected.push({
            graphId: p.graphId,
            edge,
            preNode: p,
          });
        });
      }
    });

    // backward
    Object.keys(backwardRoot).forEach((key) => {
      const { toNodeId, edgeLabel } = backwardRoot[key];
      this.dfsCode.dfsEdgeList.push(
        new DFSedge(maxToC, toNodeId, '-1', edgeLabel, '-1')
      );
      this.subGraphMining(backwardRoot[key].projected);
      this.dfsCode.dfsEdgeList.pop();
    });

    // forward
    Object.keys(forwardRoot).forEach((key) => {
      const { fromNodeId, edgeLabel, nodeLabel2 } = forwardRoot[key];
      this.dfsCode.dfsEdgeList.push(
        new DFSedge(
          fromNodeId,
          maxToC + 1,
          VACANT_NODE_LABEL,
          edgeLabel,
          nodeLabel2
        )
      );
      this.subGraphMining(forwardRoot[key].projected);
      this.dfsCode.dfsEdgeList.pop();
    });
  }

  generate1EdgeFrequentSubGraphs() {
    const graphs = this.graphs;
    const directed = this.directed;
    const minSupport = this.minSupport;
    const frequentSize1Subgraphs = this.frequentSize1Subgraphs;
    let nodeLabelCounter: { [key: string]: number } = {},
      nodeEdgeNodeCounter: { [key: string]: number } = {};
    // Save the relationship map between each graph and its respective nodes. The key format is "graphKey-nodeType".
    const nodeLableCounted: {
      [key: string]: { graphKey: string; label: string };
    } = {};
    // Save the relationship map between each graph and its respective edges. The key format is "graphKey-fromNodeType-edgeType-toNodeType".
    const nodeEdgeNodeLabelCounted: {
      [key: string]: {
        graphId: string;
        nodeLabel1: string;
        edgeLabel: string;
        nodeLabel2: string;
      };
    } = {};
    Object.keys(graphs).forEach((key) => {
      const graph = graphs[Number(key)];
      const nodeMap = graph.nodeMap;
      // Traverse the nodes and record the corresponding graph and label for each node in nodeLabelCounted.
      graph.nodes.forEach((node, i) => {
        const nodeLabel = node.label;
        const graphNodeKey = `${key}-${nodeLabel}`;
        if (!nodeLableCounted[graphNodeKey]) {
          let counter = nodeLabelCounter[nodeLabel] || 0;
          counter++;
          nodeLabelCounter[nodeLabel] = counter;
        }
        nodeLableCounted[graphNodeKey] = {
          graphKey: key,
          label: nodeLabel,
        };
        // Traverse all the edges of the node and record the relationship between each graph and its respective edge in nodeEdgeNodeLabelCounted.
        node.edges.forEach((edge) => {
          let nodeLabel1 = nodeLabel;
          let nodeLabel2 = nodeMap[edge.to].label;
          if (!directed && nodeLabel1 > nodeLabel2) {
            const tmp = nodeLabel2;
            nodeLabel2 = nodeLabel1;
            nodeLabel1 = tmp;
          }
          const edgeLabel = edge.label;

          const graphNodeEdgeNodeKey = `${key}-${nodeLabel1}-${edgeLabel}-${nodeLabel2}`;
          const nodeEdgeNodeKey = `${nodeLabel1}-${edgeLabel}-${nodeLabel2}`;

          if (!nodeEdgeNodeCounter[nodeEdgeNodeKey]) {
            let counter = nodeEdgeNodeCounter[nodeEdgeNodeKey] || 0;
            counter++;
            nodeEdgeNodeCounter[nodeEdgeNodeKey] = counter; // Line281
          }
          nodeEdgeNodeLabelCounted[graphNodeEdgeNodeKey] = {
            graphId: key,
            nodeLabel1,
            edgeLabel,
            nodeLabel2,
          };
        });
      });
    });

    // Calculate the frequent nodes.
    Object.keys(nodeLabelCounter).forEach((label) => {
      const count = nodeLabelCounter[label];
      if (count < minSupport) return;
      const g = { nodes: [], edges: [] } as GraphData;
      g.nodes.push({
        id: '0',
        data: { label },
      });
      frequentSize1Subgraphs.push(g);
      // if (minNodeNum <= 1) reportSize1 TODO
    });

    return frequentSize1Subgraphs;
  }

  run() {
    // -------- First step: _generate_1edge_frequent_subgraphs - Frequent individual nodes. -------
    this.frequentSize1Subgraphs = this.generate1EdgeFrequentSubGraphs();

    if (this.maxNodeNum < 2) return;

    const graphs = this.graphs;
    const directed = this.directed;

    // PDFS array map
    const root: Root = {};
    Object.keys(graphs).forEach((graphId: any) => {
      const graph = graphs[graphId];
      const nodeMap = graph.nodeMap;
      graph.nodes.forEach((node) => {
        const forwardRootEdges = this.findForwardRootEdges(graph, node);
        forwardRootEdges.forEach((edge) => {
          let toNode = nodeMap[edge.to];
          const nodeEdgeNodeLabel = `${node.label}-${edge.label}-${toNode.label}`;
          if (!root[nodeEdgeNodeLabel])
            root[nodeEdgeNodeLabel] = {
              projected: [],
              nodeLabel1: node.label as string,
              edgeLabel: edge.label as string,
              nodeLabel2: toNode.label as string,
            };
          const pdfs: PDFS = {
            graphId,
            edge,
            preNode: null,
          };
          root[nodeEdgeNodeLabel].projected.push(pdfs);
        });
      });
    });

    Object.keys(root).forEach((nodeEdgeNodeLabel) => {
      const { projected, nodeLabel1, edgeLabel, nodeLabel2 } =
        root[nodeEdgeNodeLabel];

      this.dfsCode.dfsEdgeList.push(
        new DFSedge(0, 1, nodeLabel1, edgeLabel, nodeLabel2)
      );
      this.subGraphMining(projected);
      this.dfsCode.dfsEdgeList.pop();
    });
  }
}

const formatGraphs = (
  graphs: GraphDataMap,
  directed: boolean,
  nodeLabelProp: string,
  edgeLabelProp: string
): GraphMap => {
  const result: { [key: number]: Graph } = {};
  Object.keys(graphs).forEach((key, i) => {
    const graph = graphs[key];
    const fGraph = new Graph(i, true, directed);
    const nodeIdxMap: { [key: string]: number } = {};
    graph.nodes.forEach((node, j) => {
      fGraph.addNode(j, node.data[nodeLabelProp] as string);
      nodeIdxMap[node.id] = j;
    });
    graph.edges.forEach((edge, k) => {
      const sourceIdx = nodeIdxMap[edge.source];
      const targetIdx = nodeIdxMap[edge.target];
      fGraph.addEdge(
        -1,
        sourceIdx,
        targetIdx,
        edge.data[edgeLabelProp] as string
      );
    });
    if (fGraph && fGraph.getNodeNum()) result[fGraph.id] = fGraph;
  });
  return result;
};

const toGraphDatas = (
  graphs: Graph[],
  nodeLabelProp: string,
  edgeLabelProp: string
) => {
  const result: GraphData[] = [];
  graphs.forEach((graph) => {
    const graphData = { nodes: [], edges: [] } as GraphData;
    graph.nodes.forEach((node) => {
      graphData.nodes.push({
        id: `${node.id}`,
        data: { [nodeLabelProp]: node.label },
      });
    });
    graph.edges.forEach((edge) => {
      graphData.edges.push({
        id: uniqueId(),
        source: `${edge.from}`,
        target: `${edge.to}`,
        data: {
          [edgeLabelProp]: edge.label,
        },
      });
    });
    result.push(graphData);
  });
  return result;
};

interface Props {
  graphs: GraphDataMap; // Graph data
  minSupport: number; // Algorithm parameter, minimum support count specified based on the number of graphs in the 'graphs' property
  directed?: boolean; // Whether the graphs are directed. Default is false.
  nodeLabelProp?: string; // Property name for the node type
  edgeLabelProp?: string; // Property name for the edge type
  minNodeNum?: number; // Minimum number of nodes in each subgraph. Default is 1.
  maxNodeNum?: number; // Maximum number of nodes in each subgraph. Default is 4.
  top?: number; // Number of top frequent subgraphs to return. Default is 10.
  verbose?: boolean; // Whether to display verbose output.
}

const DEFAULT_LABEL_NAME = 'cluster';

/**
 * gSpan is a frequent graph mining algorithm used to discover frequent subgraphs in graph data.
 * @param params
 */
const gSpan = (params: Props): GraphData[] => {
  // ------- Convert the map of graph data, GraphData, into a specific format. -------
  const {
    graphs,
    directed = false,
    nodeLabelProp = DEFAULT_LABEL_NAME,
    edgeLabelProp = DEFAULT_LABEL_NAME,
  } = params;
  const formattedGraphs = formatGraphs(
    graphs,
    directed,
    nodeLabelProp,
    edgeLabelProp
  );
  const { minSupport, maxNodeNum, minNodeNum, verbose, top } = params;

  // ------- Initialize and execute the algorithm. -------
  const algoParams = {
    graphs: formattedGraphs,
    minSupport,
    maxNodeNum,
    minNodeNum,
    top,
    verbose,
    directed,
  };
  const calculator = new GSpan(algoParams);
  calculator.run();

  const result = toGraphDatas(
    calculator.frequentSubgraphs,
    nodeLabelProp,
    edgeLabelProp
  );
  return result;
};

export default gSpan;
