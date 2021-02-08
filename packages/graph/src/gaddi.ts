import floydWarshall from './floydWarshall';
import { GraphData, Matrix } from './types';
import gSpan, { EdgeMap, NodeMap } from './gSpan/gSpan';
import dijkstra from './dijkstra';
import { uniqueId } from './util';

/** 节点对 map */
interface NodePairMap {
  [key: string]: {
    // key 的格式为 startNodeIdx-endNodeIdx
    start: number; // 第一个节点的 idx
    end: number; // 第二个节点的 idx
    distance: number; // 两节点最短路径长度
  };
}

interface LabelMap {
  [label: string]: any;
}

/** 邻居单元类型 */
interface NeighborUnit {
  nodeId: string;
  nodeIdx: number;
  nodeIdxs: number[]; // the first one is nodeIdx
  neighbors: any[]; //
  neighborNum: number;
  nodeLabelCountMap: {
    [label: string]: {
      count: number;
      dists: number[]; // 按照从小到大排序的距离数组
    };
  };
}

/** 节点对的邻居交集的诱导子图 map */
interface InterGraphMap {
  [key: string]: GraphData; // key 格式由节点对的 idx 组成：beginIdx-endIdx，和 nodePairMap 对应
}

/**
 * 为 graphData 中每个节点生成邻居单元数组
 * @param graphData
 * @param spm
 * @param nodeLabelProp
 * @param k k-近邻
 */
const findKNeighborUnits = (
  graphData: GraphData,
  spm: Matrix[],
  nodeLabelProp: string = 'cluster',
  k: number = 2,
): NeighborUnit[] => {
  const units: NeighborUnit[] = [];
  const nodes = graphData.nodes;
  spm.forEach((row: number[], i) => {
    units.push(findKNeighborUnit(nodes, row, i, nodeLabelProp, k));
  });
  return units;
};

const findKNeighborUnit = (nodes, row, i, nodeLabelProp, k) => {
  const unitNodeIdxs = [i];
  const neighbors = [];
  const labelCountMap = {};
  row.forEach((v, j) => {
    if (v <= k && i !== j) {
      unitNodeIdxs.push(j);
      neighbors.push(nodes[j]);
      const label = nodes[j][nodeLabelProp];
      if (!labelCountMap[label]) labelCountMap[label] = { count: 1, dists: [v] };
      else {
        labelCountMap[label].count++;
        labelCountMap[label].dists.push(v);
      }
    }
  });
  // 将 labelCountMap 中的 dists 按照从小到大排序，方便后面使用
  Object.keys(labelCountMap).forEach(label => {
    labelCountMap[label].dists = labelCountMap[label].dists.sort((a, b) => a - b);
  });
  return {
    nodeIdx: i,
    nodeId: nodes[i].id,
    nodeIdxs: unitNodeIdxs,
    neighbors,
    neighborNum: unitNodeIdxs.length - 1,
    nodeLabelCountMap: labelCountMap,
  };
};

/**
 * 随机寻找点对，满足距离小于 k
 * @param k 参数 k，表示 k-近邻
 * @param nodeNum 参数 length
 * @param maxNodePairNum 寻找点对的数量不超过 maxNodePairNum
 * @param spm 最短路径矩阵
 */
const findNodePairsRandomly = (
  k: number,
  nodeNum: number,
  maxNodePairNum: number,
  kNeighborUnits: NeighborUnit[],
  spm: Matrix[],
): NodePairMap => {
  // 每个节点需要随机找出的点对数
  let nodePairNumEachNode = Math.ceil(maxNodePairNum / nodeNum);
  const nodePairMap = {};
  let foundNodePairCount = 0;

  // 遍历节点，为每个节点随机找出 nodePairNumEachNode 个点对，满足距离小于 k。找到的点对数量超过 maxNodePairNum 或所有节点遍历结束时终止
  kNeighborUnits.forEach((unit, i) => {
    // 若未达到 nodePairNumEachNode，或循环次数小于最大循环次数(2 * nodeNum)，继续循环
    let nodePairForICount = 0;
    let outerLoopCount = 0;
    const neighbors = unit.nodeIdxs; // the first one is the center node
    const neighborNum = unit.neighborNum - 1;
    while (nodePairForICount < nodePairNumEachNode) {
      // 另一端节点在节点数组中的的 index
      let oidx = neighbors[1 + Math.floor(Math.random() * neighborNum)];
      let innerLoopCount = 0;
      // 若随机得到的另一端 idx 不符合条件，则继续 random。条件是不是同一个节点、这个点对没有被记录过、距离小于 k
      while (nodePairMap[`${i}-${oidx}`] || nodePairMap[`${oidx}-${i}`]) {
        oidx = Math.floor(Math.random() * nodeNum);
        innerLoopCount++;
        if (innerLoopCount > 2 * nodeNum) break; // 循环次数大于最大循环次数(2 * nodeNum)跳出循环，避免死循环
      }
      if (innerLoopCount < 2 * nodeNum) {
        // 未达到最大循环次数，说明找到了合适的另一端
        nodePairMap[`${i}-${oidx}`] = {
          start: i,
          end: oidx,
          distance: spm[i][oidx],
        };
        nodePairForICount++;
        foundNodePairCount++;
        // 如果当前找到的点对数量达到了上限，返回结果
        if (foundNodePairCount >= maxNodePairNum) return nodePairMap;
      }
      outerLoopCount++;
      if (outerLoopCount > 2 * nodeNum) break; // 循环次数大于最大循环次数(2 * nodeNum)跳出循环，避免死循环
    }
    // 这个节点没有找到足够 nodePairNumEachNode 的点对。更新 nodePairNumEachNode，让后续节点找更多的点对
    if (nodePairForICount < nodePairNumEachNode) {
      const gap = nodePairNumEachNode - nodePairForICount;
      nodePairNumEachNode = (nodePairNumEachNode + gap) / (nodeNum - i - 1);
    }
  });
  return nodePairMap;
};

