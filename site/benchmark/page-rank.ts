import pagerank from "graphology-metrics/centrality/pagerank";
import { WebGPUGraph } from "../../packages/graph-gpu/src";

interface Options {
  alpha: number;
  maxIterations: number;
  tolerance: number;
}

const DEFAULT_OPTIONS: Options = {
  alpha: 0.85,
  maxIterations: 1000,
  tolerance: 1e-5,
};

export async function graphology(graph: any, options: Partial<Options>) {
  const result = pagerank(graph, {
    ...DEFAULT_OPTIONS,
    ...options,
    getEdgeWeight: "weight",
  });

  const r = Object.keys(result).map((key) => ({
    id: key,
    score: result[key],
  }));

  return r.sort((a, b) => b.score - a.score).slice(0, 10); // {id: 'Valjean', score: 0.1}
}

export async function webgpu(
  graph: any,
  options: Partial<Options>,
  webgpuGraph: WebGPUGraph
) {
  const { alpha, tolerance, maxIterations } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };
  const result = await webgpuGraph.pageRank(
    graph,
    tolerance,
    alpha,
    maxIterations
  );

  return result.slice(0, 10); // {id: 'Valjean', score: 0.1}
}
