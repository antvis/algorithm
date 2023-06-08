import { DeviceRenderer } from '@antv/g-webgpu';
import { Graph } from '../types';

/**
 * Scalable GPU Graph Traversal
 * @see https://research.nvidia.com/publication/scalable-gpu-graph-traversal
 * @see https://github.com/rafalk342/bfs-cuda
 * @see https://github.com/kaletap/bfs-cuda-gpu
 */
export async function bfs(device: DeviceRenderer.Device, graphData: Graph) {}
