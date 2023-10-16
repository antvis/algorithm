import { ID, Edge, Graph as IGraph, Node, PlainObject } from '@antv/graphlib';

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
  nodeToCluster: Map<ID, string>;
}

export interface ClusterMap {
  [key: string]: Cluster;
}


export type Graph = IGraph<NodeData, EdgeData>;

export type Matrix = number[];
export interface IAlgorithmCallbacks {
  enter?: (param: { current: ID; previous: ID }) => void;
  leave?: (param: { current: ID; previous?: ID }) => void;
  allowTraversal?: (param: {
    previous?: ID;
    current?: ID;
    next: ID;
  }) => boolean;
}

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
