import {
  OptionBase,
  ClusterData,
  Matrix,
  NodeConfig,
  DegreeType,
  IAlgorithmCallbacks,
  EdgeConfig,
  GraphData,
} from './types';
import getAdjMatrixAPI from './adjacent-matrix';
import breadthFirstSearchAPI from './bfs';
import connectedComponentAPI from './connected-component';
import getDegreeAPI from './degree';
import { getInDegree as getInDegreeAPI, getOutDegree as getOutDegreeAPI } from './degree';
import detectCycleAPI, {
  detectAllCycles as detectAllCyclesAPI,
  detectAllDirectedCycle as detectAllDirectedCycleAPI,
  detectAllUndirectedCycle as detectAllUndirectedCycleAPI,
} from './detect-cycle';
import depthFirstSearchAPI from './dfs';
import dijkstraAPI from './dijkstra';
import {
  findAllPath as findAllPathAPI,
  findShortestPath as findShortestPathAPI,
} from './find-path';
import floydWarshallAPI from './floydWarshall';
import labelPropagationAPI from './label-propagation';
import louvainAPI from './louvain';
import minimumSpanningTreeAPI from './mts';
import pageRankAPI from './pageRank';
import { getNeighbors as getNeighborsAPI } from './util';
import GADDIAPI from './gaddi';
import StackAPI from './structs/stack';

export const Stack = StackAPI;

/**
 * 算法列表
  1	  getAdjMatrix
  2	  breadthFirstSearch
  3	  connectedComponent
  4	  getDegree
  5	  getInDegree
  6	  getOutDegree
  7	  detectCycle/detectDirectedCycle
  8   detectAllCycles
  9   detectAllDirectedCycle
  10  detectAllUndirectedCycle
  11	depthFirstSearch
  12	dijkstra
  13	findAllPath
  14	findShortestPath
  15	floydWarshall
  16	labelPropagation
  17	louvain
  18	minimumSpanningTree
  19	pageRank
  20	getNeighbors
  21	GADDI
 */

export interface IAdjMatrix extends OptionBase {
  /** 是否有向图，默认为 false */
  directed?: boolean;
}

/**
 * 图的邻接矩阵
 * @param graphData 图数据
 * @param directed 是否有向图，默认为 false
 */
export const getAdjMatrix = ({ graphData, directed }: IAdjMatrix): Matrix[] =>
  getAdjMatrixAPI(graphData, directed);

export interface IConnectedComponent extends OptionBase {
  /** 是否有向图，默认为 false */
  directed?: boolean;
}

/**
 * 图的连通分量
 * @param graphData 图数据
 * @param directed 是否有向图，默认为 false
 */
export const connectedComponent = ({ graphData, directed }: IConnectedComponent): NodeConfig[][] =>
  connectedComponentAPI(graphData, directed);

export interface IBreadthFirstSearch extends OptionBase {
  startNodeId: string;
  originalCallbacks?: IAlgorithmCallbacks;
}

/**
 * 广度优先遍历图
 * @param graphData 图数据
 * @param startNodeId 开始遍历的节点
 * @param originalCallbacks 回调
 */
export const breadthFirstSearch = ({
  graphData,
  startNodeId,
  originalCallbacks,
}: IBreadthFirstSearch): void => breadthFirstSearchAPI(graphData, startNodeId, originalCallbacks);

type IDegree = OptionBase;
/**
 * 获取节点的度
 * @param graphData 图数据
 */
export const getDegree = ({ graphData }: IDegree): DegreeType => getDegreeAPI(graphData);

export interface IInDegree extends OptionBase {
  /** 节点ID */
  nodeId: string;
}
/**
 * 获取节点的入度
 * @param graphData 图数据
 * @param nodeId 节点ID
 */
export const getInDegree = ({ graphData, nodeId }: IInDegree): number =>
  getInDegreeAPI(graphData, nodeId);

export interface IOutDegree extends OptionBase {
  /** 节点ID */
  nodeId: string;
}
/**
 * 获取节点的出度
 * @param graphData 图数据
 * @param nodeId 节点ID
 */
