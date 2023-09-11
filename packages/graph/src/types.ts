import { Edge, Graph as IGraph, Node, PlainObject } from "@antv/graphlib";

// 数据集中属性/特征值分布的map
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
}

export interface ClusterMap {
  [key: string]: Cluster;
}

export type Graph = IGraph<NodeData, EdgeData>;

export type Matrix = number[];
export interface IAlgorithmCallbacks {
  enter?: (param: { current: NodeID; previous: NodeID }) => void;
  leave?: (param: { current: NodeID; previous?: NodeID }) => void;
  allowTraversal?: (param: { previous?: NodeID; current?: NodeID; next: NodeID }) => boolean;
}

export type NodeID = string | number;
export interface NodeSimilarity extends Node<{ [key: string]: any }> {
  cosineSimilarity?: number;
}