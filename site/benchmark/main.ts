import { WebGPUGraph } from "../../packages/webgpu-graph/src";
import { loadDatasets } from "../datasets";
import { TestName } from "../types";
import {
  graphology as graphologyPageRank,
  webgpu as webgpuPageRank,
} from "./page-rank";
import { graphology as graphologySSSP, webgpu as webgpuSSSP } from "./sssp";

const TestsConfig = [
  {
    name: TestName.GRAPHOLOGY,
  },
  {
    name: TestName.ANTV_ALGORITHM,
  },
  {
    name: TestName.ANTV_WEBGPU_GRAPH,
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

  $run.innerHTML = "Run layouts";
  $run.disabled = false;

  const layoutConfig: any = [
    {
      name: TestName.GRAPHOLOGY,
      methods: {
        pageRank: graphologyPageRank,
        sssp: graphologySSSP,
      },
    },
    {
      name: TestName.ANTV_ALGORITHM,
      methods: {
        // pageRank: graphologyForceatlas2,
        // sssp: graphologyFruchterman,
      },
    },
    {
      name: TestName.ANTV_WEBGPU_GRAPH,
      methods: {
        pageRank: webgpuPageRank,
        sssp: webgpuSSSP,
      },
    },
  ];

  $run.onclick = async () => {
    const dataset = datasets[$dataset.value];
    const algorithmName = $algorithm.value;
    let options = null;
    if (algorithmName === "sssp") {
      const graph = dataset[TestName.ANTV_WEBGPU_GRAPH];
      options = graph.getAllNodes()[1].id;
    }

    await Promise.all(
      layoutConfig.map(async ({ name, methods }: any, i: number) => {
        if (methods[algorithmName]) {
          const start = performance.now();
          const result = await methods[algorithmName](
            dataset[name],
            options,
            graph
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
    );
  };
})();
