# AntV Graph Algorithm based on WebGPU

参考 [cuGraph](https://github.com/rapidsai/cugraph) 以及其他 CUDA 实现，基于 WebGPU 实现常见的图分析算法，实现大规模节点边数据量下并行加速的目的。

[文档](https://g-next.antv.vision/zh/docs/api/gpgpu/webgpu-graph)：

- Link Analysis
  - [PageRank](https://g-next.antv.vision/zh/docs/api/gpgpu/webgpu-graph#pagerank)
- Traversal
  - [SSSP](https://g-next.antv.vision/zh/docs/api/gpgpu/webgpu-graph#sssp)

## 前置条件

- WebGPU 目前仅支持在 Chrome 94 版本以上运行，推荐升级到最新版。
- 启用 Origin Trial 支持 WebGPU 特性（Chrome 100 以上不再需要）：
  - [获取 Token](https://developer.chrome.com/origintrials/#/view_trial/118219490218475521)
  - 在页面中添加 `<meta>` 标签，附上上一步获取的 Token，例如通过 DOM API：

```js
const tokenElement = document.createElement('meta');
tokenElement.httpEquiv = 'origin-trial';
tokenElement.content = 'AkIL...5fQ==';
document.head.appendChild(tokenElement);
```

## 使用方法

均为异步调用，以 pageRank 为例：

```js
import { pageRank, WebGPUGraph } from '@antv/graph-gpu';

// 初始化
const graph = new WebGPUGraph();

const result = await graph.pageRank(graph_data, eps, alpha, max_iter);
```

## 性能测试

| 算法名   | 节点 / 边       | CPU 耗时    | GPU 耗时  | Speed up |
| -------- | --------------- | ----------- | --------- | -------- |
| SSSP     | 1k 节点 5k 边   | 27687.10 ms | 261.60 ms | ~100x    |
| PageRank | 1k 节点 500k 边 | 13641.50 ms | 130.20 ms | ~100x    |
