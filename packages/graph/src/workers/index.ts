import {
  AsyncOptionBase,
  ClusterData,
  Matrix,
  NodeConfig,
  DegreeType,
  IAlgorithmCallbacks,
  EdgeConfig,
  GraphData,
} from '../types';

import {
  IAdjMatrix,
  IConnectedComponent,
  IDegree,
  IInDegree,
  IOutDegree,
  IDetectCycle,
  IDetectCycleResult,
  IDetectAllCycles,
  ICycleItem,
  IDetectAllDirectedCycle,
  IDetectAllUndirectedCycle,
  IDijkstra,
  IDijkstraResult,
  IFindAllPath,
  IFindShortestPath,
  IFindShortestPathResult,
  IFloydWarshall,
  ILabelPropagation,
  ILouvain,
  IMinimumSpanningTree,
  IPagerank,
  IPagerankResult,
  INeighbors,
  IGADDI,
} from '../syncIndex';
import createWorker from './createWorker';
import { ALGORITHM } from './constant';

/**
 * 算法列表
  1	  getAdjMatrixAsync
  2	  connectedComponentAsync
  3	  getDegreeAsync
  4	  getInDegreeAsync
  5	  getOutDegreeAsync
  6	  detectCycle/detectDirectedCycleAsync
  7   detectAllCyclesAsync
  8   detectAllDirectedCycleAsync
  9   detectAllUndirectedCycleAsync
  10	dijkstraAsync
  11	findAllPathAsync
  12	findShortestPathAsync
  13	floydWarshallAsync
  14	labelPropagationAsync
  15	louvainAsync
  16	minimumSpanningTreeAsync
  17	pageRankAsync
  18	getNeighborsAsync
  19	GADDIAsync
 */

/**
 * 图的邻接矩阵
 * @param graphData 图数据
 * @param workerScirptURL WebWorker 算法文件URL地址
 * @param directed 是否有向图，默认为 false
 */
const getAdjMatrixAsync = ({ workerScirptURL, ...options }: IAdjMatrix & AsyncOptionBase) =>
  createWorker<Matrix[]>(ALGORITHM.getAdjMatrix, workerScirptURL)(options);

/**
 * 图的连通分量
 * @param graphData 图数据
 * @param directed 是否有向图，默认为 false
 */
const connectedComponentAsync = ({
  workerScirptURL,
  ...options
}: IConnectedComponent & AsyncOptionBase) =>
  createWorker<NodeConfig[][]>(ALGORITHM.connectedComponent, workerScirptURL)(options);

/**
 * 获取节点的度
 * @param graphData 图数据
 * @param workerScirptURL WebWorker 算法文件URL地址
 */
const getDegreeAsync = ({ workerScirptURL, ...options }: IDegree & AsyncOptionBase) =>
  createWorker<DegreeType>(ALGORITHM.getDegree, workerScirptURL)(options);

/**
 * 获取节点的入度
 * @param graphData 图数据
 * @param workerScirptURL WebWorker 算法文件URL地址
 * @param nodeId 节点ID
 */
const getInDegreeAsync = ({ workerScirptURL, ...options }: IInDegree & AsyncOptionBase) =>
  createWorker<number>(ALGORITHM.getInDegree, workerScirptURL)(options);

/**
 * 获取节点的出度
 * @param graphData 图数据
 * @param workerScirptURL WebWorker 算法文件URL地址
 * @param nodeId 节点ID
 */
const getOutDegreeAsync = ({ workerScirptURL, ...options }: IOutDegree & AsyncOptionBase) =>
  createWorker<number>(ALGORITHM.getOutDegree, workerScirptURL)(options);

/**
 * 检测图中的(有向) Cycle
 * @param graphData 图数据
 * @param workerScirptURL WebWorker 算法文件URL地址
 */
const detectCycleAsync = ({ workerScirptURL, ...options }: IConnectedComponent & AsyncOptionBase) =>
  createWorker<{
    [key: string]: string;
  }>(
    ALGORITHM.detectCycle,
    workerScirptURL,
  )(options);

/**
 * 检测图中的(有向) Cycle
 * @param graphData 图数据
 * @param workerScirptURL WebWorker 算法文件URL地址
 */
const detectDirectedCycleAsync = detectCycleAsync;

