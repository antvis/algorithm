import { Edge, Graph as IGraph, PlainObject } from '@antv/graphlib';

export interface NodeData extends PlainObject {}

export interface EdgeData extends PlainObject {
  weight?: number;
}

export type Graph = IGraph<NodeData, EdgeData>;

export interface CSC {
  V: number[];
  E: number[];
  I: number[];
  From: number[];
  To: number[];
  nodeId2IndexMap: Record<string, number>;
  edges: Edge<EdgeData>[];
}
