import getAdjMatrix from './adjacent-matrix';
import breadthFirstSearch from './bfs';
import connectedComponent from './connected-component';
import getDegree from './degree';
import { getInDegree, getOutDegree } from './degree';
import detectCycle, { detectAllCycles, detectAllDirectedCycle, detectAllUndirectedCycle } from './detect-cycle';
import depthFirstSearch from './dfs';
import dijkstra from './dijkstra';
import { findAllPath, findShortestPath } from './find-path';
import floydWarshall from './floydWarshall';
import labelPropagation from './label-propagation';
import louvain from './louvain';
import iLouvain from './i-louvain';
import kCore from './k-core';
import cosineSimilarity from './cosine-similarity';
import nodesCosineSimilarity from './nodes-cosine-similarity';
import minimumSpanningTree from './mts';
import pageRank from './pageRank';
import GADDI from './gaddi';
import Stack from './structs/stack';
import { getNeighbors } from './util';
import { IAlgorithm } from './types';

const detectDirectedCycle = detectCycle;

export {
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
  iLouvain,
  kCore,
  cosineSimilarity,
  nodesCosineSimilarity,
  minimumSpanningTree,
  pageRank,
  getNeighbors,
  Stack,
  GADDI,
  IAlgorithm
};

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
  iLouvain,
  kCore,
  cosineSimilarity,
  nodesCosineSimilarity,
  minimumSpanningTree,
  pageRank,
  getNeighbors,
  Stack,
  GADDI,
};