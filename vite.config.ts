import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  css: {
    // Настройки для CSS
    devSourcemap: true
  },
  build: {
    // Оптимизация сборки
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          motion: ['framer-motion'],
          vendors: ['react-helmet-async', 'react-scroll-parallax']
        }
      }
    }
  },
  server: {
    // Настройки сервера разработки
    port: 3000,
    strictPort: false,
    open: true
  }
});