/**
 * 查找图中所有满足要求的圈
 * @param graphData 图数据
 * @param workerScirptURL WebWorker 算法文件URL地址
 * @param directed 是否为有向图
 * @param nodeIds 节点 ID 的数组，若不指定，则返回图中所有的圈
 * @param include 包含或排除指定的节点
 */
const detectAllCyclesAsync = ({
  workerScirptURL,
  ...options
}: IDetectAllCycles & AsyncOptionBase) =>
  createWorker<ICycleItem[]>(ALGORITHM.detectAllCycles, workerScirptURL)(options);

/**
 * 查找有向图中所有满足要求的圈
 * Johnson's algorithm, 时间复杂度 O((V + E)(C + 1))$ and space bounded by O(V + E)
 * refer: https://www.cs.tufts.edu/comp/150GA/homeworks/hw1/Johnson%2075.PDF
 * refer: https://networkx.github.io/documentation/stable/_modules/networkx/algorithms/cycles.html#simple_cycles
 * @param graphData 图数据
 * @param workerScirptURL WebWorker 算法文件URL地址
 * @param nodeIds 节点 ID 的数组
 * @param include 包含或排除指定的节点
 */
const detectAllDirectedCycleAsync = ({
  workerScirptURL,
  ...options
}: IDetectAllDirectedCycle & AsyncOptionBase) =>
  createWorker<{
    [key: string]: string;
  }>(
    ALGORITHM.detectAllDirectedCycle,
    workerScirptURL,
  )(options);

/**
 * 检测无向图中的所有Base cycles
 * refer: https://www.codeproject.com/Articles/1158232/Enumerating-All-Cycles-in-an-Undirected-Graph
 * @param graphData 图数据
 * @param workerScirptURL WebWorker 算法文件URL地址
 * @param nodeIds 节点 ID 的数组
 * @param include 包含或排除指定的节点
 */
const detectAllUndirectedCycleAsync = ({
  workerScirptURL,
  ...options
}: IDetectAllUndirectedCycle & AsyncOptionBase) =>
  createWorker<ICycleItem[]>(ALGORITHM.detectAllUndirectedCycle, workerScirptURL)(options);

/**
 * Dijkstra's algorithm, See {@link https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm}
 * @param graphData 图数据
 * @param workerScirptURL WebWorker 算法文件URL地址
 * @param directed 是否有向图，默认为 false
 * @param weightPropertyName 权重的属性字段
 */
const dijkstraAsync = ({ workerScirptURL, ...options }: IDijkstra & AsyncOptionBase) =>
  createWorker<IDijkstraResult>(ALGORITHM.dijkstra, workerScirptURL)(options);

/**
 * 查找两点之间的所有路径
 * @param graphData 图数据
 * @param workerScirptURL WebWorker 算法文件URL地址
 * @param start 路径起始点ID
 * @param end 路径终点ID
 * @param directed 是否为有向图
 */
const findAllPathAsync = ({ workerScirptURL, ...options }: IFindAllPath & AsyncOptionBase) =>
  createWorker<string[][]>(ALGORITHM.findAllPath)(options);

/**
 * 查找两点之间的所有路径
 * @param graphData 图数据
 * @param workerScirptURL WebWorker 算法文件URL地址
 * @param start 路径起始点ID
 * @param end 路径终点ID
 * @param directed 是否为有向图
 * @param weightPropertyName 边权重的属名称，若数据中没有权重，则默认每条边权重为 1
 */
const findShortestPathAsync = ({
  workerScirptURL,
  ...options
}: IFindShortestPath & AsyncOptionBase) =>
  createWorker<IFindShortestPathResult>(ALGORITHM.findShortestPath, workerScirptURL)(options);

/**
 * Floyd–Warshall algorithm, See {@link https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm}
 * @param graphData 图数据
 * @param workerScirptURL WebWorker 算法文件URL地址
 * @param directed 是否有向图，默认为 false
 */
const floydWarshallAsync = ({ workerScirptURL, ...options }: IFloydWarshall & AsyncOptionBase) =>
  createWorker<Matrix[]>(ALGORITHM.floydWarshall, workerScirptURL)(options);

