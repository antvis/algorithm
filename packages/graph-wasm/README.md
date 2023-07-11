# @antv/graph-wasm

A WASM binding of `@antv/graph-rust`. We used [wasm-bindgen-rayon](https://github.com/GoogleChromeLabs/wasm-bindgen-rayon) to implement data parallelism with WebWorkers.

- [Use with Webpack](#webpack)
- [Use with Vite](#vite)

![pagerank](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*klB7TKFwbskAAAAAAAAAAAAADmJ7AQ/original)

## Usage

Since [cross origin workers are blocked](https://stackoverflow.com/questions/58098143/why-are-cross-origin-workers-blocked-and-why-is-the-workaround-ok/60015898#60015898), we do not recommand the UMD way of using it for now. You can opt to ESM usage with bundler such as [Webpack](#webpack) or [Vite](#vite).

### ESM

```js
import { initThreads, supportsThreads } from "@antv/graph-wasm";
```

Since [Not all browsers](https://webassembly.org/roadmap/) support WebAssembly threads yet, we need to use feature detection to choose the right one on the JavaScript side.

```js
const supported = await supportsThreads(); // `true` means we can use multithreads now!
const threads = await initThreads(supported);
```

```js
import { Graph } from "@antv/graphlib";

const results = await threads.pageRank(
  graph,
  {
    tolerance: 1e-5,
    alpha: 0.85,
    maxIterations: 1000
  }
);
```

### Use WASM with multithreads

First of all, in order to use SharedArrayBuffer on the Web, you need to enable [cross-origin isolation policies](https://web.dev/coop-coep/). Check out the linked article for details.

To opt in to a cross-origin isolated state, you need to send the following HTTP headers on the main document:

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

If you can't control the server, try this hacky workaround which implemented with ServiceWorker: https://github.com/orgs/community/discussions/13309#discussioncomment-3844940. Here's an example on [Stackblitz](https://stackblitz.com/edit/github-wpncwj-fxmffg?file=src/index.js).

### Webpack

Webpack has good support for Webworker, here's an example on [Stackblitz](https://stackblitz.com/edit/github-wpncwj?file=src/index.js). We use [statikk](https://www.npmjs.com/package/statikk) as static server in this example since it has a good support of cross-origin isolation headers. For more information, please refer to [Use WASM with multithreads](#use-wasm-with-multithreads).

### Vite

Vite also provides [worker options](https://vitejs.dev/config/worker-options.html) in its config. To let Vite [process URL correctly](https://vitejs.dev/guide/dep-pre-bundling.html#customizing-the-behavior) when creating WebWorker in third-party packages, we need to add the package to `optimizeDeps.exclude`:

```js
// vite.config.js
optimizeDeps: {
  exclude: ['@antv/graph-wasm'],
},
```

To enable COOP & COEP headers, we can set them with `plugins`:

```js
// vite.config.js
plugins: [
  {
    name: 'isolation',
    configureServer(server) {
      // @see https://gist.github.com/mizchi/afcc5cf233c9e6943720fde4b4579a2b
      server.middlewares.use((_req, res, next) => {
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
        next();
      });
    },
  },
],
```

Here's a complete example on [Stackblitz](https://stackblitz.com/edit/vite-6b9ga6?file=README.md).

If you can't control the server, try this hacky workaround which implemented with ServiceWorker: https://github.com/orgs/community/discussions/13309#discussioncomment-3844940

## API Reference

### PageRank

* `tolerance` Set the tolerance the approximation, this parameter should be a small magnitude value. The lower the tolerance the better the approximation. The default value is 0.0001.
* `alpha` The damping factor alpha represents the probability to follow an outgoing edge, standard value is 0.85.
* `maxIterations` Set the maximum number of iterations. The default value is 1000.

### SSSP

## Build

Install [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/) first.

Then run the command `npm run build`, the compiled package will be outputted under the `/dist` directory.

```bash
$ npm run build
```

## Publish

```bash
$ npm publish
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
