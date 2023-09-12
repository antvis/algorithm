import { floydWarshall } from './floydWarshall';
import { Matrix, Graph, GraphData, IEdge, INode } from './types';
import gSpan, { EdgeMap, NodeMap } from './gSpan/gSpan';
import { dijkstra } from './dijkstra';
import { Graph as GraphCore, ID } from '@antv/graphlib';

let uniqueId = 1;

/** Node pairs map. */
interface NodePairMap {
  /** key is formatted as startNodeIdx-endNodeIdx */
  [key: string]: {
    /** ids of the first node */
    start: number;
    /** ids of the second node */
    end: number;
    /** the shortest path between these two nodes */
    distance: number;
  };
}

interface LabelMap {
  [label: string]: any;
}

/** Neighbor unit. */
interface NeighborUnit {
  nodeId: ID;
  nodeIdx: number;
  /** the first one is nodeIdx */
  nodeIdxs: number[];
  neighbors: any[]; //
  neighborNum: number;
  nodeLabelCountMap: {
    [label: string]: {
      count: number;
      /** Distances array, sortted from small to large */
      dists: number[];
    };
  };
}

/** Induced subgraph map of neighbor intersection for node pairs */
interface InterGraphMap {
  /** The key format consists of the indices of node pairs: beginIdx-endIdx, corresponding to nodePairMap */
  [key: string]: GraphData;
}

/**
 *  Generates an array of neighbor units for each node in graphData.
 *  @param {GraphData} graphData - The graph data.
 *  @param {Matrix[]} spm - The shortest path matrix.
 *  @param {string} [nodeLabelProp='cluster'] - The property name of the node label.
 *  @param {number} [k=2] - The number of nearest neighbors to find.
 *  @returns {NeighborUnit[]} - An array of neighbor units.
 * */
const findKNeighborUnits = (
  graphData: GraphData,
  spm: Matrix[],
  nodeLabelProp: string = 'cluster',
  k: number = 2
): NeighborUnit[] => {
  const units: NeighborUnit[] = [];
  const nodes = graphData.nodes;
  spm.forEach((row: number[], i) => {
    units.push(findKNeighborUnit(nodes, row, i, nodeLabelProp, k));
  });
  return units;
};
/**
 * Finds the neighbor unit for a given node.
 * @param {INode[]} nodes - The array of nodes.
 * @param {number[]} row - The row of proximity values from the sparse proximity matrix.
 * @param {number} i - The index of the node.
 * @param {string} nodeLabelProp - The property name of the node label.
 * @param {number} k - The number of nearest neighbors.
 * @returns {NeighborUnit} - The neighbor unit for the node.
 * */