export const getOutDegree = ({ graphData, nodeId }: IOutDegree): number =>
  getOutDegreeAPI(graphData, nodeId);

export type IDetectCycle = OptionBase;
export type IDetectCycleResult = {
  [key: string]: string;
} | null;

/**
 * 检测图中的(有向) Cycle
 * @param graphData 图数据
 */
export const detectCycle = ({ graphData }: IDetectCycle): IDetectCycleResult =>
  detectCycleAPI(graphData);

/**
 * 检测图中的(有向) Cycle
 * @param graphData 图数据
 */
export const detectDirectedCycle = ({ graphData }: IDetectCycle): IDetectCycleResult =>
  detectCycleAPI(graphData);

export interface IDetectAllCycles extends OptionBase {
  /** 是否有向图，默认为 false */
  directed?: boolean;
  /** 节点 ID 的数组，若不指定，则返回图中所有的圈 */
  nodeIds?: string[];
  /**  */
  include?: boolean;
}

export interface ICycleItem {
  [key: string]: NodeConfig;
}

/**
 * 查找图中所有满足要求的圈
 * @param graphData 图数据
 * @param directed 是否为有向图
 * @param nodeIds 节点 ID 的数组，若不指定，则返回图中所有的圈
 * @param include 包含或排除指定的节点
 */
export const detectAllCycles = ({
  graphData,
  directed,
  nodeIds,
  include,
}: IDetectAllCycles): ICycleItem[] => detectAllCyclesAPI(graphData, directed, nodeIds, include);

export interface IDetectAllDirectedCycle extends OptionBase {
  /** 节点 ID 的数组 */
  nodeIds?: string[];
  /**  */
  include?: boolean;
}

/**
 * 查找有向图中所有满足要求的圈
 * Johnson's algorithm, 时间复杂度 O((V + E)(C + 1))$ and space bounded by O(V + E)
 * refer: https://www.cs.tufts.edu/comp/150GA/homeworks/hw1/Johnson%2075.PDF
 * refer: https://networkx.github.io/documentation/stable/_modules/networkx/algorithms/cycles.html#simple_cycles
 * @param graphData 图数据
 * @param nodeIds 节点 ID 的数组
 * @param include 包含或排除指定的节点
 */
export const detectAllDirectedCycle = ({
  graphData,
  nodeIds,
  include,
}: IDetectAllDirectedCycle): ICycleItem[] => detectAllDirectedCycleAPI(graphData, nodeIds, include);

export interface IDetectAllUndirectedCycle extends OptionBase {
  /** 节点 ID 的数组 */
  nodeIds?: string[];
  /** 包含或排除指定的节点 */
  include?: boolean;
}

/**
 * 检测无向图中的所有Base cycles
 * refer: https://www.codeproject.com/Articles/1158232/Enumerating-All-Cycles-in-an-Undirected-Graph
 * @param graphData 图数据
 * @param nodeIds 节点 ID 的数组
 * @param include 包含或排除指定的节点
 */

export const detectAllUndirectedCycle = ({
  graphData,
  nodeIds,
  include,
}: IDetectAllUndirectedCycle): ICycleItem[] =>
  detectAllUndirectedCycleAPI(graphData, nodeIds, include);

export interface IDepthFirstSearchAPI extends OptionBase {
  startNodeId: string;
  originalCallbacks?: IAlgorithmCallbacks;
}

/**
 * 深度优先遍历图
 * @param graphData 图数据
 * @param startNodeId 开始遍历的节点
 * @param originalCallbacks 回调
 */
export const depthFirstSearch = ({
  graphData,
  startNodeId,
  originalCallbacks,
}: IDepthFirstSearchAPI): void => depthFirstSearchAPI(graphData, startNodeId, originalCallbacks);

export interface IDijkstra extends OptionBase {
  source: string;
  /** 是否有向图，默认为 false */
  directed?: boolean;
  /** 权重的属性字段 */
  weightPropertyName?: string;
}

export interface IDijkstraResult {
  length: {
    [key: string]: number;
  };
  path: {
    [key: string]: string[];
  };
  allPath: {
    [key: string]: string[][];
  };
}

