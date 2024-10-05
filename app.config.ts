import { defineConfig } from "@tanstack/start/config";

export default defineConfig({
  server: {
    preset: "node-server",
    prerender: {
      routes: ["/"],
      crawlLinks: true,
    },
  },
});
