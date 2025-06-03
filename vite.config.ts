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
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5174, // Используем тот же порт что и сервер
      clientPort: 5174
    },
    watch: {
      usePolling: true, // Может помочь при проблемах с файловой системой
    },
  },
});
