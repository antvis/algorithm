import type { WebGLRenderer } from '@antv/g-webgl';
import { Kernel, BufferUsage } from '@antv/g-plugin-gpgpu';
import { GraphData } from '../types';
import { convertGraphData2CSC } from '../util';

/**
 * Scalable GPU Graph Traversal
 * @see https://research.nvidia.com/publication/scalable-gpu-graph-traversal
 * @see https://github.com/rafalk342/bfs-cuda
 * @see https://github.com/kaletap/bfs-cuda-gpu
 */
export async function bfs(device: WebGLRenderer.Device, graphData: GraphData) {

}