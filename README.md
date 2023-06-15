<h1 align="center">
<b>AntV Algorithm</b>
</h1>

[![Build Status](https://github.com/antvis/algorithm/workflows/build/badge.svg?branch=next)](https://github.com/antvis//actions)
[![Coverage Status](https://img.shields.io/coveralls/github/antvis/algorithm/next.svg)](https://coveralls.io/github/antvis/algorithm?branch=next)
[![npm Download](https://img.shields.io/npm/dm/@antv/algorithm.svg)](https://www.npmjs.com/package/@antv/algorithm)
[![npm License](https://img.shields.io/npm/l/@antv/algorithm.svg)](https://www.npmjs.com/package/@antv/algorithm)

- [@antv/graph](./packages/graph/README.md) [![npm Version](https://img.shields.io/npm/v/@antv/graph/alpha)](https://www.npmjs.com/package/@antv/graph) Implemented with TypeScript. [Online Demo](https://observablehq.com/d/2db6b0cc5e97d8d6)
- [@antv/graph-rust](./packages/graph-rust/README.md) Implemented with Rust.
- [@antv/graph-wasm](./packages/graph-wasm/README.md) [![npm Version](https://img.shields.io/npm/v/@antv/graph-wasm)](https://www.npmjs.com/package/@antv/graph-wasm) Provide a WASM binding of `@antv/graph-rust`. [Online Demo](https://observablehq.com/d/288c16a54543a141)
- [@antv/graph-gpu](./packages/graph-gpu/README.md) [![npm Version](https://img.shields.io/npm/v/@antv/graph-gpu)](https://www.npmjs.com/package/@antv/graph-gpu) Accelerate some parallelizable algorithms such as Fruchterman with WebGPU which has a better performance under large amount of data.

It is an algorithm package of AntV, mainly includes graph related algorithms:

- **Centrality**
  - pageRank: page rank algorithm for nodes ranking

## Development

We use [Vite](https://vitejs.dev/) to start a dev server:

```bash
$ pnpm dev
```

## Test

Run all the test cases with Jest:

```bash
$ pnpm test
```

## Publish

Using Changesets with pnpm: https://pnpm.io/next/using-changesets

The generated markdown files in the .changeset directory should be committed to the repository.

```bash
pnpm changeset
```

This will bump the versions of the packages previously specified with pnpm changeset (and any dependents of those) and update the changelog files.

```bash
pnpm changeset version
```

Commit the changes. This command will publish all packages that have bumped versions not yet present in the registry.

```bash
pnpm publish -r
```

If you want to publish versions for test:

```bash
pnpm changeset pre enter alpha
pnpm changeset pre enter beta
pnpm changeset pre enter rc
```
