import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  css: {
    devSourcemap: true,
  },
  // ИСПОЛЬЗУЕМ ESBUILD (встроенный, быстрый, надежный)
  esbuild: {
    drop: ["console", "debugger"], // Удалит console.log в продакшене
  },
  build: {
    target: "esnext", // Современный JS (2025/2026 стандарты)
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return "assets/[name]-[hash][extname]";
          let extType = assetInfo.name.split(".").at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType || "")) {
            extType = "img";
          } else if (/woff2?|ttf|otf|eot/i.test(extType || "")) {
            extType = "fonts"; // Добавили папку для шрифтов
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
  },
  server: {
    port: 3000,
    strictPort: false,
    open: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
