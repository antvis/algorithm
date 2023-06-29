import * as Comlink from 'comlink';

const DEFAULT_PAGE_RANK_OPTIONS = {
  max_iterations: 10,
  tolerance: 0.0001,
  damping_factor: 0.85,
};

const wrapTransfer = page_rank => {
  return options => {
    const ranks = page_rank({
      ...DEFAULT_PAGE_RANK_OPTIONS,
      ...options,
    });

    return {
      // Little perf boost to transfer data to the main thread w/o copying.
      ranks: Comlink.transfer(ranks, [ranks]),
    };
  };
};

// Wrap wasm-bindgen exports (the `generate` function) to add time measurement.
function wrapExports({ page_rank }) {
  return {
    pageRank: wrapTransfer(page_rank),
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
