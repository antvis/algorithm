
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
  }
}
