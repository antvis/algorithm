import { WebGPUGraph } from "../../packages/graph-gpu/src";
import { loadDatasets } from "../datasets";
import { TestName } from "../types";
import {
  graphology as graphologyPageRank,
  antv as antvPageRank,
  webgpu as webgpuPageRank,
  wasm as wasmPageRank
} from "./page-rank";
import { graphology as graphologySSSP, antv as antvSSSP, webgpu as webgpuSSSP, wasm as wasmSSSP } from "./sssp";
import { graphology as graphologyLouvain, antv as antvLouvain, wasm as wasmLouvain } from "./louvain";
import { initThreads } from "../../packages/graph-wasm";

const TestsConfig = [
  {
    name: TestName.GRAPHOLOGY,
  },
  {
    name: TestName.ANTV_ALGORITHM,
  },
  {
    name: TestName.ANTV_GRAPH_GPU,
  },
  {
    name: TestName.ANTV_GRAPH_WASM,
  },
];

const $dataset = document.getElementById("dataset") as HTMLSelectElement;
const $datasetDesc = document.getElementById("dataset-desc") as HTMLSpanElement;
const $algorithm = document.getElementById("algorithm") as HTMLSelectElement;
const $run = document.getElementById("run") as HTMLButtonElement;
const $results = TestsConfig.map(({ name }) => {
  const $div = document.getElementById(name) as HTMLDivElement;
  return [$div.querySelector(".console")!, $div.querySelector(".time")!];
});

const initThreadsPool = async () => {
  const singleThread = await initThreads(false);
  const multiThreads = await initThreads(true);

  return [singleThread, multiThreads];
};

(async () => {
  $run.innerHTML = "Loading...";
  $run.disabled = true;
  console.time("Load datasets");
  const datasets = await loadDatasets();
  $dataset.onchange = () => {
    $datasetDesc.innerHTML = datasets[$dataset.value].desc;
  };
  console.timeEnd("Load datasets");

  // initialize WebGPU context
  const graph = new WebGPUGraph();

  console.time("Init WASM threads");
  const [forceSingleThread, forceMultiThreads] = await initThreadsPool();
  console.timeEnd("Init WASM threads");
  $run.innerHTML = 'Run layouts';
  $run.disabled = false;

  const layoutConfig: any = [
    {
      name: TestName.GRAPHOLOGY,
      methods: {
        pageRank: graphologyPageRank,
        sssp: graphologySSSP,
        louvain: graphologyLouvain,
      },
    },
    {
      name: TestName.ANTV_ALGORITHM,
      methods: {
        pageRank: antvPageRank,
        sssp: antvSSSP,
        louvain: antvLouvain,
      },
    },
    {
      name: TestName.ANTV_GRAPH_GPU,
      methods: {
        // pageRank: webgpuPageRank,
        sssp: webgpuSSSP,
      },
    },
    {
      name: TestName.ANTV_GRAPH_WASM,
      methods: {
        pageRank: wasmPageRank,
        sssp: wasmSSSP,
        louvain: wasmLouvain,
      },
    },
  ];

  $run.onclick = () => {
    const dataset = datasets[$dataset.value];
    const algorithmName = $algorithm.value;
    let options = {};
    if (algorithmName === "sssp") {
      const graph = dataset[TestName.ANTV_ALGORITHM];
      options = graph.getAllNodes()[1].id;
    }

    layoutConfig.map(async ({ name, methods }: any, i: number) => {
      if (methods[algorithmName]) {
        const start = performance.now();
        const result = await methods[algorithmName](
          dataset[name],
          options,
          graph,
          forceMultiThreads
        );
        $results[i][1].innerHTML = `${(performance.now() - start).toFixed(
          2
        )}ms`;

        $results[i][0].innerHTML = JSON.stringify(result);
      } else {
        $results[i][0].innerHTML = "";
        $results[i][1].innerHTML = "-";
      }
    })
  };
})();
