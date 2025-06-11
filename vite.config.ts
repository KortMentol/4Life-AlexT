import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
import { resolve } from "path";

export default defineConfig({
  plugins: [react({
    // Включаем флаги будущих версий React Router
    fastRefresh: true,
  })],
  css: {
    // Настройки для CSS
    devSourcemap: true,
    postcss: {
      plugins: [
        require('autoprefixer')({
          // Добавляем автопрефиксер для лучшей совместимости
          overrideBrowserslist: ['last 2 versions', '> 1%', 'not dead']
        })
      ]
    },
  },
  build: {
    // Оптимизация сборки
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router-dom"],
          motion: ["framer-motion"],
          vendors: ["react-helmet-async", "react-scroll-parallax"],
        },
      },
    },
  },
  server: {
    // Настройки сервера разработки
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
