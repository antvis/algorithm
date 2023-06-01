import { dijkstra } from "graphology-shortest-path";
import { WebGPUGraph } from "../../packages/webgpu-graph/src";

export async function graphology(graph: any, source: string) {
  return dijkstra.singleSource(graph, source, "weight");
}

export async function webgpu(
  graph: any,
  source: string,
  webgpuGraph: WebGPUGraph
) {
  const result = await webgpuGraph.sssp(graph, source, "weight");

  return result.filter((r) => r.distance !== 1000000);
}