/**
 * 计算所有 nodePairMap 中节点对的相交邻居诱导子图
 * @param nodePairMap 节点对 map，key 为 node1.id-node2.id，value 为 { startNodeIdx, endNodeIdx, distance }
 * @param neighborUnits 每个节点的邻居元数组
 * @param graphData 原图数据
 * @param edgeMap 边的 map，方便检索
 * @param cachedInducedGraphMap 缓存的结果，下次进入该函数将继续更新该缓存，若 key 在缓存中存在则不需要重复计算
 */
const getIntersectNeighborInducedGraph = (
  nodePairMap: NodePairMap,
  neighborUnits: NeighborUnit[],
  graphData: GraphData,
  cachedInducedGraphMap?: InterGraphMap,
): InterGraphMap => {
  const nodes = graphData.nodes;
  if (!cachedInducedGraphMap) cachedInducedGraphMap = {};
  Object.keys(nodePairMap).forEach(key => {
    if (cachedInducedGraphMap && cachedInducedGraphMap[key]) return;
    cachedInducedGraphMap[key] = { nodes: [], edges: [] };
    const pair = nodePairMap[key];
    const startUnitNodeIds = neighborUnits[pair.start]?.nodeIdxs;
    const endUnitNodeIds = neighborUnits[pair.end]?.nodeIdxs;
    if (!startUnitNodeIds || !endUnitNodeIds) return; // 不存在邻元，返回空图
    const endSet = new Set(endUnitNodeIds);
    const intersect = startUnitNodeIds.filter(x => endSet.has(x)); // 可能会爆栈（在 1580 + 6 nodes full-connected 时出现）
    if (!intersect || !intersect.length) return; // 没有交集，返回空图
    const intersectIdMap = {};
    const intersectLength = intersect.length;
    for (let i = 0; i < intersectLength; i++) {
      const node = nodes[intersect[i]];
      cachedInducedGraphMap[key].nodes.push(node); // 将交集中的点加入诱导子图
      intersectIdMap[node.id] = true;
    }
    // 遍历所有边数据，如果边的两端都在交集中，将该边加入诱导子图
    graphData.edges.forEach(edge => {
      if (intersectIdMap[edge.source] && intersectIdMap[edge.target])
        cachedInducedGraphMap[key].edges.push(edge);
    });
  });
  return cachedInducedGraphMap;
};

/**
 * 计算 strcutre 在 graph 上的匹配数量
 * @param graph 图数据
 * @param structure 目前支持只有两个节点一条边的最简单结构
 * @param nodeLabelProp 节点类型字段名
 * @param edgeLabelProp 边类型字段名
 */
const getMatchedCount = (graph, structure, nodeLabelProp, edgeLabelProp) => {
  const nodeMap = {};
  graph.nodes.forEach(node => {
    nodeMap[node.id] = node;
  });
  let count = 0;
  graph.edges.forEach(e => {
    const sourceLabel = nodeMap[e.source][nodeLabelProp];
    const targetLabel = nodeMap[e.target][nodeLabelProp];
    const strNodeLabel1 = structure.nodes[0][nodeLabelProp];
    const strNodeLabel2 = structure.nodes[1][nodeLabelProp];
    const strEdgeLabel = structure.edges[0][edgeLabelProp];

    if (e[edgeLabelProp] !== strEdgeLabel) return;
    if (
      (sourceLabel === strNodeLabel1 && targetLabel === strNodeLabel2) ||
      (sourceLabel === strNodeLabel2 && targetLabel === strNodeLabel1)
    ) {
      count++;
    }
  });
  return count;
};

/**
 * structures 中寻找最具有代表性的一个。这个结构是使得 matchedCountMap 的分组方式类内间距最小，类间间距最大
 * @param matchedCountMap 每个 structure 分类后的各图匹配数量，格式 { [strcture.idx]: { [interInducedGraphKey]: count } }
 * @param structureNum strcuture 个数，与 matchedCountMap.length 对应
 * @param structures
 */
const findRepresentStructure = (matchedCountMap, structureNum, structures) => {
  let maxOffset = Infinity,
    representClusterType = 0;
  for (let i = 0; i < structureNum; i++) {
    // 一种分组的 map，key 是 intGraph 的 key，value 是 structures[i] 的匹配个数
    const countMapI = matchedCountMap[i];
    // 按照 value 为该组排序，生成 keys 的数组：
    const sortedGraphKeys = Object.keys(countMapI).sort((a, b) => {
      return countMapI[a] - countMapI[b];
    });

    // 共 100 个 graphKeys，将 graphKeys 按顺序分为 groupNum 组
    const groupNum = 10;
    const clusters = []; // 总共有 groupNum 个项
    sortedGraphKeys.forEach((key, j) => {
      if (!clusters[j % groupNum])
        clusters[j % groupNum] = { graphs: [], totalCount: 0, aveCount: 0 };
      clusters[j % groupNum].graphs.push(key);
      clusters[j % groupNum].totalCount += countMapI[key];
    });

    // 计算 cluster 与 cluster 之间的距离 innerDist，每个 cluster 内部的距离 intraDist
    let aveIntraDist = 0; // 该类的类内平均值
    const aveCounts = []; // 类内平均匹配数量，将用于计算类间距离
    clusters.forEach(graphsInCluster => {
      // 类内均值
      const aveCount = graphsInCluster.totalCount / graphsInCluster.graphs.length;
      graphsInCluster.aveCount = aveCount;
      aveCounts.push(aveCount);

      // 对于每类，计算类内间距平均值
      let aveIntraPerCluster = 0;
      const graphsNum = graphsInCluster.length;
      graphsInCluster.graphs.forEach((graphKey1, j) => {
        const graph1Count = countMapI[graphKey1];
        graphsInCluster.graphs.forEach((graphKey2, k) => {
          if (j === k) return;
          aveIntraPerCluster += Math.abs(graph1Count - countMapI[graphKey2]);
        });
      });
      aveIntraPerCluster /= (graphsNum * (graphsNum - 1)) / 2;
      aveIntraDist += aveIntraPerCluster;
    });

    aveIntraDist /= clusters.length;

    // 用类内均值计算类间距
    let aveInterDist = 0; // 类间间距平均值
    aveCounts.forEach((aveCount1, j) => {
      aveCounts.forEach((aveCount2, k) => {
        if (j === k) return;
        aveInterDist += Math.abs(aveCount1 - aveCount2);
      });
      aveInterDist /= (aveCounts.length * (aveCounts.length - 1)) / 2;
    });

    // 寻找 (类间间距均值-类内间距均值) 最大的一种分组方式（对应的 structure 就是最终要找的唯一 DS(G)）
    const offset = aveInterDist - aveIntraDist;
    if (maxOffset < offset) {
      maxOffset = offset;
      representClusterType = i;
    }
  }
  return {
    structure: structures[representClusterType],
    structureCountMap: matchedCountMap[representClusterType],
  };
};

