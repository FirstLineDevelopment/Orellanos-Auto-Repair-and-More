import { resolve } from "node:path";
import { defineConfig } from "vite";
import firstline from "./firstline.config.js";

function pageInputs() {
  return Object.fromEntries(
    firstline.pages.map((page) => {
      const source = page.source || "index.html";
      const name = source.replace(/\.html$/i, "") || "index";
      return [name, resolve(__dirname, source)];
    })
  );
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: pageInputs()
    }
  }
});
