import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { getSecurityHeaders } from "./src/utils/securityHeaders";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/Disti-Supper-App/",
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
  },
  plugins: [tsconfigPaths(), react()],
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new'],
    headers: getSecurityHeaders(true) // Apply dev-safe security headers
  }
});