import { DeviceRenderer } from '@antv/g-webgpu';
import { Kernel } from '@antv/g-plugin-gpgpu';
import { convertGraphData2CSC } from '../util';
import { Graph } from '../types';

const { BufferUsage } = DeviceRenderer;

/**
 * Pagerank using power method, ported from CUDA
 *
 * @param graphData
 * @param eps Set the tolerance the approximation, this parameter should be a small magnitude value. The lower the tolerance the better the approximation.
 * @param alpha The damping factor alpha represents the probability to follow an outgoing edge, standard value is 0.85.
 * @param maxIteration Set the maximum number of iterations.
 *
 * @see https://github.com/princeofpython/PageRank-with-CUDA/blob/main/parallel.cu
 */
export async function pageRank(
  device: DeviceRenderer.Device,
  graphData: Graph,
  eps = 1e-5,
  alpha = 0.85,
  maxIteration = 1000,
) {
  const BLOCK_SIZE = 1;
  const BLOCKS = 256;

  const { V, From, To } = convertGraphData2CSC(graphData);

  const n = V.length;
  const graph = new Float32Array(new Array(n * n).fill((1 - alpha) / n));
  const r = new Float32Array(new Array(n).fill(1 / n));

  From.forEach((from, i) => {
    graph[To[i] * n + from] += alpha * 1.0;
  });

  for (let j = 0; j < n; j++) {
    let sum = 0.0;

    for (let i = 0; i < n; ++i) {
      sum += graph[i * n + j];
    }

    for (let i = 0; i < n; ++i) {
      if (sum != 0.0) {
        graph[i * n + j] /= sum;
      } else {
        graph[i * n + j] = 1 / n;
      }
    }
  }

  const storeKernel = new Kernel(device, {
    computeShader: `
struct Buffer {
  data: array<f32>,
};

@group(0) @binding(0) var<storage, read> r : Buffer;
@group(0) @binding(1) var<storage, read_write> r_last : Buffer;

@compute @workgroup_size(${BLOCKS}, ${BLOCK_SIZE})
fn main(
  @builtin(global_invocation_id) global_id : vec3<u32>
) {
  var index = global_id.x;
  if (index < ${V.length}u) {
    r_last.data[index] = r.data[index];
  }
}`,
  });

  const matmulKernel = new Kernel(device, {
    computeShader: `
struct Buffer {
  data: array<f32>,
};

@group(0) @binding(0) var<storage, read> graph : Buffer;
@group(0) @binding(1) var<storage, read_write> r : Buffer;
@group(0) @binding(2) var<storage, read> r_last : Buffer;

@compute @workgroup_size(${BLOCKS}, ${BLOCK_SIZE})
fn main(
  @builtin(global_invocation_id) global_id : vec3<u32>
) {
  var index = global_id.x;
  if (index < ${V.length}u) {
    var sum = 0.0;
    for (var i = 0u; i < ${V.length}u; i = i + 1u) {
      sum = sum + r_last.data[i] * graph.data[index * ${V.length}u + i];
    }
    r.data[index] = sum;
  }
}
    `,
  });

  const rankDiffKernel = new Kernel(device, {
    computeShader: `
struct Buffer {
  data: array<f32>,
};

@group(0) @binding(0) var<storage, read> r : Buffer;
@group(0) @binding(1) var<storage, read_write> r_last : Buffer;

@compute @workgroup_size(${BLOCKS}, ${BLOCK_SIZE})
fn main(
  @builtin(global_invocation_id) global_id : vec3<u32>
) {
  var index = global_id.x;
  if (index < ${V.length}u) {
    r_last.data[index] = abs(r_last.data[index] - r.data[index]);
  }
}    
    `,
  });

  const rBuffer = device.createBuffer({
    usage: BufferUsage.STORAGE | BufferUsage.COPY_SRC,
    viewOrSize: new Float32Array(r),
  });
  const rLastBuffer = device.createBuffer({
    usage: BufferUsage.STORAGE | BufferUsage.COPY_SRC,
    viewOrSize: new Float32Array(n),
  });
  const graphBuffer = device.createBuffer({
    usage: BufferUsage.STORAGE,
    viewOrSize: new Float32Array(graph),
  });

  const readback = device.createReadback();

  storeKernel.setBinding(0, rBuffer);
  storeKernel.setBinding(1, rLastBuffer);

  matmulKernel.setBinding(0, graphBuffer);
  matmulKernel.setBinding(1, rBuffer);
  matmulKernel.setBinding(2, rLastBuffer);

  rankDiffKernel.setBinding(0, rBuffer);
  rankDiffKernel.setBinding(1, rLastBuffer);

  const grids = Math.ceil(V.length / (BLOCKS * BLOCK_SIZE));

  while (maxIteration--) {
    storeKernel.dispatch(grids, 1);
    matmulKernel.dispatch(grids, 1);
    rankDiffKernel.dispatch(grids, 1);

    const last = (await readback.readBuffer(rLastBuffer)) as Float32Array;
    const result = last.reduce((prev, cur) => prev + cur, 0);
    if (result < eps) {
      break;
    }
  }

  const out = (await readback.readBuffer(rBuffer)) as Float32Array;
  return Array.from(out)
    .map((score, index) => ({ id: graphData.getAllNodes()[index].id, score }))
    .sort((a, b) => b.score - a.score);
}
