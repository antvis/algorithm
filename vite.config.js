import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "./site/",
  server: {
    port: 8080,
    open: "/",
  },
  base: "/algorithm/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "site/index.html"),
        benchmark: resolve(__dirname, "site/benchmark/index.html"),
      },
    },
  },
});
