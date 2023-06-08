# AntV Graph Algorithm based on WebGPU

`graph-gpu` is a GPU accelerated graph analytics library, with functionality like [WebGPU](https://www.w3.org/TR/webgpu/) which provides modern features such as compute shader(in [WGSL](https://www.w3.org/TR/WGSL/)). Compared with CPU version, we almost gain ~100x speed up with big datasets.

It's inspired by [cuGraph](https://github.com/rapidsai/cugraph) and other implementations based on CUDA.

[Docs](https://g-next.antv.vision/zh/docs/api/gpgpu/webgpu-graph):

- Link Analysis
  - [PageRank](https://g-next.antv.vision/zh/docs/api/gpgpu/webgpu-graph#pagerank)
- Traversal
  - [SSSP](https://g-next.antv.vision/zh/docs/api/gpgpu/webgpu-graph#sssp)

## Prerequisite

[How to use WebGPU](https://web.dev/gpu/#use)

For our examples, we use [origin trial](https://web.dev/gpu/#enabling-support-during-the-origin-trial-phase). The origin trial is expected to end in Chrome 101 (May 18, 2022).

Since we are using latest syntax of WGSL, you'd better update your Chrome to the latest version.

## Usage

```js
import { pageRank, WebGPUGraph } from '@antv/graph-gpu';

// initialize WebGPU context
const graph = new WebGPUGraph();

// call async method
const result = await graph.pageRank(graph_data, eps, alpha, max_iter);
```

## Building

- Install dependencies: `yarn install`
- For production, compile the project: `yarn build`

## Benchmark

| name     | vertices and edges       | CPU time elapsed | GPU time elapsed | Speed up |
| -------- | ------------------------ | ---------------- | ---------------- | -------- |
| SSSP     | 1k vertices & 5k edges   | 27687.10 ms      | 261.60 ms        | ~100x    |
| PageRank | 1k vertices & 500k edges | 13641.50 ms      | 130.20 ms        | ~100x    |
