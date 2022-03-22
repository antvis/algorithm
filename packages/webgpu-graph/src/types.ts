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

export interface CSC {
  V: number[];
  E: number[];
  I: number[];
  From: number[];
  To: number[];
  nodeId2IndexMap: Record<string, number>;
  edges: EdgeConfig[];
}