const getNodeMaps = (nodes, nodeLabelProp): { nodeMap: NodeMap; nodeLabelMap: LabelMap } => {
  const nodeMap: NodeMap = {},
    nodeLabelMap: LabelMap = {};
  nodes.forEach((node, i) => {
    nodeMap[node.id] = { idx: i, node, degree: 0 };
    const label = node[nodeLabelProp];
    if (!nodeLabelMap[label]) nodeLabelMap[label] = [];
    nodeLabelMap[label].push(node);
  });
  return { nodeMap, nodeLabelMap };
};

const getEdgeMaps = (
  edges,
  edgeLabelProp,
  nodeMap: NodeMap,
): { edgeMap: EdgeMap; edgeLabelMap: LabelMap } => {
  const edgeMap = {},
    edgeLabelMap = {};
  edges.forEach((edge, i) => {
    edgeMap[`${uniqueId}`] = { idx: i, edge };
    const label = edge[edgeLabelProp];
    if (!edgeLabelMap[label]) edgeLabelMap[label] = [];
    edgeLabelMap[label].push(edge);

    const sourceNode = nodeMap[edge.source];
    if (sourceNode) sourceNode.degree++;
    const targetNode = nodeMap[edge.target];
    if (targetNode) targetNode.degree++;
  });
  return { edgeMap, edgeLabelMap };
};

/**
 * 输出最短路径的 map，key 为 sourceNode.id-targetNode.id，value 为这两个节点的最短路径长度
 * @param nodes
 * @param spm
 * @param directed
 */
const getSpmMap = (nodes, spm, directed): { [key: string]: number } => {
  const length = spm.length;
  const map = {};
  spm.forEach((row, i) => {
    const start = directed ? 0 : i + 1;
    const iId = nodes[i].id;
    for (let j = start; j < length; j++) {
      if (i === j) continue;
      const jId = nodes[j].id;
      const dist = row[j];
      map[`${iId}-${jId}`] = dist;
      if (!directed) map[`${jId}-${iId}`] = dist;
    }
  });
  return map;
};

/**
 * 计算一对节点（node1，node2）的 NDS 距离
 * @param graph 原图数据
 * @param node1
 * @param node2
 */
const getNDSDist = (
  graph,
  node1,
  node2,
  nodeMap,
  spDist,
  kNeighborUnits,
  structure,
  nodeLabelProp,
  edgeLabelProp,
  cachedNDSMap,
  cachedInterInducedGraph,
) => {
  const key = `${node1.id}-${node2.id}`;
  if (cachedNDSMap && cachedNDSMap[key]) return cachedNDSMap[key];
  let interInducedGraph = cachedInterInducedGraph ? cachedInterInducedGraph[key] : undefined;
  // 若没有缓存相交邻居诱导子图，计算
  if (!interInducedGraph) {
    const pairMap: NodePairMap = {
      [key]: {
        start: nodeMap[node1.id].idx,
        end: nodeMap[node2.id].idx,
        distance: spDist,
      },
    };

    cachedInterInducedGraph = getIntersectNeighborInducedGraph(
      pairMap,
      kNeighborUnits,
      graph,
      cachedInterInducedGraph,
    );
    interInducedGraph = cachedInterInducedGraph[key];
  }

  return getMatchedCount(interInducedGraph, structure, nodeLabelProp, edgeLabelProp);
};

/**
 * GADDI 模式匹配
 * @param graphData 原图数据
 * @param pattern 搜索图（需要在原图上搜索的模式）数据
 * @param directed 是否计算有向图，默认 false
 * @param k 参数 k，表示 k-近邻
 * @param length 参数 length
 * @param nodeLabelProp 节点数据中代表节点标签（分类信息）的属性名。默认为 cluster
 * @param edgeLabelProp 边数据中代表边标签（分类信息）的属性名。默认为 cluster
 */
