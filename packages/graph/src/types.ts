import { Edge, Graph as IGraph, Node, PlainObject } from '@antv/graphlib';

// Map of attribute / eigenvalue distribution in dataset
export interface KeyValueMap {
  [key: string]: any[];
}

export interface NodeData extends PlainObject {
  clusterId?: string;
}

export interface EdgeData extends PlainObject {
  weight?: number;
}

export interface Cluster {
  id: string;
  nodes: Node<NodeData>[];
  sumTot?: number;
}

export interface ClusterData {
  clusters: Cluster[];
  clusterEdges: Edge<EdgeData>[];
  nodeToCluster: Map<NodeID, string>
}

export interface ClusterMap {
  [key: string]: Cluster;
}


export type Graph = IGraph<NodeData, EdgeData>;

export type Matrix = number[];
export interface IAlgorithmCallbacks {
  enter?: (param: { current: NodeID; previous: NodeID }) => void;
  leave?: (param: { current: NodeID; previous?: NodeID }) => void;
  allowTraversal?: (param: {
    previous?: NodeID;
    current?: NodeID;
    next: NodeID;
  }) => boolean;
}

export type NodeID = string | number;

export type NodeSimilarity = Node<PlainObject> & {
  data: {
    cosineSimilarity?: number;
  };
};

export type GraphData = {
  nodes: Node<NodeData>[];
  edges?: Edge<EdgeData>[];
};

export type INode = Node<NodeData>;
export type IEdge = Edge<EdgeData>;

export type IMSTAlgorithm = (graph: Graph, weightProps?: string) => IEdge[];
export interface IMSTAlgorithmOpt {
  'prim': IMSTAlgorithm;
  'kruskal': IMSTAlgorithm;
}

export enum DistanceType {
  EuclideanDistance = 'euclideanDistance',
}
