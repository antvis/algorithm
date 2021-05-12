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
import minimumSpanningTree from './mts';
import pageRank from './pageRank';
import GADDI from './gaddi';
import Stack from './structs/stack';
import { getNeighbors } from './util';

const detectDirectedCycle = detectCycle;
const detectDirectedCycleAsync = detectCycleAsync;

import {
  getAdjMatrixAsync,
  connectedComponentAsync,
  getDegreeAsync,
  getInDegreeAsync,
  getOutDegreeAsync,
  detectCycleAsync,
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
} from './workers/index';

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
  minimumSpanningTree,
  pageRank,
  getNeighbors,
  Stack,
  GADDI,
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
  Stack,
  GADDI,
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