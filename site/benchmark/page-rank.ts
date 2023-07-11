import { Graph, ID } from "@antv/graphlib";
import pagerank from "graphology-metrics/centrality/pagerank";
import { pageRank } from "../../packages/graph";
import { WebGPUGraph } from "../../packages/graph-gpu";
import { Threads } from "../../packages/graph-wasm";

function format(records: { id: ID; score: number}[]) {
  return records.map(({ id, score }) => ({ id, score: score.toFixed(6) }));
}

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

  return format(r.sort((a, b) => b.score - a.score).slice(0, 10)); // {id: 'Valjean', score: 0.1}
}

export async function antv(
  graph: Graph<any, any>,
  options: Partial<Options>,) {
  const result = pageRank(graph, {
    ...DEFAULT_OPTIONS,
    ...options,
  });

  const r = Object.keys(result).map((key) => ({
    id: key,
    score: result[key],
  }));

  return format(r.sort((a, b) => b.score - a.score).slice(0, 10)); // {id: 'Valjean', score: 0.1}
}

export async function webgpu(
  graph: Graph<any, any>,
  options: Partial<Options>,
  webgpuGraph: WebGPUGraph
) {
  const result = await webgpuGraph.pageRank(
    graph,
    {
      ...DEFAULT_OPTIONS,
      ...options,
    }
  );

  return format(result.slice(0, 10)); // {id: 'Valjean', score: 0.1}
}

export async function wasm(
  graph: Graph<any, any>,
  options: Partial<Options>,
  _: any,
  threads: Threads
): Promise<any[]> {
  const edgelist: [number, number][] = [];
  const nodeIdxMap: Record<ID, number> = {};
  const idxNodeMap: Record<number, ID> = {};
  const edges = graph.getAllEdges();
  graph.getAllNodes().forEach((node, i) => {
    nodeIdxMap[node.id] = i;
    idxNodeMap[i] = node.id;
  });
  // convert graph to edgelist
  edges.forEach((edge) => {
    edgelist.push([nodeIdxMap[edge.source], nodeIdxMap[edge.target]]);
  });
  const ranks = await threads.pageRank({
    ...options,
    edgelist
  });
  const formatted = ranks.map((rank, i) => ({ id: idxNodeMap[i], score: rank }));
  return format(formatted.sort((a, b) => b.score - a.score).slice(0, 10)); // {id: 'Valjean', score: 0.1}
}