/**
 * Dijkstra's algorithm, See {@link https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm}
 * @param graphData 图数据
 * @param directed 是否有向图，默认为 false
 * @param weightPropertyName 权重的属性字段
 */
export const dijkstra = ({
  graphData,
  source,
  directed,
  weightPropertyName,
}: IDijkstra): IDijkstraResult => dijkstraAPI(graphData, source, directed, weightPropertyName);

export interface IFindAllPath extends OptionBase {
  /** 路径起始点ID */
  start: string;
  /** 路径终点ID */
  end: string;
  /** 是否有向图，默认为 false */
  directed?: boolean;
}

/**
 * 查找两点之间的所有路径
 * @param graphData 图数据
 * @param start 路径起始点ID
 * @param end 路径终点ID
 * @param directed 是否有向图，默认为 false
 */
export const findAllPath = ({ graphData, start, end, directed }: IFindAllPath): string[][] =>
  findAllPathAPI(graphData, start, end, directed);

export interface IFindShortestPath extends OptionBase {
  /** 路径起始点ID */
  start: string;
  /** 路径终点ID */
  end: string;
  /** 是否有向图，默认为 false */
  directed?: boolean;
  /** 边权重的属名称，若数据中没有权重，则默认每条边权重为 1 */
  weightPropertyName?: string;
}

export interface IFindShortestPathResult {
  length: number;
  path: string[];
  allPath: string[][];
}

/**
 * 查找两点之间的所有路径
 * @param graphData 图数据
 * @param start 路径起始点ID
 * @param end 路径终点ID
 * @param directed 是否有向图，默认为 false
 * @param weightPropertyName 边权重的属名称，若数据中没有权重，则默认每条边权重为 1
 */
export const findShortestPath = ({
  graphData,
  start,
  end,
  directed,
  weightPropertyName,
}: IFindShortestPath): IFindShortestPathResult =>
  findShortestPathAPI(graphData, start, end, directed, weightPropertyName);

export interface IFloydWarshall extends OptionBase {
  /** 是否有向图，默认为 false */
  directed?: boolean;
}

/**
 * Floyd–Warshall algorithm, See {@link https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm}
 * @param graphData 图数据
 * @param directed 是否有向图，默认为 false
 */
export const floydWarshall = ({ graphData, directed }: IFloydWarshall): Matrix[] =>
  floydWarshallAPI(graphData, directed);

export interface ILabelPropagation extends OptionBase {
  /** 是否有向图，默认为 false */
  directed?: boolean;
  /** 权重的属性字段，默认为 weight */
  weightPropertyName?: string;
  /** 最大迭代次数，默认为 1000 */
  maxIteration?: number;
}

/**
 * 标签传播算法
 * @param graphData 图数据
 * @param directed 是否有向图，默认为 false
 * @param weightPropertyName 权重的属性字段，默认为 weight
 * @param maxIteration 最大迭代次数，默认为 1000
 */
export const labelPropagation = ({
  graphData,
  directed,
  weightPropertyName,
  maxIteration,
}: ILabelPropagation): ClusterData =>
  labelPropagationAPI(graphData, directed, weightPropertyName, maxIteration);

export interface ILouvain extends OptionBase {
  /** 是否有向图，默认为 false */
  directed?: boolean;
  /** 权重的属性字段，默认为 weight，若数据中没有权重，则默认每条边权重为 1 */
  weightPropertyName?: string;
  /** 停止迭代的阈值，默认为 0.0001 */
  threshold?: number;
}
/**
 * 社区发现 louvain 算法
 * @param graphData 图数据
 * @param directed 是否有向图，默认为 false
 * @param weightPropertyName 权重的属性字段，默认为 weight，若数据中没有权重，则默认每条边权重为 1
 * @param threshold 停止迭代的阈值，默认为 0.0001
 */
export const louvain = ({
  graphData,
  directed,
  weightPropertyName,
  threshold,
}: ILouvain): ClusterData => louvainAPI(graphData, directed, weightPropertyName, threshold);

