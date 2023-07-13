import { Edge, Graph as IGraph, Node, PlainObject } from "@antv/graphlib";

// 数据集中属性/特征值分布的map
export interface KeyValueMap {
  [key:string]: any[];
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