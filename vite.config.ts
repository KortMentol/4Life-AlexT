import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  optimizeDeps: {
    include: ["lucide-react", "react-tilt"],
    esbuildOptions: {
      target: "es2020",
    },
  },
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: {
          "lucide-react": ["lucide-react"],
          "react-tilt": ["react-tilt"]
        },
      },
    },
  },
  server: {
    host: true,
    port: 3000,
    hmr: {
      host: 'localhost',
      port: 3000,
      overlay: false
    },
    watch: {
      usePolling: true
    },
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true
  },
});
