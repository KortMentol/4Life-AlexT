import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    devSourcemap: true,
  },
  server: {
    host: '0.0.0.0',
    port: 6554,
    strictPort: true,
    hmr: {
      clientPort: 6554,
      host: 'localhost',
      protocol: 'ws',
      overlay: false
    },
    watch: {
      usePolling: true
    },
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    },
    fs: {
      allow: ['..']
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 6554,
    strictPort: true,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    }
  },
  define: {
    'process.env.NODE_ENV': '"development"'
  }
});
