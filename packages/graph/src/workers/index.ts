import {
  GraphData,
  DegreeType,
  Matrix,
  IAlgorithmCallbacks,
  ClusterData,
  EdgeConfig,
} from '../types';
import createWorker from './createWorker';
import { ALGORITHM } from './constant';

/**
 * @param graphData 图数据
 * @param directed 是否为有向图
 */
const getAdjMatrixAsync = (graphData: GraphData, directed?: boolean) =>
  createWorker<Matrix[]>(ALGORITHM.getAdjMatrix)(...[graphData, directed]);

/**
 * 图的连通分量
 * @param graphData 图数据
 * @param directed 是否为有向图
 */
const connectedComponentAsync = (graphData: GraphData, directed?: boolean) =>
  createWorker<NodeConfig[][]>(ALGORITHM.connectedComponent)(...[graphData, directed]);

/**
 * 获取节点的度
 * @param graphData 图数据
 */
const getDegreeAsync = (graphData: GraphData) =>
  createWorker<DegreeType>(ALGORITHM.getDegree)(graphData);

/**
 * 获取节点的入度
 * @param graphData 图数据
 * @param nodeId 节点ID
 */
const getInDegreeAsync = (graphData: GraphData, nodeId: string) =>
  createWorker<DegreeType>(ALGORITHM.getInDegree)(graphData, nodeId);

/**
 * 获取节点的出度
 * @param graphData 图数据
 * @param nodeId 节点ID
 */
const getOutDegreeAsync = (graphData: GraphData, nodeId: string) =>
  createWorker<DegreeType>(ALGORITHM.getOutDegree)(graphData, nodeId);

/**
 * 检测图中的 Cycle
 * @param graphData 图数据
 */
const detectCycleAsync = (graphData: GraphData) =>
  createWorker<{
    [key: string]: string;
  }>(ALGORITHM.detectCycle)(graphData);

/**
 * Dijkstra's algorithm, See {@link https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm}
 * @param graphData 图数据
 */
const dijkstraAsync = (
  graphData: GraphData,
  source: string,
  directed?: boolean,
  weightPropertyName?: string,
) =>
  createWorker<{
    length: number;
    path: any;
    allPaths: any;
  }>(ALGORITHM.dijkstra)(...[graphData, source, directed, weightPropertyName]);

/**
 * 查找两点之间的所有路径
 * @param graphData 图数据
 * @param start 路径起始点ID
 * @param end 路径终点ID
 * @param directed 是否为有向图
 */
const findAllPathAsync = (graphData: GraphData, start: string, end: string, directed?: boolean) =>
  createWorker<string[][]>(ALGORITHM.findAllPath)(...[graphData, start, end, directed]);

/**
 * 查找两点之间的所有路径
 * @param graphData 图数据
 * @param start 路径起始点ID
 * @param end 路径终点ID
 * @param directed 是否为有向图
 * @param weightPropertyName 边权重的属名称，若数据中没有权重，则默认每条边权重为 1
 */
const findShortestPathAsync = (
  graphData: GraphData,
  start: string,
  end: string,
  directed?: boolean,
  weightPropertyName?: string,
) =>
  createWorker<{
    length: number;
    path: any;
    allPaths: any;
  }>(ALGORITHM.findShortestPath)(...[graphData, start, end, directed, weightPropertyName]);

/**
 * Floyd–Warshall algorithm, See {@link https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm}
 * @param graphData 图数据
 * @param directed 是否为有向图
 */
const floydWarshallAsync = (graphData: GraphData, directed?: boolean) =>
  createWorker<Matrix[]>(ALGORITHM.floydWarshall)(...[graphData, directed]);

/**
 * 标签传播算法
 * @param graphData 图数据
 * @param directed 是否有向图，默认为 false
 * @param weightPropertyName 权重的属性字段
 * @param maxIteration 最大迭代次数
 */
const labelPropagationAsync = (
  graphData: GraphData,
  directed: boolean,
  weightPropertyName: string,
  maxIteration: number,
) =>
  createWorker<ClusterData>(ALGORITHM.labelPropagation)(
    graphData,
    directed,
    weightPropertyName,
    maxIteration,
  );

/**
 * 社区发现 louvain 算法
 * @param graphData 图数据
 * @param directed 是否有向图，默认为 false
 * @param weightPropertyName 权重的属性字段
 * @param threshold
 */
const louvainAsync = (
  graphData: GraphData,
  directed: boolean,
  weightPropertyName: string,
  threshold: number,
) =>
  createWorker<ClusterData>(ALGORITHM.louvain)(graphData, directed, weightPropertyName, threshold);

/**
 * 最小生成树，See {@link https://en.wikipedia.org/wiki/Kruskal%27s_algorithm}
 * @param graph
 * @param weight 指定用于作为边权重的属性，若不指定，则认为所有边权重一致
 * @param algo 'prim' | 'kruskal' 算法类型
 * @return EdgeConfig[] 返回构成MST的边的数组
 */
const minimumSpanningTreeAsync = (graphData: GraphData, weight?: boolean, algo?: string) =>
  createWorker<EdgeConfig[]>(ALGORITHM.minimumSpanningTree)(...[graphData, weight, algo]);

/**
 * PageRank https://en.wikipedia.org/wiki/PageRank
 * refer: https://github.com/anvaka/ngraph.pagerank
 * @param graph
 * @param epsilon 判断是否收敛的精度值，默认 0.000001
 * @param linkProb 阻尼系数（dumping factor），指任意时刻，用户访问到某节点后继续访问该节点链接的下一个节点的概率，经验值 0.85
 */
const pageRankAsync = (graphData: GraphData, epsilon?: number, linkProb?: number) =>
  createWorker<{
    [key: string]: number;
  }>(ALGORITHM.pageRank)(...[graphData, epsilon, linkProb]);

/**
 * 获取指定节点的所有邻居
 * @param nodeId 节点 ID
 * @param edges 图中的所有边数据
 * @param type 邻居类型
 */
const getNeighborsAsync = (
  nodeId: string,
  edges: EdgeConfig[],
  type?: 'target' | 'source' | undefined,
) => createWorker<string[]>(ALGORITHM.getNeighbors)(...[nodeId, edges, type]);

export {
  getAdjMatrixAsync,
  connectedComponentAsync,
  getDegreeAsync,
  getInDegreeAsync,
  getOutDegreeAsync,
  detectCycleAsync,
  dijkstraAsync,
  findAllPathAsync,
  findShortestPathAsync,
  floydWarshallAsync,
  labelPropagationAsync,
  louvainAsync,
  minimumSpanningTreeAsync,
  pageRankAsync,
  getNeighborsAsync,
};
