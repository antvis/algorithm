import syncAlgorithm from './syncIndex';
import asyncAlgorithm from './asyncIndex';

export type Matrix = number[];

export interface NodeConfig {
  id: string;
  clusterId?: string;
  [key: string]: any;
}

export interface EdgeConfig {
  source: string;
  target: string;
  weight?: number;
  [key: string]: any;
}

export interface GraphData {
  nodes?: NodeConfig[];
  edges?: EdgeConfig[];
}

export interface Cluster {
  id: string;
  nodes: NodeConfig[];
  sumTot?: number;
}

export interface ClusterData {
  clusters: Cluster[];
  clusterEdges: EdgeConfig[];
}

export interface ClusterMap {
  [key: string]: Cluster;
}

// 图算法回调方法接口定义
export interface IAlgorithmCallbacks {
  enter?: (param: { current: string; previous: string }) => void;
  leave?: (param: { current: string; previous?: string }) => void;
  allowTraversal?: (param: { previous?: string; current?: string; next: string }) => boolean;
}

export interface DegreeType {
  [key: string]: {
    degree: number;
    inDegree: number;
    outDegree: number;
  };
}

export interface OptionBase {
  /**  是否有向图，默认为 false */
  graphData: GraphData;
}

export interface AsyncOptionBase {
  /**  WebWorker 算法文件URL地址 */
  workerScirptURL?: string;
}

export type IAsyncAlgorithm = typeof asyncAlgorithm;
export type ISyncAlgorithm = typeof syncAlgorithm;

export type IAlgorithm = IAsyncAlgorithm & ISyncAlgorithm;
