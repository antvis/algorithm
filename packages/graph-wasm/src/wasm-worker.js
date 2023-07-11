import * as Comlink from 'comlink';

const wrapTransferPageRank = pageRank => {
  return options => {
    const params = {
      max_iterations: options.maxIterations || 1000,
      tolerance: options.tolerance || 0.0001,
      damping_factor: options.alpha || 0.85,
      edgelist: options.edgelist
    };

    const ranks = pageRank(params);

    return Comlink.transfer(ranks, []);
  };
};

const wrapTransferSSSP = sssp => {
  return options => {
    const params = {
      start_node: options.startNode || 0,
      delta: options.delta || 3,
      edgelist: options.edgelist
    };

    const ranks = sssp(params);

    return Comlink.transfer(ranks, []);
  };
};

// Wrap wasm-bindgen exports (the `generate` function) to add time measurement.
function wrapExports({ pageRank, sssp }) {
  return {
    pageRank: wrapTransferPageRank(pageRank),
    sssp: wrapTransferSSSP(sssp),
  };
}

async function initHandlers(useMultiThread) {
  if (useMultiThread) {
    // @ts-ignore
    const multiThread = await import('../pkg-parallel/antv_graph_wasm.js');
    await multiThread.default();
    await multiThread.initThreadPool(navigator.hardwareConcurrency);
    return Comlink.proxy(wrapExports(multiThread));
  } else {
    // @ts-ignore
    const singleThread = await import('../pkg/antv_graph_wasm.js');
    await singleThread.default();
    return Comlink.proxy(wrapExports(singleThread));
  }
}

Comlink.expose(initHandlers);