const findKNeighborUnit = (
  nodes: INode[],
  row: number[],
  i: number,
  nodeLabelProp: string,
  k: number
) => {
  const unitNodeIdxs = [i];
  const neighbors: INode[] = [];
  const labelCountMap: { [key: string]: { count: number; dists: number[] } } =
    {};
  row.forEach((v, j) => {
    if (v <= k && i !== j) {
      unitNodeIdxs.push(j);
      neighbors.push(nodes[j]);
      const label = nodes[j].data[nodeLabelProp] as string;
      if (!labelCountMap[label]) {
        labelCountMap[label] = { count: 1, dists: [v] };
      } else {
        labelCountMap[label].count++;
        labelCountMap[label].dists.push(v);
      }
    }
  });
  // Sort the dists in labelCountMap in ascending order for later use
  Object.keys(labelCountMap).forEach((label) => {
    labelCountMap[label].dists = labelCountMap[label].dists.sort(
      (a, b) => a - b
    );
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
 * Randomly finds node pairs that satisfy the distance criterion of being less than k.
 * @param {number} k - The value of k for k-nearest neighbors.
 * @param {number} nodeNum - The number of nodes.
 * @param {number} maxNodePairNum - The maximum number of node pairs to be found.
 * @param {NeighborUnit[]} kNeighborUnits - The array of neighbor units.
 * @param {Matrix[]} spm - The shortest path matrix.
 * @returns {NodePairMap} - The map of node pairs.
 * */
const findNodePairsRandomly = (
  k: number,
  nodeNum: number,
  maxNodePairNum: number,
  kNeighborUnits: NeighborUnit[],
  spm: Matrix[]
): NodePairMap => {
  // Find the pairs randomly for each node
  let nodePairNumEachNode = Math.ceil(maxNodePairNum / nodeNum);
  const nodePairMap: {
    [key: string]: { start: number; end: number; distance: number };
  } = {};
  let foundNodePairCount = 0;

  // Traverse the nodes and find nodePairNumEachNode pairs of nodes, each pair has distance smaller than k.
  kNeighborUnits.forEach((unit, i) => {
    // If the number of pairs does not reach nodePairNumEachNode, or the loop times is smaller than (2 * nodeNum), keep looping.
    let nodePairForICount = 0;
    let outerLoopCount = 0;
    const neighbors = unit.nodeIdxs; // the first one is the center node
    const neighborNum = unit.neighborNum - 1;
    const visited: { [key: number]: boolean } = {};
    while (nodePairForICount < nodePairNumEachNode) {
      // The other node's indx in the nodes array
      let oidx = neighbors[1 + Math.floor(Math.random() * neighborNum)];
      let innerLoopCount = 0;
      // If the idx of the other end does not meet the requirement, keep looping to random.
      // The requirements are: not the same node, not used, distance smaller than k.
      while (
        spm[i][oidx] > k &&
        (visited[oidx] ||
          nodePairMap[`${i}-${oidx}`] ||
          nodePairMap[`${oidx}-${i}`])
      ) {
        oidx = Math.floor(Math.random() * nodeNum);
        visited[oidx] = true;
        innerLoopCount++;
        // Break the loop when the loop times is bigger than (2 * nodeNum) to avoid endless loop.
        if (innerLoopCount > 2 * nodeNum) break;
      }
      if (innerLoopCount < 2 * nodeNum) {
        // The loop times does not reach the maximum, means the proper other end is found
        nodePairMap[`${i}-${oidx}`] = {
          start: i,
          end: oidx,
          distance: spm[i][oidx],
        };
        nodePairForICount++;
        foundNodePairCount++;
        // When the number of the node pairs reaches the maxNodePairNum, return
        if (foundNodePairCount >= maxNodePairNum) return nodePairMap;
      }
      outerLoopCount++;
      // Break when the loop times reaches the maximum (2 * nodeNum) to avoid endless loop
      if (outerLoopCount > 2 * nodeNum) break;
    }
    // The node does not have enough node pairs. Update nodePairNumEachNode to find more pairs for other nodes.
    if (nodePairForICount < nodePairNumEachNode) {
      const gap = nodePairNumEachNode - nodePairForICount;
      nodePairNumEachNode = (nodePairNumEachNode + gap) / (nodeNum - i - 1);
    }
  });
  return nodePairMap;
};

/**
 * Computes the induced subgraph of the intersection neighbor induced by all node pairs in nodePairMap.
 * @param {NodePairMap} nodePairMap - The map of node pairs, where the key is "node1.id-node2.id" and the value is { start: startNodeIdx, end: endNodeIdx, distance }.
 * @param {NeighborUnit[]} neighborUnits - The array of neighbor units for each node.
 * @param {GraphData} graphData - The original graph data.
 * @param {InterGraphMap} cachedInducedGraphMap - The cached results to avoid redundant computations. If a key exists in the cache, the result is already computed and stored.
 * @returns {InterGraphMap} - The map of induced subgraphs for each node pair.
 * */
const getIntersectNeighborInducedGraph = (
  nodePairMap: NodePairMap,
  neighborUnits: NeighborUnit[],
  graphData: GraphData,
  cachedInducedGraphMap?: InterGraphMap
): InterGraphMap => {
  let usingCachedInducedGraphmap = cachedInducedGraphMap;
  const nodes = graphData.nodes;
  if (!usingCachedInducedGraphmap) usingCachedInducedGraphmap = {};
  Object.keys(nodePairMap).forEach((key) => {
    if (usingCachedInducedGraphmap && usingCachedInducedGraphmap[key]) return;
    usingCachedInducedGraphmap[key] = { nodes: [], edges: [] };
    const pair = nodePairMap[key];
    const startUnitNodeIds = neighborUnits[pair.start]?.nodeIdxs;
    const endUnitNodeIds = neighborUnits[pair.end]?.nodeIdxs;
    // Return empty graph if there are no neighbor units
    if (!startUnitNodeIds || !endUnitNodeIds) return;
    const endSet = new Set(endUnitNodeIds);
    const intersect = startUnitNodeIds.filter((x) => endSet.has(x));
    // Return empty graph if there is no intersection
    if (!intersect || !intersect.length) return;
    const intersectIdMap: { [key: string]: boolean } = {};
    const intersectLength = intersect.length;
    for (let i = 0; i < intersectLength; i++) {
      const node = nodes[intersect[i]];
      // Add intersected nodes to the induced subgraph
      usingCachedInducedGraphmap[key].nodes.push(node);
      intersectIdMap[node.id] = true;
    }
    graphData.edges.forEach((edge) => {
      if (intersectIdMap[edge.source] && intersectIdMap[edge.target]) {
        // Add edges to the induced subgraph if both endpoints are in the intersection
        usingCachedInducedGraphmap[key].edges.push(edge);
      }
    });
  });
  return usingCachedInducedGraphmap;
};

/**
 * Computes the number of matches of the structure on the graph.
 * @param {GraphData} graph - The graph data.
 * @param {GraphData} structure - The structure to match, currently only supports the simplest structure with two nodes and one edge.
 * @param {string} nodeLabelProp - The property name for node labels.
 * @param {string} edgeLabelProp - The property name for edge labels.
 * @returns {number} - The number of matches.
 * */
const getMatchedCount = (
  graph: GraphData,
  structure: GraphData,
  nodeLabelProp: string,
  edgeLabelProp: string
) => {
  const nodeMap: Map<ID, INode> = new Map();
  graph.nodes.forEach((node) => {
    nodeMap.set(node.id, node);
  });
  let count = 0;
  if (!structure?.edges?.length || structure?.nodes?.length < 2) return 0;
  graph.edges.forEach((e) => {
    const sourceLabel = nodeMap.get(e.source).data[nodeLabelProp];
    const targetLabel = nodeMap.get(e.target).data[nodeLabelProp];
    const strNodeLabel1 = structure?.nodes[0].data[nodeLabelProp];
    const strNodeLabel2 = structure?.nodes[1].data[nodeLabelProp];
    const strEdgeLabel = structure?.edges[0].data[edgeLabelProp];

    if (e.data[edgeLabelProp] !== strEdgeLabel) return;
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
 * Finds the most representative structure among structures. This structure minimizes the intra-cluster distance and maximizes the inter-cluster distance based on the matchedCountMap grouping.
 * @param {Array} matchedCountMap - The matched count map for each structure grouping, in the format { [graphId]: count }.
 * @param {number} structureNum - The number of structures, corresponding to the length of matchedCountMap.
 * @param {Array} structures - The array of structures.
 * @returns {Object} - The most representative structure and its count map.
 **/
const findRepresentStructure = (
  matchedCountMap: { [graphId: string]: number }[],
  structureNum: number,
  structures: GraphData[]
) => {
  let maxOffset = Infinity;
  let representClusterType = 0;
  for (let i = 0; i < structureNum; i++) {
    // Group's map, key is the keys in intGraph, values is the number of matches in structures[i]
    const countMapI = matchedCountMap[i];
    // Sort the array bay value, and generate the array of keys:
    const sortedGraphKeys = Object.keys(countMapI).sort((a, b) => {
      return countMapI[a] - countMapI[b];
    });

    // 100 graphKeys in total, devided groupKeys into groupNum groups in order
    const groupNum = 10;
    const clusters: {
      graphs: string[];
      totalCount: number;
      aveCount: number;
    }[] = []; // groupNum items
    sortedGraphKeys.forEach((key, j) => {
      if (!clusters[j % groupNum]) {
        clusters[j % groupNum] = { graphs: [], totalCount: 0, aveCount: 0 };
      }
      clusters[j % groupNum].graphs.push(key);
      clusters[j % groupNum].totalCount += countMapI[key];
    });

    // Calculate the distance innerDist between cluster and cluster, and inner distance intraDist inside each cluster.
    let aveIntraDist = 0; // The average distances inside the cluster
    const aveCounts: number[] = []; // The average of number of matches inside the cluster, will be used to calculate thedistance between clusters.
    clusters.forEach((graphsInCluster) => {
      // Average count inside the cluster
      const aveCount =
        graphsInCluster.totalCount / graphsInCluster.graphs.length;
      graphsInCluster.aveCount = aveCount;
      aveCounts.push(aveCount);

      // Calculate the average distance inside each cluster
      let aveIntraPerCluster = 0;
      const graphsNum = graphsInCluster.graphs.length;
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

    // Calculate the distance between clusters with the average inside the cluster
    let aveInterDist = 0; // 类间间距平均值
    aveCounts.forEach((aveCount1, j) => {
      aveCounts.forEach((aveCount2, k) => {
        if (j === k) return;
        aveInterDist += Math.abs(aveCount1 - aveCount2);
      });
      aveInterDist /= (aveCounts.length * (aveCounts.length - 1)) / 2;
    });

    // Find the group with max(average distance between clusters - average dictance inside a cluster). The corresponding structure is the target DS(G).
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

const getNodeMaps = (
  nodes: INode[],
  nodeLabelProp: string
): { nodeMap: NodeMap; nodeLabelMap: LabelMap } => {
  const nodeMap: NodeMap = {};
  const nodeLabelMap: LabelMap = {};
  nodes.forEach((node, i) => {
    nodeMap[node.id] = { idx: i, node, degree: 0, inDegree: 0, outDegree: 0 };
    const label = node.data[nodeLabelProp] as string;
    if (!nodeLabelMap[label]) nodeLabelMap[label] = [];
    nodeLabelMap[label].push(node);
  });
  return { nodeMap, nodeLabelMap };
};

const getEdgeMaps = (
  edges: IEdge[],
  edgeLabelProp: string,
  nodeMap: NodeMap
): { edgeMap: EdgeMap; edgeLabelMap: LabelMap } => {
  const edgeMap: { [key: string]: { idx: number; edge: IEdge } } = {};
  const edgeLabelMap: { [key: string]: IEdge[] } = {};
  edges.forEach((edge, i) => {
    edgeMap[`${uniqueId++}`] = { idx: i, edge };
    const label = edge.data[edgeLabelProp] as string;
    if (!edgeLabelMap[label]) edgeLabelMap[label] = [];
    edgeLabelMap[label].push(edge);

    const sourceNode = nodeMap[edge.source];
    if (sourceNode) {
      sourceNode.degree++;
      sourceNode.outDegree++;
    }
    const targetNode = nodeMap[edge.target];
    if (targetNode) {
      targetNode.degree++;
      targetNode.inDegree++;
    }
  });
  return { edgeMap, edgeLabelMap };
};

/**
 * Generates a map of the shortest paths, where the key is in the format sourceNode.id-targetNode.id, and the value is the shortest path length between the two nodes.
 * @param {Array} nodes - The array of nodes.
 * @param {Array} spm - The shortest path matrix.
 * @param {boolean} directed - Indicates if the graph is directed or not.
 * @returns {Object} - The map of shortest paths.
 */
const getSpmMap = (
  nodes: INode[],
  spm: number[][],
  directed: boolean
): { [key: string]: number } => {
  const length = spm.length;
  const map: { [key: string]: number } = {};
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
 * Calculates the NDS distance between a pair of nodes (node1, node2).
 * @param {Object} graph - The original graph data.
 * @param {Object} node1 - The first node.
 * @param {Object} node2 - The second node.
 * @param {Object} nodeMap - The map of nodes.
 * @param {number} spDist - The shortest path distance between the nodes.
 * @param {Array} kNeighborUnits - The array of k-neighbor units.
 * @param {Object} structure - The structure graph data.
 * @param {string} nodeLabelProp - The node label property.
 * @param {string} edgeLabelProp - The edge label property.
 * @param {Object} cachedNDSMap - The cached NDS map.
 * @param {Object} cachedInterInducedGraph - The cached inter-induced graph map.
 * @returns {number} - The NDS distance.
 * */
const getNDSDist = (
  graph: GraphData,
  node1: INode,
  node2: INode,
  nodeMap: NodeMap,
  spDist: number,
  kNeighborUnits: NeighborUnit[],
  structure: GraphData,
  nodeLabelProp: string,
  edgeLabelProp: string,
  cachedNDSMap: { [key: string]: number },
  cachedInterInducedGraph: InterGraphMap
) => {
  let usingCachedInterInducedGraph = cachedInterInducedGraph;
  const key = `${node1.id}-${node2.id}`;
  if (cachedNDSMap && cachedNDSMap[key]) return cachedNDSMap[key];
  let interInducedGraph = usingCachedInterInducedGraph
    ? usingCachedInterInducedGraph[key]
    : undefined;
  // If there is no cached intersected induced graph, calculate it
  if (!interInducedGraph) {
    const pairMap: NodePairMap = {
      [key]: {
        start: nodeMap[node1.id].idx as number,
        end: nodeMap[node2.id].idx as number,
        distance: spDist,
      },
    };

    usingCachedInterInducedGraph = getIntersectNeighborInducedGraph(
      pairMap,
      kNeighborUnits,
      graph,
      usingCachedInterInducedGraph
    );
    interInducedGraph = usingCachedInterInducedGraph[key];
  }

  return getMatchedCount(
    interInducedGraph,
    structure,
    nodeLabelProp,
    edgeLabelProp
  );
};

/**
 * Calculates the degrees of nodes in the pattern and stores them in the minPatternNodeLabelDegreeMap.
 * @param {Object} minPatternNodeLabelDegreeMap - The map for storing the minimum degrees of nodes in the pattern.
 * @param {string} neighborLabel - The label of the neighbor.
 * @param {Object} patternNodeMap - The map of nodes in the pattern.
 * @param {Object} patternNodeLabelMap - The map of node labels in the pattern.
 * @returns {Object} - The minimum degrees of nodes in the pattern.
 * */
const stashPatternNodeLabelDegreeMap = (
  minPatternNodeLabelDegreeMap: {
    [key: string]: {
      degree: number;
      inDegree: number;
      outDegree: number;
    };
  },
  neighborLabel: string,
  patternNodeMap: NodeMap,
  patternNodeLabelMap: LabelMap
) => {
  let minPatternNodeLabelDegree =
    minPatternNodeLabelDegreeMap[neighborLabel]?.degree;
  let minPatternNodeLabelInDegree =
    minPatternNodeLabelDegreeMap[neighborLabel]?.inDegree;
  let minPatternNodeLabelOutDegree =
    minPatternNodeLabelDegreeMap[neighborLabel]?.outDegree;

  if (minPatternNodeLabelDegreeMap[neighborLabel] === undefined) {
    minPatternNodeLabelDegree = Infinity;
    minPatternNodeLabelInDegree = Infinity;
    minPatternNodeLabelOutDegree = Infinity;
    patternNodeLabelMap[neighborLabel].forEach(
      (patternNodeWithLabel: INode) => {
        const patternNodeDegree =
          patternNodeMap[patternNodeWithLabel.id].degree;
        if (minPatternNodeLabelDegree > patternNodeDegree) {
          minPatternNodeLabelDegree = patternNodeDegree;
        }
        const patternNodeInDegree =
          patternNodeMap[patternNodeWithLabel.id].inDegree;
        if (minPatternNodeLabelInDegree > patternNodeInDegree) {
          minPatternNodeLabelInDegree = patternNodeInDegree;
        }
        const patternNodeOutDegree =
          patternNodeMap[patternNodeWithLabel.id].outDegree;
        if (minPatternNodeLabelOutDegree > patternNodeOutDegree) {
          minPatternNodeLabelOutDegree = patternNodeOutDegree;
        }
      }
    );
    minPatternNodeLabelDegreeMap[neighborLabel] = {
      degree: minPatternNodeLabelDegree,
      inDegree: minPatternNodeLabelInDegree,
      outDegree: minPatternNodeLabelOutDegree,
    };
  }

  return {
    minPatternNodeLabelDegree,
    minPatternNodeLabelInDegree,
    minPatternNodeLabelOutDegree,
  };
};

/**
 * GADDI Pattern Match.
 * @param graph The graphlib structure storing the original data
 * @param pattern The pattern graph data to search
 * @param directed Whether it is a directed graph, false by default
 * @param k k-nearest-neighbors
 * @param length length
 * @param nodeLabelProp The field name for the label (clustering info) in the node data, 'cluster' by default
 * @param edgeLabelProp The field name for the label (clustering info) in the edge data, 'cluster' by default
 */
export const GADDI = (
  graph: Graph,
  pattern: GraphData,
  directed: boolean = false,
  k: number,
  length: number,
  nodeLabelProp: string = 'cluster',
  edgeLabelProp: string = 'cluster'
): GraphData[] => {
  const graphData = {
    nodes: graph.getAllNodes(),
    edges: graph.getAllEdges(),
  };
  if (!graph || !graphData.nodes) return;
  const patternGraph = new GraphCore(pattern);
  let usingLength = length;
  let usingK = k;

  // Three steps:
  // 0. Pre-processing: number of nodes/edges, adjacency matrix, shortest path distance matrix
  // 1. Processing original graph data in 5 steps
  // 2. Matching

  // console.log("----- stage-pre: preprocessing -------");

  // -------- Step 0: Pre-processing: number of nodes/edges, adjacency matrix, shortest path distance matrix-------
  const nodeNum = graphData.nodes.length;
  if (!nodeNum) return;
  // console.log("----- stage-pre.1: calc shortest path matrix for graph -------");
  const spm = floydWarshall(graph, directed);
  // console.log(
  //   "----- stage-pre.2: calc shortest path matrix for pattern -------"
  // );
  const patternSpm = floydWarshall(patternGraph, directed);
  // console.log(
  //   "----- stage-pre.3: calc shortest path matrix map for graph -------"
  // );
  const spmMap = getSpmMap(graphData.nodes, spm, directed);
  // console.log(
  //   "----- stage-pre.4: calc shortest path matrix map for pattern -------"
  // );
  const patternSpmMap = getSpmMap(pattern.nodes, patternSpm, directed);

  // console.log("----- stage-pre.5: establish maps -------");
  // A node map is created to map nodes to their IDs, facilitating fast retrieval in subsequent operations.
  const { nodeMap, nodeLabelMap } = getNodeMaps(graphData.nodes, nodeLabelProp);
  const { nodeMap: patternNodeMap, nodeLabelMap: patternNodeLabelMap } =
    getNodeMaps(pattern.nodes, nodeLabelProp);

  // Calculate the node degrees
  getEdgeMaps(graphData.edges, edgeLabelProp, nodeMap);

  const { edgeLabelMap: patternEdgeLabelMap } = getEdgeMaps(
    pattern.edges,
    edgeLabelProp,
    patternNodeMap
  );

  // If the length is not assigned, calculate the radius (max shortest path distance) of the pattern
  let patternSpmSpread: number[] = [];
  patternSpm?.forEach((row) => {
    patternSpmSpread = patternSpmSpread.concat(row);
  });
  if (!usingLength) usingLength = Math.max(...patternSpmSpread, 2);
  if (!usingK) usingK = usingLength;

  // console.log("----- stage-pre.6: calc k neighbor units -------");
  // Calculate the k-nearest-neighbor collection for each node
  const kNeighborUnits = findKNeighborUnits(
    graphData,
    spm,
    nodeLabelProp,
    usingK
  );
  const patternKNeighborUnits = findKNeighborUnits(
    pattern,
    patternSpm,
    nodeLabelProp,
    usingK
  );

  // console.log(
  //   "----- stage0: going to processing graph and find intersect neighbor induced graphs -------"
  // );

  // console.log("----- stage0.1: going to select random node pairs -------");
  // -------- Step 1: Processing the original graph data-------

  // 1.1. Find 100 node pairs in max, the distance smaller than Length and k
  // When the number of nodes in graphData is smaller then  20, 100 node pairs are not able to be found. Only find no more than n(n-1)/2 pairs.
  const maxNodePairNum = Math.min(100, (nodeNum * (nodeNum - 1)) / 2);
  const nodePairsMap = findNodePairsRandomly(
    usingK,
    nodeNum,
    maxNodePairNum,
    kNeighborUnits,
    spm
  );

  // console.log(
  //   "----- stage0.2: going to calculate intersect neighbor induced graphs -------"
  // );
  // 1.2. Generate the intersected induced neighbor subgraph for each node pairs, formatted as {'beginNodeIdx-endNodeIdx': {nodes: [], edges: []}}
  let intGMap = getIntersectNeighborInducedGraph(
    nodePairsMap,
    kNeighborUnits,
    graphData
  );
  // 1.3. Calculate the top frequent sub structures with 3-4 edges in ISIntG, with gSpan(frequent graph mining) algorithm
  const top = 10;
  const params = {
    graphs: intGMap,
    nodeLabelProp,
    edgeLabelProp,
    minSupport: 1,
    minNodeNum: 1,
    maxNodeNum: 4,
    directed,
  };

  // console.log(
  //   "----- stage1: (gSpan) going to find frequent structure dsG -------"
  // );
  // console.log("----- stage1.1: going to run gSpan -------");
  // suppose that the generated sub structure has only one edge
  const freStructures = gSpan(params).slice(0, top);
  // structureNum can be less than top
  const structureNum = freStructures.length;

  // 1.4. Calculate the number of matches of each induced subgraph in intGMap
  const matchedCountMap: { [key: string]: number }[] = [];
  freStructures.forEach((structure, i) => {
    matchedCountMap[i] = {};
    Object.keys(intGMap).forEach((key) => {
      const graph = intGMap[key];
      const subStructureCount = getMatchedCount(
        graph,
        structure,
        nodeLabelProp,
        edgeLabelProp
      );
      matchedCountMap[i][key] = subStructureCount;
    });
  });

  // console.log(
  //   "----- stage1.1: going to find the most represent strucutre -------"
  // );

  // 1.5. For each sub structure, group the induced sub graph in initGMap accroding to the matches number. There will be structureNum groups.
  // Calculate the intra and inner distances of each group, find the max and min groups. These groups' corresponding su structure will be selected as the representing structure DS(G)
  const { structure: dsG, structureCountMap: ndsDist } = findRepresentStructure(
    matchedCountMap,
    structureNum,
    freStructures
  );

  // -------- Step 2: Matching-------
  // 2.1 找到从 Q 中的一个节点作为起始节点，寻找 G 中的匹配。这个其实节点的标签可以在 G 中找到最多的节点
  let beginPNode = pattern.nodes[0];
  let candidates: INode[] = [];
  let label = pattern.nodes[0]?.data[nodeLabelProp];
  let maxNodeNumWithSameLabel = -Infinity;
  pattern.nodes.forEach((node) => {
    const pLabel = node.data[nodeLabelProp] as string;
    const nodesWithSameLabel = nodeLabelMap[pLabel];
    if (nodesWithSameLabel?.length > maxNodeNumWithSameLabel) {
      maxNodeNumWithSameLabel = nodesWithSameLabel.length;
      candidates = nodesWithSameLabel;
      label = pLabel;
      beginPNode = node;
    }
  });

  // console.log("----- stage2: going to find candidates -------");

  // Global caching is used to avoid redundant calculations.
  const minPatternNodeLabelDegreeMap = {}; // Key is label, value is the minimum degree of the nodes with label
  let patternIntGraphMap: InterGraphMap = {};
  const patternNDSDist: { [key: string]: number } = {}; // key is node.id-node.id
  const patternNDSDistMap: { [key: string]: number[] } = {}; // key is node.id-label2, value nds array is sortted from large to small
  // 2.2.2 For the k nodes with another label in Q, calculate the shortest path distance to the node and the NDS distance
  const patternSpDist: { [key: string]: number[] } = {};
  const patternSpDistBack: { [key: string]: number[] } = {};
  Object.keys(patternNodeLabelMap).forEach((label2, j) => {
    patternSpDist[label2] = [];
    if (directed) {
      patternSpDistBack[label2] = [];
    }
    let maxDist = -Infinity;
    const patternNodesWithLabel2 = patternNodeLabelMap[label2];
    const patternNodePairMap: {
      [key: string]: {
        start: number;
        end: number;
        distance: number;
      };
    } = {};
    patternNodesWithLabel2.forEach((nodeWithLabel2: INode) => {
      const dist = patternSpmMap[`${beginPNode.id}-${nodeWithLabel2.id}`];
      dist && patternSpDist[label2].push(dist);
      if (maxDist < dist) maxDist = dist;
      patternNodePairMap[`${beginPNode.id}-${nodeWithLabel2.id}`] = {
        start: 0,
        end: patternNodeMap[nodeWithLabel2.id].idx,
        distance: dist,
      };
      if (directed) {
        const distBack = patternSpmMap[`${nodeWithLabel2.id}-${beginPNode.id}`];
        distBack && patternSpDistBack[label2].push(distBack);
      }
    });

    // spDist[label2] sortted from small to large
    patternSpDist[label2] = patternSpDist[label2].sort((a, b) => a - b);
    if (directed) {
      patternSpDistBack[label2] = patternSpDistBack[label2].sort(
        (a, b) => a - b
      );
    }

    // Calculate NDS distances from all the nodes in Q with label2 to beginPNode
    // The intersected neighbor induced subgraph from label2 nodes to beginPNode:
    // key: node1.id-node2.id
    patternIntGraphMap = getIntersectNeighborInducedGraph(
      patternNodePairMap,
      patternKNeighborUnits,
      pattern,
      patternIntGraphMap
    );
    // array of NDS distances from beginNode in pattern to the current node with label2, the corresponding relations does not matter
    let currentPatternNDSDistArray: number[] = [];
    Object.keys(patternNodePairMap).forEach((key) => {
      if (patternNDSDist[key]) {
        currentPatternNDSDistArray.push(patternNDSDist[key]);
        // If it is cached, no need to calculate again
        return;
      }
      const patternIntGraph = patternIntGraphMap[key];
      patternNDSDist[key] = getMatchedCount(
        patternIntGraph,
        dsG,
        nodeLabelProp,
        edgeLabelProp
      );
      currentPatternNDSDistArray.push(patternNDSDist[key]);
    });

    // Sortted by currentPatternNDSDist from large to small
    currentPatternNDSDistArray = currentPatternNDSDistArray.sort(
      (a, b) => b - a
    );
    patternNDSDistMap[`${beginPNode.id}-${label2}`] =
      currentPatternNDSDistArray;

    if (label2 === label) return;

    const candidatesNum = candidates?.length || 0;
    for (let m = candidatesNum - 1; m >= 0; m--) {
      const cNode = candidates[m];

      // prune1: If the number of nodes with label2 in the kNeighborUnits of node cNode in candidates is less than the number of nodes with label2 in the pattern, remove it.
      const graphNeighborUnit = kNeighborUnits[nodeMap[cNode.id].idx];
      const graphNeighborUnitCountMap =
        graphNeighborUnit.nodeLabelCountMap[label2];
      const patternLabel2Num = patternNodeLabelMap[label2].length;
      if (
        !graphNeighborUnitCountMap ||
        graphNeighborUnitCountMap.count < patternLabel2Num
      ) {
        candidates.splice(m, 1);
        continue;
      }

      // prune2: If the shortest path from node cNode in candidates to any node with label2 in the kNeighborUnits is greater than patternSpDist[label2], remove it.
      // The prune2 rule states that for each candidate, we compare the top spDist[label2].length shortest path distances from the candidate to any node with label2 in the kNeighborUnits,
      // in order of their magnitude, with the corresponding values in patternSpDist[label2]. If we encounter a value where G > Q, we remove that candidate.
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

      // prune3: If the NDS distance from node cNode in candidates to any node with label2 in the kNeighborUnits is less than patternNDSDist[beginNode.id-label2], remove it.
      // TODO：prune3: compare currentPatternNDSDistArray and currentNDSDist

      // Calculate the NDS distances from all the nodes in label2 in G to the cNode
      // All the intersected neighbor induced subgraph of nodes with label2 to cNode:
      const cNodePairMap: {
        [key: string]: { start: number; end: number; distance: number };
      } = {};
      graphNeighborUnit.neighbors.forEach((neighborNode) => {
        const dist = spmMap[`${cNode.id}-${neighborNode.id}`];
        cNodePairMap[`${cNode.id}-${neighborNode.id}`] = {
          start: nodeMap[cNode.id].idx,
          end: nodeMap[neighborNode.id].idx,
          distance: dist,
        };
      });
      // Update intGMap
      intGMap = getIntersectNeighborInducedGraph(
        cNodePairMap,
        kNeighborUnits,
        graphData,
        intGMap
      );
      // NDS distance from candidate to the neighbor nodes with label2, key is node.id-node.id
      let currentNDSDistArray: number[] = [];
      Object.keys(cNodePairMap).forEach((key) => {
        if (ndsDist[key]) {
          currentNDSDistArray.push(ndsDist[key]);
          return; // If it is cached, there is no need to calculate it again.
        }
        const intGraph = intGMap[key];
        ndsDist[key] = getMatchedCount(
          intGraph,
          dsG,
          nodeLabelProp,
          edgeLabelProp
        );
        currentNDSDistArray.push(ndsDist[key]);
      });

      // Sortted by currentNDSDistArray from large to small
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

  const candidateGraphs: GraphData[] = [];

  // console.log(
  //   "----- stage3: going to splice neighbors for each candidate graph -------"
  // );

  // After filtering the candidates, generate a Length-neighbor induced subgraph with each candidate as the center.
  // In the induced subgraph, remove points that cannot be matched on Q: labels that do not exist in Q,
  // and labels where the maximum shortest distance from other labels to the candidate is not in accordance with Q and the NDS distance is not in accordance with Q.
  candidates?.forEach((candidate, ci) => {
    const nodeIdx = nodeMap[candidate.id].idx;
    const lengthNeighborUnit = findKNeighborUnit(
      graphData.nodes,
      spm[nodeIdx],
      nodeIdx,
      nodeLabelProp,
      usingLength
    );

    const neighborNodes = lengthNeighborUnit.neighbors;

    // Remove the neighbor node which has no probability to find the matches
    const neighborNum = neighborNodes.length;
    let unmatched = false;
    for (let i = neighborNum - 1; i >= 0; i--) {
      // If, after pruning, the number of nodes that meet the criteria is too small, it indicates that the candidate graph cannot be matched.
      if (neighborNodes.length + 1 < pattern.nodes.length) {
        unmatched = true;
        return;
      }
      const neighborNode = neighborNodes[i];
      const neighborLabel = neighborNode.data[nodeLabelProp] as string;
      // prune1: If the label of neighbor nodes does not exist in pattern, remove the node
      if (
        !patternNodeLabelMap[neighborLabel] ||
        !patternNodeLabelMap[neighborLabel].length
      ) {
        neighborNodes.splice(i, 1);
        continue;
      }

      // prune2: If the shortest path from the neighbor node to the candidate is longer than the maximum shortest path length from any node with the same label as the neighbor node to beginPNode, remove this node.
      // prune2.1: If there is no distance record from this label to beginPNode, it means that there are no other nodes with this label on the pattern (possibly beginPNode has this label).
      if (
        !patternSpDist[neighborLabel] ||
        !patternSpDist[neighborLabel].length
      ) {
        neighborNodes.splice(i, 1);
        continue;
      }

      const key = `${candidate.id}-${neighborNode.id}`;

      // prune2.2
      const distToCandidate = spmMap[key];
      let idx = patternSpDist[neighborLabel].length - 1;
      const maxDistWithLabelInPattern = patternSpDist[neighborLabel][idx]; // patternSpDist[neighborLabel] has been sortted from small to large
      if (distToCandidate > maxDistWithLabelInPattern) {
        neighborNodes.splice(i, 1);
        continue;
      }

      if (directed) {
        const keyBack = `${neighborNode.id}-${candidate.id}`;
        const distFromCandidate = spmMap[keyBack];
        idx = patternSpDistBack[neighborLabel].length - 1;
        const maxBackDistWithLabelInPattern =
          patternSpDistBack[neighborLabel][idx];
        if (distFromCandidate > maxBackDistWithLabelInPattern) {
          neighborNodes.splice(i, 1);
          continue;
        }
      }

      // prune3: If the NDS distance from the neighbor node to the candidate is smaller than the minimum NDS distance from any node with the same label as the neighbor node to beginPNode, remove this node.
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
            intGMap
          );
      const patternKey = `${beginPNode.id}-${neighborLabel}`;
      const minNdsWithLabelInPattern =
        patternNDSDistMap[patternKey][patternNDSDistMap[patternKey].length - 1]; // patternNDSDist[key] exists for sure
      if (ndsToCandidate < minNdsWithLabelInPattern) {
        neighborNodes.splice(i, 1);
        continue;
      }

      // prune4: If the degree of the neighbor node is less than the minimum degree of nodes with the same label in the pattern, remove this node.
      const {
        minPatternNodeLabelDegree,
        minPatternNodeLabelInDegree,
        minPatternNodeLabelOutDegree,
      } = stashPatternNodeLabelDegreeMap(
        minPatternNodeLabelDegreeMap,
        neighborLabel,
        patternNodeMap,
        patternNodeLabelMap
      );

      if (nodeMap[neighborNode.id].degree < minPatternNodeLabelDegree) {
        neighborNodes.splice(i, 1);
        continue;
      }
    }

    // The number of nodes satisfies the matching requirement (not less than the number of nodes in the pattern). Now, we will filter the related edges.
    if (!unmatched) {
      candidateGraphs.push({
        nodes: [candidate].concat(neighborNodes),
      });
    }
  });

  // console.log(
  //   "----- stage4: going to splice edges and neighbors for each candidate graph -------"
  // );

  const { length: undirectedLengthsToBeginPNode } = dijkstra(
    patternGraph,
    beginPNode.id,
    false
  );

  let undirectedLengthsToBeginPNodeLabelMap: { [key: string]: number[] } = {};
  if (directed) {
    Object.keys(undirectedLengthsToBeginPNode).forEach((nodeId) => {
      const nodeLabel = patternNodeMap[nodeId].node.data[nodeLabelProp];
      if (!undirectedLengthsToBeginPNodeLabelMap[nodeLabel]) {
        undirectedLengthsToBeginPNodeLabelMap[nodeLabel] = [
          undirectedLengthsToBeginPNode[nodeId],
        ];
      } else {
        undirectedLengthsToBeginPNodeLabelMap[nodeLabel].push(
          undirectedLengthsToBeginPNode[nodeId]
        );
      }
    });
    Object.keys(undirectedLengthsToBeginPNodeLabelMap).forEach((pLabel) => {
      undirectedLengthsToBeginPNodeLabelMap[pLabel].sort((a, b) => a - b);
    });
  } else {
    undirectedLengthsToBeginPNodeLabelMap = patternSpDist;
  }

  // Only nodes in andidateGraphs now. Filter edges:
  const candidateGraphNum = candidateGraphs.length;
  for (let i = candidateGraphNum - 1; i >= 0; i--) {
    const candidateGraph = candidateGraphs[i];
    const candidate = candidateGraph.nodes[0];

    const candidateNodeLabelCountMap: { [key: string]: number } = {};
    const candidateNodeMap: {
      [key: string]: {
        idx: number;
        node: INode;
        degree: number;
        inDegree: number;
        outDegree: number;
      };
    } = {};
    candidateGraph.nodes.forEach((node, q) => {
      candidateNodeMap[node.id] = {
        idx: q,
        node,
        degree: 0,
        inDegree: 0,
        outDegree: 0,
      };
      const cNodeLabel = node.data[nodeLabelProp] as string;
      if (!candidateNodeLabelCountMap[cNodeLabel]) {
        candidateNodeLabelCountMap[cNodeLabel] = 1;
      } else candidateNodeLabelCountMap[cNodeLabel]++;
    });

    // Generate the induced subgraph of G based on the nodes in candidates and neighborNodes.
    // In other words, include the edges from graphData where both endpoints are in candidateGraph.nodes into candidateEdges.
    const candidateEdges: IEdge[] = [];
    const edgeLabelCountMap: { [key: string]: number } = {};
    graphData.edges.forEach((edge) => {
      if (candidateNodeMap[edge.source] && candidateNodeMap[edge.target]) {
        candidateEdges.push(edge);
        if (!edgeLabelCountMap[edge.data[edgeLabelProp] as string]) {
          edgeLabelCountMap[edge.data[edgeLabelProp] as string] = 1;
        } else edgeLabelCountMap[edge.data[edgeLabelProp] as string]++;
        candidateNodeMap[edge.source].degree++;
        candidateNodeMap[edge.target].degree++;
        candidateNodeMap[edge.source].outDegree++;
        candidateNodeMap[edge.target].inDegree++;
      }
    });

    // prune: If the number of occurrences of a specific edgeLabel in candidateGraph is fewer than in the pattern, remove that graph.
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

    // Traverse candidateEdges to filter the edges
    let candidateEdgeNum = candidateEdges.length;

    // prune: If the edge number is too small, remove the graph
    if (candidateEdgeNum < pattern.edges.length) {
      candidateGraphs.splice(i, 1);
      break;
    }
    let candidateGraphInvalid = false;
    for (let e = candidateEdgeNum - 1; e >= 0; e--) {
      const edge = candidateEdges[e];
      const edgeLabel = edge.data[edgeLabelProp] as string;
      const patternEdgesWithLabel = patternEdgeLabelMap[edgeLabel];

      // prune 1: If the label of an edge does not exist in the edge labels of the pattern, remove that edge.
      if (!patternEdgesWithLabel || !patternEdgesWithLabel.length) {
        edgeLabelCountMap[edgeLabel]--;
        // If the count of a certain label decreases and the number of edges with that label becomes insufficient, remove that graph.
        if (
          patternEdgesWithLabel &&
          edgeLabelCountMap[edgeLabel] < patternEdgesWithLabel.length
        ) {
          candidateGraphInvalid = true;
          break;
        }
        candidateEdges.splice(e, 1);
        candidateNodeMap[edge.source].degree--;
        candidateNodeMap[edge.target].degree--;
        candidateNodeMap[edge.source].outDegree--;
        candidateNodeMap[edge.target].inDegree--;
        continue;
      }

      // prune 2: If the triplet relationship of the edge label + both endpoint labels cannot be found in the pattern, remove that edge.
      const sourceLabel =
        candidateNodeMap[edge.source].node.data[nodeLabelProp];
      const targetLabel =
        candidateNodeMap[edge.target].node.data[nodeLabelProp];

      let edgeMatched = false;
      patternEdgesWithLabel.forEach((patternEdge: IEdge) => {
        const patternSource = patternNodeMap[patternEdge.source].node;
        const patternTarget = patternNodeMap[patternEdge.target].node;
        if (
          patternSource.data[nodeLabelProp] === sourceLabel &&
          patternTarget.data[nodeLabelProp] === targetLabel
        ) {
          edgeMatched = true;
        }
        if (
          !directed &&
          patternSource.data[nodeLabelProp] === targetLabel &&
          patternTarget.data[nodeLabelProp] === sourceLabel
        ) {
          edgeMatched = true;
        }
      });
      if (!edgeMatched) {
        edgeLabelCountMap[edgeLabel]--;
        // If the count of a label decreases and the number of edges with that label is insufficient, remove that graph.
        if (
          patternEdgesWithLabel &&
          edgeLabelCountMap[edgeLabel] < patternEdgesWithLabel.length
        ) {
          candidateGraphInvalid = true;
          break;
        }
        candidateEdges.splice(e, 1);
        candidateNodeMap[edge.source].degree--;
        candidateNodeMap[edge.target].degree--;
        candidateNodeMap[edge.source].outDegree--;
        candidateNodeMap[edge.target].inDegree--;
        continue;
      }
    }

    // prune2: During the process of deleting edges, if it is found that there are too few edges or too few edge labels, remove that graph.
    if (candidateGraphInvalid) {
      candidateGraphs.splice(i, 1);
      continue;
    }

    candidateGraph.edges = candidateEdges;

    const { length: lengthsToCandidate } = dijkstra(
      new GraphCore(candidateGraph),
      candidateGraph.nodes[0].id,
      false // The calculation of path length here is used to determine connectivity, so an undirected graph is used.
    );
    Object.keys(lengthsToCandidate)
      .reverse()
      .forEach((targetId) => {
        if (targetId === candidateGraph.nodes[0].id || candidateGraphInvalid) {
          return;
        }
        // prune4: The pruning described above may result in the neighbor subgraph becoming disconnected. Remove the nodes in the neighbor subgraph that are currently not connected to the candidate (first node).
        if (lengthsToCandidate[targetId] === Infinity) {
          const targetNodeLabel = candidateNodeMap[targetId].node.data[
            nodeLabelProp
          ] as string;
          candidateNodeLabelCountMap[targetNodeLabel]--;
          if (
            candidateNodeLabelCountMap[targetNodeLabel] <
            patternNodeLabelMap[targetNodeLabel].length
          ) {
            candidateGraphInvalid = true;
            return;
          }
          const idx = candidateGraph.nodes.indexOf(
            candidateNodeMap[targetId].node
          );
          candidateGraph.nodes.splice(idx, 1);
          candidateNodeMap[targetId] = undefined;
          return;
        }
        // prune5: After the edge pruning, it is possible that there are nodes with excessively long shortest paths (compared to the maximum shortest distance from nodes with the same label in the pattern to beginNode). Remove these nodes.
        const nLabel = nodeMap[targetId].node.data[nodeLabelProp];
        if (
          !undirectedLengthsToBeginPNodeLabelMap[nLabel] ||
          !undirectedLengthsToBeginPNodeLabelMap[nLabel].length ||
          lengthsToCandidate[targetId] >
            undirectedLengthsToBeginPNodeLabelMap[nLabel][
              undirectedLengthsToBeginPNodeLabelMap[nLabel].length - 1
            ]
        ) {
          const targetNodeLabel = candidateNodeMap[targetId].node.data[
            nodeLabelProp
          ] as string;
          candidateNodeLabelCountMap[targetNodeLabel]--;
          if (
            candidateNodeLabelCountMap[targetNodeLabel] <
            patternNodeLabelMap[targetNodeLabel].length
          ) {
            candidateGraphInvalid = true;
            return;
          }
          const idx = candidateGraph.nodes.indexOf(
            candidateNodeMap[targetId].node
          );
          candidateGraph.nodes.splice(idx, 1);
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

      // degree of candidate is not enough, remove it
      const condition = directed
        ? candidateNodeMap[candidate.id].degree <
            patternNodeMap[beginPNode.id].degree ||
          candidateNodeMap[candidate.id].inDegree <
            patternNodeMap[beginPNode.id].inDegree ||
          candidateNodeMap[candidate.id].outDegree <
            patternNodeMap[beginPNode.id].outDegree
        : candidateNodeMap[candidate.id].degree <
          patternNodeMap[beginPNode.id].degree;
      if (condition) {
        candidateGraphInvalid = true;
        break;
      }
      // the number of candidate label is not enough, remove it
      if (
        candidateNodeLabelCountMap[candidate.data[nodeLabelProp] as string] <
        patternNodeLabelMap[candidate.data[nodeLabelProp] as string].length
      ) {
        candidateGraphInvalid = true;
        break;
      }

      // prune6: remove the nodes with small degree
      const currentCandidateNodeNum = candidateGraph.nodes.length;
      for (let o = currentCandidateNodeNum - 1; o >= 0; o--) {
        const cgNode = candidateGraph.nodes[o];
        const nodeDegree = candidateNodeMap[cgNode.id].degree;
        const nodeInDegree = candidateNodeMap[cgNode.id].inDegree;
        const nodeOutDegree = candidateNodeMap[cgNode.id].outDegree;
        const cNodeLabel = cgNode.data[nodeLabelProp] as string;

        const {
          minPatternNodeLabelDegree,
          minPatternNodeLabelInDegree,
          minPatternNodeLabelOutDegree,
        } = stashPatternNodeLabelDegreeMap(
          minPatternNodeLabelDegreeMap,
          cNodeLabel,
          patternNodeMap,
          patternNodeLabelMap
        );

        const deleteCondition = directed
          ? nodeDegree < minPatternNodeLabelDegree ||
            nodeInDegree < minPatternNodeLabelInDegree ||
            nodeOutDegree < minPatternNodeLabelOutDegree
          : nodeDegree < minPatternNodeLabelDegree;
        if (deleteCondition) {
          candidateNodeLabelCountMap[cgNode.data[nodeLabelProp] as string]--;
          // 节点 label 个数不足
          if (
            candidateNodeLabelCountMap[cgNode.data[nodeLabelProp] as string] <
            patternNodeLabelMap[cgNode.data[nodeLabelProp] as string].length
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
      // After the prune5 node pruning, remove the edges whose endpoints are no longer in candidateGraph.
      candidateEdgeNum = candidateEdges.length;
      for (let y = candidateEdgeNum - 1; y >= 0; y--) {
        const cedge = candidateEdges[y];
        if (
          !candidateNodeMap[cedge.source] ||
          !candidateNodeMap[cedge.target]
        ) {
          candidateEdges.splice(y, 1);
          const edgeLabel = cedge.data[edgeLabelProp] as string;
          edgeLabelCountMap[edgeLabel]--;
          if (candidateNodeMap[cedge.source]) {
            candidateNodeMap[cedge.source].degree--;
            candidateNodeMap[cedge.source].outDegree--;
          }
          if (candidateNodeMap[cedge.target]) {
            candidateNodeMap[cedge.target].degree--;
            candidateNodeMap[cedge.target].inDegree--;
          }
          // Label number is not enough
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

    // prune: If there are too few nodes/edges or too few node/edge labels, remove this graph.
    if (
      candidateGraphInvalid ||
      candidateGraph.nodes.length < pattern.nodes.length ||
      candidateEdges.length < pattern.edges.length
    ) {
      candidateGraphs.splice(i, 1);
      continue;
    }
  }

  // At this point, multiple candidateGraphs have been generated, and there may be duplicates.

  // console.log(
  //   "----- stage5: going to splice dulplicated candidate graphs -------"
  // );

  // Remove identical subgraphs in candidateGraphs by using the node-node-edgeLabel of edges as the key and the count of such edges as the value for matching.
  let currentLength = candidateGraphs.length;
  for (let i = 0; i <= currentLength - 1; i++) {
    const cg1 = candidateGraphs[i];
    const cg1EdgeMap: { [key: string]: number } = {}; // [node1.id-node2.id-edge.label]: count
    cg1.edges.forEach((edge) => {
      const key = `${edge.source}-${edge.target}-${edge.data.label}`;
      if (!cg1EdgeMap[key]) cg1EdgeMap[key] = 1;
      else cg1EdgeMap[key]++;
    });

    for (let j = currentLength - 1; j > i; j--) {
      const cg2 = candidateGraphs[j];
      const cg2EdgeMap: { [key: string]: number } = {}; // [node1.id-node2.id-edge.label]: count
      cg2.edges.forEach((edge) => {
        const key = `${edge.source}-${edge.target}-${edge.data.label}`;
        if (!cg2EdgeMap[key]) cg2EdgeMap[key] = 1;
        else cg2EdgeMap[key]++;
      });

      let same = true;
      if (Object.keys(cg2EdgeMap).length !== Object.keys(cg1EdgeMap).length) {
        same = false;
      } else {
        Object.keys(cg1EdgeMap).forEach((key) => {
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
