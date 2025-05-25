import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    optimizeCssModules()
  ],
  optimizeDeps: {
    include: ['lucide-react'],
    esbuildOptions: {
      // Увеличиваем лимит для обработки всех иконок
      target: 'es2020',
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          // Выносим lucide-react в отдельный чанк
          'lucide-react': ['lucide-react']
        }
      }
    }
  },
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 24678, // Фиксированный порт для HMR
      clientPort: 24678 // Явно указываем порт для клиента
    },
    watch: {
      usePolling: true // Может помочь при проблемах с файловой системой
    }
  }
});