/**
 * 标签传播算法
 * @param graphData 图数据
 * @param workerScirptURL WebWorker 算法文件URL地址
 * @param directed 是否有向图，默认为 false
 * @param weightPropertyName 权重的属性字段，默认为 weight
 * @param maxIteration 最大迭代次数，默认为 1000
 */
const labelPropagationAsync = ({
  workerScirptURL,
  ...options
}: ILabelPropagation & AsyncOptionBase) =>
  createWorker<ClusterData>(ALGORITHM.labelPropagation, workerScirptURL)(options);

/**
 * 社区发现 louvain 算法
 * @param graphData 图数据
 * @param workerScirptURL WebWorker 算法文件URL地址
 * @param directed 是否有向图，默认为 false
 * @param weightPropertyName 权重的属性字段，默认为 weight，若数据中没有权重，则默认每条边权重为 1
 * @param threshold 停止迭代的阈值，默认为 0.0001
 */
const louvainAsync = ({ workerScirptURL, ...options }: ILouvain & AsyncOptionBase) =>
  createWorker<ClusterData>(ALGORITHM.louvain, workerScirptURL)(options);

/**
 * 最小生成树，See {@link https://en.wikipedia.org/wiki/Kruskal%27s_algorithm}
 * @param graphData 图数据
 * @param workerScirptURL WebWorker 算法文件URL地址
 * @param weight 指定用于作为边权重的属性，若不指定，则认为所有边权重一致
 * @param algo 'prim' | 'kruskal' 算法类型
 * @return EdgeConfig[] 返回构成MST的边的数组
 */
const minimumSpanningTreeAsync = ({
  workerScirptURL,
  ...options
}: IMinimumSpanningTree & AsyncOptionBase) =>
  createWorker<EdgeConfig[]>(ALGORITHM.minimumSpanningTree, workerScirptURL)(options);

/**
 * PageRank https://en.wikipedia.org/wiki/PageRank
 * refer: https://github.com/anvaka/ngraph.pagerank
 * @param graphData 图数据
 * @param workerScirptURL WebWorker 算法文件URL地址
 * @param epsilon 判断是否收敛的精度值，默认 0.000001
 * @param linkProb 阻尼系数（dumping factor），指任意时刻，用户访问到某节点后继续访问该节点链接的下一个节点的概率，经验值 0.85
 */
const pageRankAsync = ({ workerScirptURL, ...options }: IPagerank & AsyncOptionBase) =>
  createWorker<IPagerankResult>(ALGORITHM.pageRank, workerScirptURL)(options);

/**
 * 获取指定节点的所有邻居
 * @param graphData 图数据
 * @param workerScirptURL WebWorker 算法文件URL地址
 * @param nodeId 节点 ID
 * @param type 邻居类型
 */
const getNeighborsAsync = ({ workerScirptURL, ...options }: INeighbors & AsyncOptionBase) =>
  createWorker<string[]>(ALGORITHM.getNeighbors, workerScirptURL)(options);

/**
 * GADDI 图模式匹配
 * @param graphData 原图数据
 * @param workerScirptURL WebWorker 算法文件URL地址
 * @param pattern 搜索图（需要在原图上搜索的模式）数据
 * @param directed 是否计算有向图，默认 false
 * @param k 参数 k，表示 k-近邻
 * @param length 参数 length
 * @param nodeLabelProp 节点数据中代表节点标签（分类信息）的属性名。默认为 cluster
 * @param edgeLabelProp 边数据中代表边标签（分类信息）的属性名。默认为 cluster
 */
const GADDIAsync = ({ workerScirptURL, ...options }: IConnectedComponent & AsyncOptionBase) =>
  createWorker<GraphData[]>(ALGORITHM.GADDI, workerScirptURL)(options);

export {
  getAdjMatrixAsync,
  connectedComponentAsync,
  getDegreeAsync,
  getInDegreeAsync,
  getOutDegreeAsync,
  detectCycleAsync,
  detectDirectedCycleAsync,
  detectAllCyclesAsync,
  detectAllDirectedCycleAsync,
  detectAllUndirectedCycleAsync,
  dijkstraAsync,
  findAllPathAsync,
  findShortestPathAsync,
  floydWarshallAsync,
  labelPropagationAsync,
  louvainAsync,
  minimumSpanningTreeAsync,
  pageRankAsync,
  getNeighborsAsync,
  GADDIAsync,
};
