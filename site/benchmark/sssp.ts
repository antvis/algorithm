import { Graph } from "@antv/graphlib";
import { dijkstra } from "graphology-shortest-path";
import { findShortestPath } from "../../packages/graph";
import { WebGPUGraph } from "../../packages/graph-gpu";
import { Threads } from "../../packages/graph-wasm";
import { graph2Edgelist } from "./util";

export async function graphology(graph: any, source: string) {
  const result = dijkstra.singleSource(graph, source, "weight");
  return Object.keys(result).map((key) => ({ key, path: result[key] }))
    .filter(({ path }) => path.length > 0)
    .slice(0, 3);
}

export async function antv(graph: Graph<any, any>, source: string) {
  const nodes = graph.getAllNodes();
  const paths: any[] = [];
  nodes.forEach((node) => {
    const p = findShortestPath(graph, source, node.id);
    paths.push(p);
  });
  return paths.slice(0, 3);
}

export async function webgpu(
  graph: Graph<any, any>,
  source: string,
  webgpuGraph: WebGPUGraph
) {
  const result = await webgpuGraph.sssp(graph, source, "weight");

  return result.filter((r) => r.distance !== 1000000).slice(0, 3);
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
  return paths.slice(0, 3);
}