const GADDI = (
  graphData: GraphData,
  pattern: GraphData,
  directed: boolean = false,
  k: number,
  length: number,
  nodeLabelProp: string = 'cluster',
  edgeLabelProp: string = 'cluster',
): GraphData[] => {
  if (!graphData || !graphData.nodes) return;
  // 分为三步：
  // 0. 预计算：节点/边数，邻接矩阵、最短路径矩阵
  // 1. 处理原图 graphData。再分为 1~5 小步
  // 2. 匹配

  // console.log("----- stage-pre: preprocessing -------");

  // -------- 第零步，预计算：节点/边数，邻接矩阵、最短路径矩阵-------
  const nodeNum = graphData.nodes.length;
  if (!nodeNum) return;
  // console.log("----- stage-pre.1: calc shortest path matrix for graph -------");
  const spm = floydWarshall(graphData, directed);
  // console.log(
  //   "----- stage-pre.2: calc shortest path matrix for pattern -------"
  // );
  const patternSpm = floydWarshall(pattern, directed);
  // console.log(
  //   "----- stage-pre.3: calc shortest path matrix map for graph -------"
  // );
  const spmMap = getSpmMap(graphData.nodes, spm, directed);
  // console.log(
  //   "----- stage-pre.4: calc shortest path matrix map for pattern -------"
  // );
  const patternSpmMap = getSpmMap(pattern.nodes, patternSpm, directed);

  // console.log("----- stage-pre.5: establish maps -------");
  // 节点的 map，以 id 为 id 映射，方便后续快速检索
  const { nodeMap, nodeLabelMap } = getNodeMaps(graphData.nodes, nodeLabelProp);
  const { nodeMap: patternNodeMap, nodeLabelMap: patternNodeLabelMap } = getNodeMaps(
    pattern.nodes,
    nodeLabelProp,
  );

  // 计算节点度数
  getEdgeMaps(graphData.edges, edgeLabelProp, nodeMap);

  const { edgeLabelMap: patternEdgeLabelMap } = getEdgeMaps(
    pattern.edges,
    edgeLabelProp,
    patternNodeMap,
  );

  // 若未指定 length，自动计算 pattern 半径（最短路径最大值）
  if (!length) length = Math.max(...patternSpm[0], 2);
  if (!k) k = length;

  // console.log("params", directed, length, k);

  // console.log("----- stage-pre.6: calc k neighbor units -------");
  // 计算每个节点的 k 邻元集合
  const kNeighborUnits = findKNeighborUnits(graphData, spm, nodeLabelProp, k);
  const patternKNeighborUnits = findKNeighborUnits(pattern, patternSpm, nodeLabelProp, k);

  // console.log(
  //   "----- stage0: going to processing graph and find intersect neighbor induced graphs -------"
  // );

  // console.log("----- stage0.1: going to select random node pairs -------");
  // -------- 第一步，处理原图 graphData-------

  // 1.1. 随机选择最多 100 个点对，满足距离小于 Length 和 k
  // 当 graphData 少于 20 个节点，则不能找出 100 个点对，只找出不多于 n(n-1)/2 个点对
  const maxNodePairNum = Math.min(100, (nodeNum * (nodeNum - 1)) / 2);
  const nodePairsMap = findNodePairsRandomly(
    k,
    nodeNum,
    maxNodePairNum,
    patternKNeighborUnits,
    spm,
  );

  // console.log(
  //   "----- stage0.2: going to calculate intersect neighbor induced graphs -------"
  // );
  // 1.2. 生成上面节点对的相应相交邻居诱导子图。格式为 {'beginNodeIdx-endNodeIdx': {nodes: [], edges: []}}
  let intGMap = getIntersectNeighborInducedGraph(nodePairsMap, kNeighborUnits, graphData);

  // 1.3. 使用 gSpan 算法（frequent graph mining）计算 ISIntG 的前 10 个频率最高的子结构（3-4条边）
  const top = 10,
    minSupport = 1,
    minNodeNum = 1,
    maxNodeNum = 4;
  const params = {
    graphs: intGMap,
    nodeLabelProp,
    edgeLabelProp,
    minSupport,
    minNodeNum,
    maxNodeNum,
    directed,
  };

  // console.log(
  //   "----- stage1: (gSpan) going to find frequent structure dsG -------"
  // );
  // console.log("----- stage1.1: going to run gSpan -------");
  // 暂时假设生成的 sub structure 都只有一条边
  const freStructures = gSpan(params).slice(0, top);
  // structureNum 可能小于 top
  const structureNum = freStructures.length;

  // 1.4. 计算上述 10 个子结构在 intGMap 中每个诱导子图的匹配个数
  const matchedCountMap = [];
  freStructures.forEach((structure, i) => {
    matchedCountMap[i] = {};
    Object.keys(intGMap).forEach(key => {
      const graph = intGMap[key];
      const subStructureCount = getMatchedCount(graph, structure, nodeLabelProp, edgeLabelProp);
      matchedCountMap[i][key] = subStructureCount;
    });
  });

  // console.log(
  //   "----- stage1.1: going to find the most represent strucutre -------"
  // );

  // 1.5. 对于每个子结构，根据匹配个数为 intGMap 中的诱导子图分组，生成 structureNum 种分组
  // 计算每种分组的类间距和类内间距，找到类间距最大、类内间距最小的一种分组，这种分组对应的子结构被选为唯一代表性子结构 DS(G)
  const { structure: dsG, structureCountMap: ndsDist } = findRepresentStructure(
    matchedCountMap,
    structureNum,
    freStructures,
  );

  // -------- 第二步，匹配-------
  // 2.1 从 Q 中的第一个标签的第一个节点开始，寻找 G 中的匹配
  const beginPNode = pattern.nodes[0];
  const label = beginPNode[nodeLabelProp];
  // 2.1.1 找到 G 中标签与之相同的节点
  let candidates = nodeLabelMap[label];

  // console.log("----- stage2: going to find candidates -------");

  // 全局缓存，避免重复计算
  const minPatternNodeLabelDegreeMap = {}; // key 是 label，value 是该 label 节点的最小度数
  let patternIntGraphMap = {},
    patternNDSDist = {}, // key 为 node.id-node.id
    patternNDSDistMap = {}; // key 为 node.id-label2，value nds距离值数组（按从大到小排序，无需关心具体对应哪个 node2）
  // 2.2.2 对于 Q 中的另一个标签的 k 个节点，计算它们到 node 的最短路径以及 NDS 距离
  const patternSpDist = {};
  Object.keys(patternNodeLabelMap).forEach((label2, j) => {
    patternSpDist[label2] = [];
    let maxDist = -Infinity;
    const patternNodesWithLabel2 = patternNodeLabelMap[label2];
    const patternNodePairMap = {};
    patternNodesWithLabel2.forEach(nodeWithLabel2 => {
      const dist = patternSpmMap[`${beginPNode.id}-${nodeWithLabel2.id}`];
      dist && patternSpDist[label2].push(dist);
      if (maxDist < dist) maxDist = dist;
      patternNodePairMap[`${beginPNode.id}-${nodeWithLabel2.id}`] = {
        start: 0,
        end: patternNodeMap[nodeWithLabel2.id].idx,
        distance: dist,
      };
    });

    // spDist[label2] 按照从小到大排序
    patternSpDist[label2] = patternSpDist[label2].sort((a, b) => a - b);

    // 计算 Q 中所有 label2 节点到 beginPNode 的 NDS 距离
    // 所有 label2 节点到 beginPNode 的邻居相交诱导子图：
    // key: node1.id-node2.id
    patternIntGraphMap = getIntersectNeighborInducedGraph(
      patternNodePairMap,
      patternKNeighborUnits,
      pattern,
      patternIntGraphMap,
    );
    // pattern 中 beginNode 到当前 label2 节点 的 NDS 距离（数组，无需关心具体对应到哪个节点）
    let currentPatternNDSDistArray = [];
    Object.keys(patternNodePairMap).forEach(key => {
      if (patternNDSDist[key]) {
        currentPatternNDSDistArray.push(patternNDSDist[key]);
        return; // 缓存过则不需要再次计算
      }
      const patternIntGraph = patternIntGraphMap[key];
      patternNDSDist[key] = getMatchedCount(patternIntGraph, dsG, nodeLabelProp, edgeLabelProp);
      currentPatternNDSDistArray.push(patternNDSDist[key]);
    });

    // 根据值为 currentPatternNDSDist 从大到小排序
    currentPatternNDSDistArray = currentPatternNDSDistArray.sort((a, b) => b - a);
    patternNDSDistMap[`${beginPNode.id}-${label2}`] = currentPatternNDSDistArray;

    if (label2 === label) return;

    const candidatesNum = candidates.length;
    for (let m = candidatesNum - 1; m >= 0; m--) {
      const cNode = candidates[m];

      // prune1：若 candidates 中节点 cNode 的 kNeighborUnits 中标签为 label2 的节点个数少于 pattern 中 label2 个数，删去它
      const graphNeighborUnit = kNeighborUnits[nodeMap[cNode.id].idx];
      const graphNeighborUnitCountMap = graphNeighborUnit.nodeLabelCountMap[label2];
      const patternLabel2Num = patternNodeLabelMap[label2].length;
      if (!graphNeighborUnitCountMap || graphNeighborUnitCountMap.count < patternLabel2Num) {
        candidates.splice(m, 1);
        continue;
      }

      // prune2：若 candidates 中节点 cNode 到 kNeighborUnits 中标签为 label2 的节点最短路径大于 patternSpDist[label2]，删去它
      // (prune2 规则即：candidate 相关的最短路径的最大 spDist[label2].length 个，按照大小顺序依次和 patternSpDist[label2] 中的值比较，只要遇到一个是 G > Q 的，就删去这个 candidate)
      let prune2Invalid = false;
      for (let n = 0; n < patternLabel2Num; n++) {
        if (graphNeighborUnitCountMap.dists[n] > patternSpDist[label2][n]) {
          prune2Invalid = true;
          break;
        }
      }
      if (prune2Invalid) {
        candidates.splice(m, 1);
        continue;
      }

      // prune3：若 candidates 中节点 cNode 到 kNeighborUnits 中标签为 label2 的节点 NDS 距离小于 patternNDSDist[beginNode.id-label2]，删去它
      // TODO：prune3，currentPatternNDSDistArray 与 currentNDSDist 的比较

      // 计算 G 中所有 label2 节点到 cNode 的 NDS 距离
      // 所有 label2 节点到 cNode 的邻居相交诱导子图：
      const cNodePairMap = {};
      graphNeighborUnit.neighbors.forEach(neighborNode => {
        const dist = spmMap[`${cNode.id}-${neighborNode.id}`];
        cNodePairMap[`${cNode.id}-${neighborNode.id}`] = {
          start: nodeMap[cNode.id].idx,
          end: nodeMap[neighborNode.id].idx,
          distance: dist,
        };
      });
      // 更新 intGMap
      intGMap = getIntersectNeighborInducedGraph(cNodePairMap, kNeighborUnits, graphData, intGMap);
      // candidate 到它周围 label2 节点的 NDS 距离, key 是 node.id-node.id
      let currentNDSDistArray = [];
      Object.keys(cNodePairMap).forEach(key => {
        if (ndsDist[key]) {
          currentNDSDistArray.push(ndsDist[key]);
          return; // 缓存过则不需要再次计算
        }
        const intGraph = intGMap[key];
        ndsDist[key] = getMatchedCount(intGraph, dsG, nodeLabelProp, edgeLabelProp);
        currentNDSDistArray.push(ndsDist[key]);
      });

      // 根据值为 currentNDSDistArray 从大到小排序
      currentNDSDistArray = currentNDSDistArray.sort((a, b) => b - a);

      let prune3Invalid = false;
      for (let n = 0; n < patternLabel2Num; n++) {
        if (currentNDSDistArray[n] < currentPatternNDSDistArray[n]) {
          prune3Invalid = true;
          break;
        }
      }
      if (prune3Invalid) {
        candidates.splice(m, 1);
        continue;
      }
    }
  });

  const candidateGraphs = [];

  // console.log(
  //   "----- stage3: going to splice neighbors for each candidate graph -------"
  // );

  // candidates 经过筛选后，以每个 candidate 为中心，生成 Length-neighbor 的邻居诱导子图
  // 并在诱导子图中去除不可能在 Q 上找到匹配的点：在 Q 上不存在的 label，其他 label 到 candidate 的最大最短距离符合 Q、NDS 距离符合 Q
  candidates.forEach(candidate => {
    const nodeIdx = nodeMap[candidate.id].idx;
    const lengthNeighborUnit = findKNeighborUnit(
      graphData.nodes,
      spm[nodeIdx],
      nodeIdx,
      nodeLabelProp,
      length,
    );

    const neighborNodes = lengthNeighborUnit.neighbors;

    // 删除不可能找到匹配的邻居点
    const neighborNum = neighborNodes.length;
    let unmatched = false;
    for (let i = neighborNum - 1; i >= 0; i--) {
      // 如果通过裁剪，符合条件的节点数量已过少，说明不能匹配这个 candidate 相关的图
      if (neighborNodes.length + 1 < pattern.nodes.length) {
        unmatched = true;
        return;
      }
      const neighborNode = neighborNodes[i];
      const neighborLabel = neighborNode[nodeLabelProp];
      // prune1: 若该邻居点的 label 不存在于 pattern 中，移除这个点
      if (!patternNodeLabelMap[neighborLabel] || !patternNodeLabelMap[neighborLabel].length) {
        neighborNodes.splice(i, 1);
        continue;
      }

      const key = `${candidate.id}-${neighborNode.id}`;

      // prune2: 若该邻居点到 candidate 的最短路径比和它有相同 label 的节点到 beginPNode 的最大最短路径长度长，移除这个点
      // prune2.1: 如果没有这个标签到 beginPNode 的距离记录，说明 pattern 上（可能 beginPNode 是这个 label）没有其他这个 label 的节点
      if (!patternSpDist[neighborLabel] || !patternSpDist[neighborLabel].length) {
        neighborNodes.splice(i, 1);
        continue;
      }
      // prune2.2
      const distToCandidate = spmMap[key];
      const maxDistWithLabelInPattern =
        patternSpDist[neighborLabel][patternSpDist[neighborLabel].length - 1]; // patternSpDist[neighborLabel] 已经按照从小到大排序
      if (distToCandidate > maxDistWithLabelInPattern) {
        neighborNodes.splice(i, 1);
        continue;
      }

      // prune3: 若该邻居点到 candidate 的 NDS 距离比和它有相同 label 的节点到 beginPNode 的最小 NDS 距离小，移除这个点
      const ndsToCandidate = ndsDist[key]
        ? ndsDist[key]
        : getNDSDist(
            graphData,
            candidate,
            neighborNode,
            nodeMap,
            distToCandidate,
            kNeighborUnits,
            dsG,
            nodeLabelProp,
            edgeLabelProp,
            ndsDist,
            intGMap,
          );
      const patternKey = `${beginPNode.id}-${neighborLabel}`;
      const minNdsWithLabelInPattern =
        patternNDSDistMap[patternKey][patternNDSDistMap[patternKey].length - 1]; // patternNDSDist[key] 一定存在
      if (ndsToCandidate < minNdsWithLabelInPattern) {
        neighborNodes.splice(i, 1);
        continue;
      }

      // prune4: 若该邻居点的度数小于 pattern 同 label 节点最小度数，删去该点
      let minPatternNodeLabelDegree = minPatternNodeLabelDegreeMap[neighborLabel];
      if (minPatternNodeLabelDegree === undefined) {
        minPatternNodeLabelDegree = Infinity;
        patternNodeLabelMap[neighborLabel].forEach(patternNodeWithLabel => {
          const patternNodeDegree = patternNodeMap[patternNodeWithLabel.id].degree;
          if (minPatternNodeLabelDegree > patternNodeDegree)
            minPatternNodeLabelDegree = patternNodeDegree;
        });
        minPatternNodeLabelDegreeMap[neighborLabel] = minPatternNodeLabelDegree;
      }
      if (nodeMap[neighborNode.id].degree < minPatternNodeLabelDegree) {
        neighborNodes.splice(i, 1);
        continue;
      }
    }

    // 节点在个数上符合匹配（不少于 pattern 的节点个数），现在筛选相关边
    if (!unmatched) {
      candidateGraphs.push({
        nodes: [candidate].concat(neighborNodes),
      });
    }
  });

  // console.log(
  //   "----- stage4: going to splice edges and neighbors for each candidate graph -------"
  // );

  const { length: undirectedLengthsToBeginPNode } = dijkstra(pattern, beginPNode.id, false);

  let undirectedLengthsToBeginPNodeLabelMap = {};
  if (directed) {
    Object.keys(undirectedLengthsToBeginPNode).forEach(nodeId => {
      const nodeLabel = patternNodeMap[nodeId].node[nodeLabelProp];
      if (!undirectedLengthsToBeginPNodeLabelMap[nodeLabel])
        undirectedLengthsToBeginPNodeLabelMap[nodeLabel] = [undirectedLengthsToBeginPNode[nodeId]];
      else
        undirectedLengthsToBeginPNodeLabelMap[nodeLabel].push(
          undirectedLengthsToBeginPNode[nodeId],
        );
    });
    Object.keys(undirectedLengthsToBeginPNodeLabelMap).forEach(pLabel => {
      undirectedLengthsToBeginPNodeLabelMap[pLabel].sort((a, b) => a - b);
    });
  } else {
    undirectedLengthsToBeginPNodeLabelMap = patternSpDist;
  }

  // 现在 candidateGraphs 里面只有节点，进行边的筛选
  const candidateGraphNum = candidateGraphs.length;
  for (let i = candidateGraphNum - 1; i >= 0; i--) {
    const candidateGraph = candidateGraphs[i];
    const candidate = candidateGraph.nodes[0];

    const candidateNodeLabelCountMap = {};
    const candidateNodeMap = {};
    candidateGraph.nodes.forEach((node, q) => {
      candidateNodeMap[node.id] = {
        idx: q,
        node,
        degree: 0,
      };
      const cNodeLabel = node[nodeLabelProp];
      if (!candidateNodeLabelCountMap[cNodeLabel]) candidateNodeLabelCountMap[cNodeLabel] = 1;
      else candidateNodeLabelCountMap[cNodeLabel]++;
    });

    // 根据 candidate 和 neighborNodes 中的节点生成 G 的诱导子图
    // 即，将 graphData 上两端都在 candidateGraph.nodes 中的边放入 candidateEdges
    const candidateEdges = [];
    const edgeLabelCountMap = {};
    graphData.edges.forEach(edge => {
      if (candidateNodeMap[edge.source] && candidateNodeMap[edge.target]) {
        candidateEdges.push(edge);
        if (!edgeLabelCountMap[edge[edgeLabelProp]]) edgeLabelCountMap[edge[edgeLabelProp]] = 1;
        else edgeLabelCountMap[edge[edgeLabelProp]]++;
        candidateNodeMap[edge.source].degree++;
        candidateNodeMap[edge.target].degree++;
      }
    });

    // prune：若有一个 edgeLabel 在 candidateGraph 上的个数少于 pattern，去除该图
    const pattenrEdgeLabelNum = Object.keys(patternEdgeLabelMap).length;
    let prunedByEdgeLabel = false;
    for (let e = 0; e < pattenrEdgeLabelNum; e++) {
      const label = Object.keys(patternEdgeLabelMap)[e];
      if (
        !edgeLabelCountMap[label] ||
        edgeLabelCountMap[label] < patternEdgeLabelMap[label].length
      ) {
        prunedByEdgeLabel = true;
        break;
      }
    }
    if (prunedByEdgeLabel) {
      candidateGraphs.splice(i, 1);
      continue;
    }

    // 遍历 candidateEdges，进行边的筛选
    let candidateEdgeNum = candidateEdges.length;

    // prune：若边数过少，去除该图
    if (candidateEdgeNum < pattern.edges.length) {
      candidateGraphs.splice(i, 1);
      break;
    }
    let candidateGraphInvalid = false;
    for (let e = candidateEdgeNum - 1; e >= 0; e--) {
      const edge = candidateEdges[e];
      const edgeLabel = edge[edgeLabelProp];
      const patternEdgesWithLabel = patternEdgeLabelMap[edgeLabel];

      // prune 1: 若边的 label 不存在于 pattern 边 label 中，去除该边
      if (!patternEdgesWithLabel || !patternEdgesWithLabel.length) {
        edgeLabelCountMap[edgeLabel]--;
        // 若这个 label 的 count 减少之后，该 label 的边数不足，去除该图
        if (patternEdgesWithLabel && edgeLabelCountMap[edgeLabel] < patternEdgesWithLabel.length) {
          candidateGraphInvalid = true;
          break;
        }
        candidateEdges.splice(e, 1);
        candidateNodeMap[edge.source].degree--;
        candidateNodeMap[edge.target].degree--;
        continue;
      }

      // prune 2: 若边的 label +两端 label 的三元组关系不能在 pattern 中找到，去除该边
      const sourceLabel = candidateNodeMap[edge.source].node[nodeLabelProp];
      const targetLabel = candidateNodeMap[edge.target].node[nodeLabelProp];

      let edgeMatched = false;
      patternEdgesWithLabel.forEach(patternEdge => {
        const patternSource = patternNodeMap[patternEdge.source].node;
        const patternTarget = patternNodeMap[patternEdge.target].node;
        if (
          patternSource[nodeLabelProp] === sourceLabel &&
          patternTarget[nodeLabelProp] === targetLabel
        )
          edgeMatched = true;
        if (
          !directed &&
          patternSource[nodeLabelProp] === targetLabel &&
          patternTarget[nodeLabelProp] === sourceLabel
        )
          edgeMatched = true;
      });
      if (!edgeMatched) {
        edgeLabelCountMap[edgeLabel]--;
        // 若这个 label 的 count 减少之后，该 label 的边数不足，去除该图
        if (patternEdgesWithLabel && edgeLabelCountMap[edgeLabel] < patternEdgesWithLabel.length) {
          candidateGraphInvalid = true;
          break;
        }
        candidateEdges.splice(e, 1);
        candidateNodeMap[edge.source].degree--;
        candidateNodeMap[edge.target].degree--;
        continue;
      }
    }

    // prune2: 删除边的过程中，发现边数过少/边 label 数过少时，去除该图
    if (candidateGraphInvalid) {
      candidateGraphs.splice(i, 1);
      continue;
    }

    candidateGraph.edges = candidateEdges;

    const { length: lengthsToCandidate } = dijkstra(
      candidateGraph,
      candidateGraph.nodes[0].id,
      false, // 此处计算路径长度用于判断是否连通，因此使用无向图
    );
    Object.keys(lengthsToCandidate)
      .reverse()
      .forEach(targetId => {
        if (targetId === candidateGraph.nodes[0].id || candidateGraphInvalid) return;
        // prune4: 通过上述裁剪，可能导致该邻居子图变为不连通。裁剪掉目前在这个邻居子图中和 candidate（第一个节点）不连通的节点
        if (lengthsToCandidate[targetId] === Infinity) {
          const targetNodeLabel = candidateNodeMap[targetId].node[nodeLabelProp];
          candidateNodeLabelCountMap[targetNodeLabel]--;
          if (
            candidateNodeLabelCountMap[targetNodeLabel] <
            patternNodeLabelMap[targetNodeLabel].length
          ) {
            candidateGraphInvalid = true;
            return;
          }
          candidateGraph.nodes.splice(candidateNodeMap[targetId].idx, 1);
          candidateNodeMap[targetId] = undefined;
          return;
        }
        // prune5: 经过边裁剪后，可能又出现了最短路径过长的节点 （比 pattern 中同 label 的节点到 beginNode 最大最短距离远），删去这些节点
        const nLabel = nodeMap[targetId].node[nodeLabelProp];
        if (
          !undirectedLengthsToBeginPNodeLabelMap[nLabel] ||
          !undirectedLengthsToBeginPNodeLabelMap[nLabel].length ||
          lengthsToCandidate[targetId] >
            undirectedLengthsToBeginPNodeLabelMap[nLabel][
              undirectedLengthsToBeginPNodeLabelMap[nLabel].length - 1
            ]
        ) {
          const targetNodeLabel = candidateNodeMap[targetId].node[nodeLabelProp];
          candidateNodeLabelCountMap[targetNodeLabel]--;
          if (
            candidateNodeLabelCountMap[targetNodeLabel] <
            patternNodeLabelMap[targetNodeLabel].length
          ) {
            candidateGraphInvalid = true;
            return;
          }
          candidateGraph.nodes.splice(candidateNodeMap[targetId].idx, 1);
          candidateNodeMap[targetId] = undefined;
        }
      });

    if (candidateGraphInvalid) {
      candidateGraphs.splice(i, 1);
      continue;
    }

    let degreeChanged = true;
    let loopCount = 0;
    while (degreeChanged && !candidateGraphInvalid) {
      degreeChanged = false;

      // candidate 度数不足，删去该图
      if (candidateNodeMap[candidate.id].degree < patternNodeMap[beginPNode.id].degree) {
        candidateGraphInvalid = true;
        break;
      }
      // candidate label 个数不足，删去该图
      if (
        candidateNodeLabelCountMap[candidate[nodeLabelProp]] <
        patternNodeLabelMap[candidate[nodeLabelProp]].length
      ) {
        candidateGraphInvalid = true;
        break;
      }

      // prune6：去除度数过小的节点
      const currentCandidateNodeNum = candidateGraph.nodes.length;
      for (let o = currentCandidateNodeNum - 1; o >= 0; o--) {
        const cgNode = candidateGraph.nodes[o];
        const nodeDegree = candidateNodeMap[cgNode.id].degree;
        const cNodeLabel = cgNode[nodeLabelProp];
        if (nodeDegree < minPatternNodeLabelDegreeMap[cNodeLabel]) {
          candidateNodeLabelCountMap[cgNode[nodeLabelProp]]--;
          // 节点 label 个数不足
          if (
            candidateNodeLabelCountMap[cgNode[nodeLabelProp]] <
            patternNodeLabelMap[cgNode[nodeLabelProp]].length
          ) {
            candidateGraphInvalid = true;
            break;
          }
          candidateGraph.nodes.splice(o, 1);
          candidateNodeMap[cgNode.id] = undefined;
          degreeChanged = true;
        }
      }
      if (candidateGraphInvalid || (!degreeChanged && loopCount !== 0)) break;
      // 经过 prune5 节点裁剪，删去端点已经不在 candidateGraph 中的边
      candidateEdgeNum = candidateEdges.length;
      for (let y = candidateEdgeNum - 1; y >= 0; y--) {
        const cedge = candidateEdges[y];
        if (!candidateNodeMap[cedge.source] || !candidateNodeMap[cedge.target]) {
          candidateEdges.splice(y, 1);
          const edgeLabel = cedge[edgeLabelProp];
          edgeLabelCountMap[edgeLabel]--;
          candidateNodeMap[cedge.source] && candidateNodeMap[cedge.source].degree--;
          candidateNodeMap[cedge.target] && candidateNodeMap[cedge.target].degree--;
          // 边 label 数量不足
          if (
            patternEdgeLabelMap[edgeLabel] &&
            edgeLabelCountMap[edgeLabel] < patternEdgeLabelMap[edgeLabel].length
          ) {
            candidateGraphInvalid = true;
            break;
          }
          degreeChanged = true;
        }
      }
      loopCount++;
    }

    if (candidateGraphInvalid) {
      candidateGraphs.splice(i, 1);
      continue;
    }

    // prune: 若节点/边数过少，节点/边 label 过少，去掉这个图
    if (
      candidateGraphInvalid ||
      candidateGraph.nodes.length < pattern.nodes.length ||
      candidateEdges.length < pattern.edges.length
    ) {
      candidateGraphs.splice(i, 1);
      continue;
    }
  }

  // 此时已经生成的多个 candidateGraphs，可能有重复

  // console.log(
  //   "----- stage5: going to splice dulplicated candidate graphs -------"
  // );

  // 删去 candidateGraphs 中一模一样的子图，通过边的 node-node-edgeLabel 作为 key，这类边个数作为 value，进行匹配
  let currentLength = candidateGraphs.length;
  for (let i = 0; i <= currentLength - 1; i++) {
    const cg1 = candidateGraphs[i];
    const cg1EdgeMap = {}; // [node1.id-node2.id-edge.label]: count
    cg1.edges.forEach(edge => {
      const key = `${edge.source}-${edge.target}-${edge.label}`;
      if (!cg1EdgeMap[key]) cg1EdgeMap[key] = 1;
      else cg1EdgeMap[key]++;
    });

    for (let j = currentLength - 1; j > i; j--) {
      const cg2 = candidateGraphs[j];
      const cg2EdgeMap = {}; // [node1.id-node2.id-edge.label]: count
      cg2.edges.forEach(edge => {
        const key = `${edge.source}-${edge.target}-${edge.label}`;
        if (!cg2EdgeMap[key]) cg2EdgeMap[key] = 1;
        else cg2EdgeMap[key]++;
      });

      let same = true;
      if (Object.keys(cg2EdgeMap).length !== Object.keys(cg1EdgeMap).length) {
        same = false;
      } else {
        Object.keys(cg1EdgeMap).forEach(key => {
          if (cg2EdgeMap[key] !== cg1EdgeMap[key]) same = false;
        });
      }
      if (same) {
        candidateGraphs.splice(j, 1);
      }
    }
    currentLength = candidateGraphs.length;
  }

  return candidateGraphs;
};

export default GADDI;
