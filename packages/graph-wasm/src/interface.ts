export interface PageRankParams {
  maxIterations?: number;
  alpha?: number;
  tolerance?: number;
  /**
   * [source, target]
   */
  edgelist: [number, number][];
}

export interface SSSPParams {
  startNode?: number;
  delta?: number;
  /**
   * [source, target, weight]
   */
  edgelist: [number, number, number][];
}

export interface Threads {
  pageRank: (options: PageRankParams) => Promise<number[]>;
  sssp: (options: SSSPParams) => Promise<{ ranks: number[] }>;
}
