import { DeviceRenderer } from '@antv/g-webgpu';
import { Kernel } from '@antv/g-plugin-gpgpu';
import { Graph } from '../types';
import { convertGraphData2CSC } from '../util';

const { BufferUsage } = DeviceRenderer;

/**
 * SSSP(Bellman-Ford) ported from CUDA
 *
 * @see https://www.lewuathe.com/illustration-of-distributed-bellman-ford-algorithm.html
 * @see https://github.com/sengorajkumar/gpu_graph_algorithms
 * @see https://docs.rapids.ai/api/cugraph/stable/api_docs/api/cugraph.traversal.sssp.sssp.html
 * compared with G6:
 * @see https://g6.antv.vision/zh/docs/api/Algorithm#findshortestpathgraphdata-start-end-directed-weightpropertyname
 */
export async function sssp(
  device: DeviceRenderer.Device,
  graphData: Graph,
  sourceId: string,
  weightPropertyName: string = '',
  maxDistance = 1000000,
) {
  // The total number of workgroup invocations (4096) exceeds the maximum allowed (256).
  const BLOCK_SIZE = 1;
  const BLOCKS = 256;
  const MAX_DISTANCE = maxDistance;

  const { V, E, I, nodeId2IndexMap, edges } = convertGraphData2CSC(graphData);
  let W: number[];
  const sourceIdx = nodeId2IndexMap[sourceId];
  if (weightPropertyName) {
    W = edges.map(edgeConfig => Number(edgeConfig.data[weightPropertyName]));
  } else {
    // all the vertex has the same weight
    W = new Array(E.length).fill(1);
  }

  const relaxKernel = new Kernel(device, {
    computeShader: `
struct Buffer {
  data: array<i32>,
};
struct AtomicBuffer {
  data: array<atomic<i32>>,
};

@group(0) @binding(0) var<storage, read> d_in_E : Buffer;
@group(0) @binding(1) var<storage, read> d_in_I : Buffer;
@group(0) @binding(2) var<storage, read> d_in_W : Buffer;
@group(0) @binding(3) var<storage, read> d_out_D : Buffer;
@group(0) @binding(4) var<storage, read_write> d_out_Di : AtomicBuffer;

@compute @workgroup_size(${BLOCKS}, ${BLOCK_SIZE})
fn main(
  @builtin(global_invocation_id) global_id : vec3<u32>
) {
  var index = global_id.x;
  if (index < ${V.length}u) {
    for (var j = d_in_I.data[index]; j < d_in_I.data[index + 1u]; j = j + 1) {
      var w = d_in_W.data[j];
      var du = d_out_D.data[index];
      var dv = d_out_D.data[d_in_E.data[j]];
      var newDist = du + w;
      if (du == ${MAX_DISTANCE}) {
        newDist = ${MAX_DISTANCE};
      }

      if (newDist < dv) {
        atomicMin(&d_out_Di.data[d_in_E.data[j]], newDist);
      }
    }
  }
}`,
  });

  const updateDistanceKernel = new Kernel(device, {
    computeShader: `
struct Buffer {
  data: array<i32>,
};

@group(0) @binding(0) var<storage, read_write> d_out_D : Buffer;
@group(0) @binding(1) var<storage, read_write> d_out_Di : Buffer;

@compute @workgroup_size(${BLOCKS}, ${BLOCK_SIZE})
fn main(
  @builtin(global_invocation_id) global_id : vec3<u32>
) {
  var index = global_id.x;
  if (index < ${V.length}u) {
    if (d_out_D.data[index] > d_out_Di.data[index]) {
      d_out_D.data[index] = d_out_Di.data[index];
    }
    d_out_Di.data[index] = d_out_D.data[index];
  }
}
    `,
  });

  const updatePredKernel = new Kernel(device, {
    computeShader: `
struct Buffer {
  data: array<i32>,
};
struct AtomicBuffer {
  data: array<atomic<i32>>,
};

@group(0) @binding(0) var<storage, read> d_in_V : Buffer;
@group(0) @binding(1) var<storage, read> d_in_E : Buffer;
@group(0) @binding(2) var<storage, read> d_in_I : Buffer;
@group(0) @binding(3) var<storage, read> d_in_W : Buffer;
@group(0) @binding(4) var<storage, read> d_out_D : Buffer;
@group(0) @binding(5) var<storage, read_write> d_out_P : AtomicBuffer;

@compute @workgroup_size(${BLOCKS}, ${BLOCK_SIZE})
fn main(
  @builtin(global_invocation_id) global_id : vec3<u32>
) {
  var index = global_id.x;
  if (index < ${V.length}u) {
    for (var j = d_in_I.data[index]; j < d_in_I.data[index + 1u]; j = j + 1) {
      var u = d_in_V.data[index];
      var w = d_in_W.data[j];

      var dis_u = d_out_D.data[index];
      var dis_v = d_out_D.data[d_in_E.data[j]];
      if (dis_v == dis_u + w) {
        atomicMin(&d_out_P.data[d_in_E.data[j]], u);
      }
    }
  }
}    
    `,
  });

  const VBuffer = device.createBuffer({
    usage: BufferUsage.STORAGE,
    viewOrSize: new Int32Array(V),
  });
  const EBuffer = device.createBuffer({
    usage: BufferUsage.STORAGE,
    viewOrSize: new Int32Array(E),
  });
  const IBuffer = device.createBuffer({
    usage: BufferUsage.STORAGE,
    viewOrSize: new Int32Array(I),
  });
  const WBuffer = device.createBuffer({
    usage: BufferUsage.STORAGE,
    viewOrSize: new Int32Array(W),
  });

  // mark source vertex
  const view = new Array(V.length).fill(MAX_DISTANCE);
  view[sourceIdx] = 0;

  const DOutBuffer = device.createBuffer({
    usage: BufferUsage.STORAGE | BufferUsage.COPY_SRC,
    viewOrSize: new Int32Array(view),
  });
  const DiOutBuffer = device.createBuffer({
    usage: BufferUsage.STORAGE | BufferUsage.COPY_SRC,
    viewOrSize: new Int32Array(view),
  });

  // store predecessors
  const POutBuffer = device.createBuffer({
    usage: BufferUsage.STORAGE | BufferUsage.COPY_SRC,
    viewOrSize: new Int32Array(view),
  });
  const readback = device.createReadback();

  relaxKernel.setBinding(0, EBuffer);
  relaxKernel.setBinding(1, IBuffer);
  relaxKernel.setBinding(2, WBuffer);
  relaxKernel.setBinding(3, DOutBuffer);
  relaxKernel.setBinding(4, DiOutBuffer);

  updateDistanceKernel.setBinding(0, DOutBuffer);
  updateDistanceKernel.setBinding(1, DiOutBuffer);

  updatePredKernel.setBinding(0, VBuffer);
  updatePredKernel.setBinding(1, EBuffer);
  updatePredKernel.setBinding(2, IBuffer);
  updatePredKernel.setBinding(3, WBuffer);
  updatePredKernel.setBinding(4, DOutBuffer);
  updatePredKernel.setBinding(5, POutBuffer);

  const grids = Math.ceil(V.length / (BLOCKS * BLOCK_SIZE));
  for (let i = 1; i < V.length; i++) {
    relaxKernel.dispatch(grids, 1);
    updateDistanceKernel.dispatch(grids, 1);
  }
  updatePredKernel.dispatch(grids, 1);

  const out = (await readback.readBuffer(DiOutBuffer)) as Float32Array;
  const predecessor = await readback.readBuffer(POutBuffer);

  return Array.from(out).map((distance, i) => ({
    target: graphData.getAllNodes()[V[i]].id,
    distance,
    predecessor: graphData.getAllNodes()[V[predecessor[i]]]?.id,
  }));
}
