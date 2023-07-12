/**
 * Graphology x 173,947 ops/sec ±0.22% (98 runs sampled)
 * NGraph x 60,245 ops/sec ±0.24% (99 runs sampled)
 * @antv/algorithm x 436 ops/sec ±0.53% (85 runs sampled)
 * Fastest is Graphology
 */
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

/**
 * Graphology
 * @see https://graphology.github.io/standard-library/communities-louvain.html
 */
var louvain = require('graphology-communities-louvain');

/**
 * @antv/algorithm
 * @see https://g6.antv.antgroup.com/api/algorithm#louvain
 */
var Algorithm = require('../lib');

/**
 * ngraph.louvain
 * @see https://github.com/anvaka/ngraph.louvain
 */
var createNGraph = require('ngraph.graph');
var ngraphLouvain = require('ngraph.louvain');
var ngraphCoarsen = require('ngraph.coarsen');
var nGraph = createNGraph();
function collectNGraphCommunities(g, result) {
  var map = {};
  g.forEachNode((n) => {
    map[n.id] = result.getClass(n.id);
  });
  return map;
}
function ngraphLouvainHierarchy(g) {
  var clusters = ngraphLouvain(g);
  while (clusters.canCoarse()) {
    g = ngraphCoarsen(g, clusters);
    clusters = ngraphLouvain(g);
  }
  return collectNGraphCommunities(g, clusters);
}

/**
 * Generate graph with clusters.
 */
var Graph = require('graphology');
var randomClusters = require('graphology-generators/random/clusters');
var seedrandom = require('seedrandom');
var rng = function () {
  return seedrandom('bench');
};
const NODE_NUM = 10;
const EDGE_NUM = 30;
const g6graph = { nodes: [], edges: [] };
var graph = randomClusters(Graph, {
  order: NODE_NUM,
  size: EDGE_NUM,
  clusters: 5,
  rng: rng(),
});
graph.nodes().forEach(function (node) {
  nGraph.addNode(node);
  g6graph.nodes.push({ id: node });
});
graph.edges().forEach(function (edge) {
  graph.setEdgeAttribute(edge, 'weight', 1);
  const source = graph.source(edge);
  const target = graph.target(edge);
  nGraph.addLink(source, target);
  g6graph.edges.push({ source, target, weight: 1 });
});

function distinctSize(o) {
  var keys = new Set();
  for (var k in o) keys.add(o[k]);
  return keys.size;
}

suite
  .add('Graphology', function () {
    const clusters = louvain(graph);
  })
  .add('NGraph', function () {
    const clusters = ngraphLouvainHierarchy(nGraph);
  })
  .add('@antv/algorithm', function () {
    const clusters = Algorithm.louvain(g6graph, false);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ async: true });
