import { Canvas } from '@antv/g';
import { Renderer } from '@antv/g-webgpu';
import { Plugin } from '@antv/g-plugin-gpgpu';
import { pageRank } from './link-analysis';
import { sssp } from './traversal';
import { Graph } from './types';

export interface WebGPUGraphOptions {
  canvas: HTMLCanvasElement | OffscreenCanvas;
}

export class WebGPUGraph {
  canvas: Canvas;
  renderer: Renderer;

  constructor(options: Partial<WebGPUGraphOptions> = {}) {
    const { canvas } = options;

    // FIXME: use OffscreenCanvas instead of a real <canvas> DOM
    const $canvas = (canvas || window.document.createElement('canvas')) as HTMLCanvasElement;

    // use WebGPU
    this.renderer = new Renderer();
    this.renderer.registerPlugin(new Plugin());

    // create a canvas
    this.canvas = new Canvas({
      // @ts-ignore
      canvas: $canvas,
      width: 1,
      height: 1,
      renderer: this.renderer,
    });
  }

  private async getDevice() {
    // wait for canvas' services ready
    await this.canvas.ready;
    // get GPU Device
    const plugin = this.renderer.getPlugin('device-renderer') as any;
    return plugin.getDevice();
  }

  async pageRank(graphData: Graph, eps = 1e-5, alpha = 0.85, maxIteration = 1000) {
    const device = await this.getDevice();
    return pageRank(device, graphData, eps, alpha, maxIteration);
  }

  async sssp(graphData: Graph, sourceId: string, weightPropertyName: string = 'weight') {
    const device = await this.getDevice();
    return sssp(device, graphData, sourceId, weightPropertyName);
  }

  destroy() {
    if (this.canvas) {
      this.canvas.destroy();
    }
  }
}
