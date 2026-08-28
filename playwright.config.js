import { defineConfig } from "@playwright/test";

const port = process.env.PORT || "5173";
const host = "127.0.0.1";
const baseURL = process.env.BASE_URL || `http://${host}:${port}`;

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL
  },
  webServer: {
    command: `npm run dev -- --port ${port}`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120000
  }
});