export interface IMinimumSpanningTree extends OptionBase {
  /** 指定用于作为边权重的属性，若不指定，则认为所有边权重一致 */
  weight?: string;
  /** 'prim' | 'kruskal' 算法类型 */
  algo?: 'prim' | 'kruskal';
}

/**
 * 最小生成树，See {@link https://en.wikipedia.org/wiki/Kruskal%27s_algorithm}
 * @param graph
 * @param weight 指定用于作为边权重的属性，若不指定，则认为所有边权重一致
 * @param algo 'prim' | 'kruskal' 算法类型
 * @return EdgeConfig[] 返回构成MST的边的数组
 */
export const minimumSpanningTree = ({
  graphData,
  weight,
  algo,
}: IMinimumSpanningTree): EdgeConfig[] => minimumSpanningTreeAPI(graphData, weight, algo);

export interface IPagerank extends OptionBase {
  /** 判断是否收敛的精度值，默认 0.000001 */
  epsilon?: number;
  /** 阻尼系数（dumping factor），指任意时刻，用户访问到某节点后继续访问该节点链接的下一个节点的概率，经验值 0.85 */
  linkProb?: number;
}

export interface IPagerankResult {
  [key: string]: number;
}

/**
 * PageRank https://en.wikipedia.org/wiki/PageRank
 * refer: https://github.com/anvaka/ngraph.pagerank
 * @param graph
 * @param epsilon 判断是否收敛的精度值，默认 0.000001
 * @param linkProb 阻尼系数（dumping factor），指任意时刻，用户访问到某节点后继续访问该节点链接的下一个节点的概率，经验值 0.85
 */
export const pageRank = ({ graphData, epsilon, linkProb }: IPagerank): IPagerankResult =>
  pageRankAPI(graphData, epsilon, linkProb);

export interface INeighbors extends OptionBase {
  /** 节点 ID */
  nodeId: string;
  /** 邻居类型 */
  type?: 'target' | 'source';
}

/**
 * 获取指定节点的所有邻居
 * @param graphData 图数据
 * @param nodeId 节点 ID
 * @param type 邻居类型
 */
export const getNeighbors = ({ graphData, nodeId, type }: INeighbors): string[] =>
  getNeighborsAPI(nodeId, graphData.edges, type);

export interface IGADDI extends OptionBase {
  /** 是否有向图，默认为 false */
  directed?: boolean;
  /** 搜索图（需要在原图上搜索的模式）数据 */
  pattern: GraphData;
  /** 参数 k，表示 k-近邻 */
  k?: number;
  /** 参数 length */
  length?: number;
  /** 节点数据中代表节点标签（分类信息）的属性名。默认为 cluster */
  nodeLabelProp?: string;
  /** 边数据中代表边标签（分类信息）的属性名。默认为 cluster  */
  edgeLabelProp?: string;
}
/**
 * GADDI 图模式匹配
 * @param graphData 图数据
 * @param pattern 搜索图（需要在原图上搜索的模式）数据
 * @param directed 是否计算有向图，默认 false
 * @param k 参数 k，表示 k-近邻
 * @param length 参数 length
 * @param nodeLabelProp 节点数据中代表节点标签（分类信息）的属性名。默认为 cluster
 * @param edgeLabelProp 边数据中代表边标签（分类信息）的属性名。默认为 cluster
 */
export const GADDI = ({
  graphData,
  pattern,
  directed,
  k,
  length,
  nodeLabelProp,
  edgeLabelProp,
}: IGADDI): GraphData[] =>
  GADDIAPI(graphData, pattern, directed, k, length, nodeLabelProp, edgeLabelProp);

export default {
  getAdjMatrix,
  breadthFirstSearch,
  connectedComponent,
  getDegree,
  getInDegree,
  getOutDegree,
  detectCycle,
  detectDirectedCycle,
  detectAllCycles,
  detectAllDirectedCycle,
  detectAllUndirectedCycle,
  depthFirstSearch,
  dijkstra,
  findAllPath,
  findShortestPath,
  floydWarshall,
  labelPropagation,
  louvain,
  minimumSpanningTree,
  pageRank,
  getNeighbors,
  GADDI,
  Stack,
};
