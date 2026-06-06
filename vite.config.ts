import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    css: {
      devSourcemap: true,
    },
    // Conditionally configure esbuild to drop logs ONLY during production build
    esbuild: {
      drop: mode === "production" ? ["console", "debugger"] : [],
    },
    build: {
      target: "esnext", // Modern JS standard
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
              extType = "fonts";
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
  };
});
