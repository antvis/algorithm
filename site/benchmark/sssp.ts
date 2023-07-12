import { Graph } from "@antv/graphlib";
import { dijkstra } from "graphology-shortest-path";
import { findShortestPath } from "../../packages/graph";
import { WebGPUGraph } from "../../packages/graph-gpu";
import { Threads } from "../../packages/graph-wasm";
import { graph2Edgelist } from "./util";

export async function graphology(graph: any, source: string) {
  return dijkstra.singleSource(graph, source, "weight");
}

export async function antv(graph: Graph<any, any>, source: string) {
  // findShortestPath(graph, source)
}

export async function webgpu(
  graph: Graph<any, any>,
  source: string,
  webgpuGraph: WebGPUGraph
) {
  const result = await webgpuGraph.sssp(graph, source, "weight");

  return result.filter((r) => r.distance !== 1000000);
}

export async function wasm(
  graph: Graph<any, any>,
  source: string,
  _: any,
  threads: Threads
): Promise<any> {
  const { edgelist, nodeIdxMap, idxNodeMap } = graph2Edgelist(graph, 'weight');
  const paths = await threads.sssp({
    startNode: nodeIdxMap[source],
    edgelist: edgelist as [number, number, number][],
  });
  console.log(paths);
  // const formatted = ranks.map((rank, i) => ({ id: idxNodeMap[i], score: rank }));
  // return format(formatted.sort((a, b) => b.score - a.score).slice(0, 10)); // {id: 'Valjean', score: 0.1}
}