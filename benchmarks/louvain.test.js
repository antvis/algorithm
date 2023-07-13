var Benchmark = require("benchmark");
var suite = new Benchmark.Suite();

/**
 * Graphology
 */
var Graph = require("graphology");
var louvain = require('graphology-communities-louvain');
var { louvain: AntvLouvain } = require("../packages/graph");
var randomClusters = require("graphology-generators/random/clusters");
var seedrandom = require("seedrandom");
var rng = function () {
  return seedrandom("bench");
};
const { graphology2antv } = require("./util");

const NODE_NUM = 10;
const EDGE_NUM = 30;
var graph = randomClusters(Graph, {
  order: NODE_NUM,
  size: EDGE_NUM,
  clusters: 5,
  rng: rng(),
});
graph.edges().forEach(function (edge, i) {
  graph.setEdgeAttribute(edge, "weight", 1);
});
// graph.nodes().forEach(function (node) {
//   graph.setNodeAttribute(node, "x", Math.random() * CANVAS_SIZE);
//   graph.setNodeAttribute(node, "y", Math.random() * CANVAS_SIZE);
// });
const antvgraph = graphology2antv(graph);

// add tests
suite
  .add("Graphology", async function () {
    louvain(graph);
  })
  .add("@antv/layout", async function () {
    AntvLouvain(antvgraph);
  })
  // add listeners
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log("Fastest is " + this.filter("fastest").map("name"));
  })
  .run({ async: true });

// logs:
// Graphology x 154,854 ops/sec ±0.38% (98 runs sampled)
// @antv/layout x 1,163 ops/sec ±0.47% (97 runs sampled)
// Fastest is Graphology
