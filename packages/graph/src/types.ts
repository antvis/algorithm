import { Graph as IGraph, PlainObject } from "@antv/graphlib";

export interface NodeData extends PlainObject {}

export interface EdgeData extends PlainObject {
  weight?: number;
}

export type Graph = IGraph<NodeData, EdgeData>;
