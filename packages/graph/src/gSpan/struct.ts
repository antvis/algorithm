export const VACANT_EDGE_ID = -1;
export const VACANT_NODE_ID = -1;
export const VACANT_EDGE_LABEL = '-1';
export const VACANT_NODE_LABEL = '-1';
export const VACANT_GRAPH_ID = -1;
export const AUTO_EDGE_ID = '-1';

export class Edge {
  public id: number;
  public from: number;
  public to: number;
  public label: string;

  constructor(
    id = VACANT_EDGE_ID,
    from = VACANT_NODE_ID,
    to = VACANT_NODE_ID,
    label = VACANT_EDGE_LABEL
  ) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.label = label;
  }
}

export class Node {
  public id: number;
  public from: number;
  public to: number;
  public label: string;
  public edges: Edge[];
  public edgeMap: { [key: number]: Edge };

  constructor(id = VACANT_NODE_ID, label = VACANT_NODE_LABEL) {
    this.id = id;
    this.label = label;
    this.edges = [];
    this.edgeMap = {};
  }

  addEdge(edge: Edge) {
    this.edges.push(edge);
    this.edgeMap[edge.id] = edge;
  }
}

export class Graph {
  public id: number;
  public from: number;
  public to: number;
  public label: string;
  public edgeIdAutoIncrease: boolean;
  public nodes: Node[];
  public edges: Edge[];
  public nodeMap: { [key: number]: Node };
  public edgeMap: { [key: number]: Edge };
  public nodeLabelMap: { [key: string]: number[] }; // key is label，value is the array of nodes' ids
  public edgeLabelMap: { [key: string]: Edge[] };
  private counter: number; // The ID used for generating the graph, incremented automatically.
  public directed: boolean;

  constructor(
    id = VACANT_NODE_ID,
    edgeIdAutoIncrease = true,
    directed = false
  ) {
    this.id = id;
    this.edgeIdAutoIncrease = edgeIdAutoIncrease;
    this.edges = [];
    this.nodes = [];
    this.nodeMap = {};
    this.edgeMap = {};
    this.nodeLabelMap = {};
    this.edgeLabelMap = {};
    this.counter = 0;
    this.directed = directed;
  }

  getNodeNum() {
    return this.nodes.length;
  }

  addNode(id: number, label: string) {
    if (this.nodeMap[id]) return;
    const node = new Node(id, label);
    this.nodes.push(node);
    this.nodeMap[id] = node;
    if (!this.nodeLabelMap[label]) this.nodeLabelMap[label] = [];
    this.nodeLabelMap[label].push(id);
  }

  addEdge(id: number, from: number, to: number, label: string) {
    if (this.edgeIdAutoIncrease || id === undefined) id = this.counter++;
    if (this.nodeMap[from] && this.nodeMap[to] && this.nodeMap[to].edgeMap[id])
      return;
    const edge = new Edge(id, from, to, label);
    this.edges.push(edge);
    this.edgeMap[id] = edge;

    this.nodeMap[from].addEdge(edge);

    if (!this.edgeLabelMap[label]) this.edgeLabelMap[label] = [];
    this.edgeLabelMap[label].push(edge);

    if (!this.directed) {
      const rEdge = new Edge(id, to, from, label);
      this.nodeMap[to].addEdge(rEdge);
      this.edgeLabelMap[label].push(rEdge);
    }
  }
}
