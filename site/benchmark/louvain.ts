import { Graph, ID } from "@antv/graphlib";
import louvain from 'graphology-communities-louvain';
import { louvain as antvLouvain } from "../../packages/graph";
import { Threads } from "../../packages/graph-wasm";
import { graph2Edgelist } from "./util";

/**
 * @see https://graphology.github.io/standard-library/communities-louvain.html
 */
export async function graphology(graph: any) {
  const mapping = louvain(graph);
  const clusters: { id: number; count: number }[] = [];
  Object.keys(mapping).forEach((id) => {
    const clusterIdx = mapping[id];
    if (!clusters[clusterIdx]) {
      clusters[clusterIdx] = { id: clusterIdx, count: 0 };
    }
    clusters[clusterIdx].count++;
  });
  return clusters;
}

export async function antv(
  graph: Graph<any, any>,
) {
  const { clusters } = antvLouvain(graph, false, 'weight');
  return clusters.map(({ id, nodes }) => ({ id, count: nodes.length }));
}

export async function wasm(
  graph: Graph<any, any>,
  _: any,
  _2: any,
  threads: Threads
): Promise<any> {
  const { edgelist, idxNodeMap } = graph2Edgelist(graph, 'weight');
  const ranks = await threads.louvain({
    edgelist: edgelist as [number, number, number][]
  });
  console.log(ranks);
  return ranks;
  // const formatted = ranks.map((rank, i) => ({ id: idxNodeMap[i], score: rank }));
  // return format(formatted.sort((a, b) => b.score - a.score).slice(0, 10)); // {id: 'Valjean', score: 0.1}
}