
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Opciones optimizadas para despliegue en servidores web tradicionales
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa React en su propio chunk
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Separa componentes UI en otro chunk
          'vendor-ui': [
            '@radix-ui/react-accordion', 
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
          ],
          // Separa dependencias adicionales
          'vendor-charts': ['recharts'],
          'vendor-utils': ['date-fns', 'zod', 'react-hook-form'],
        },
        // Mejora el nombre de los archivos para mejor cache
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Configuración para Single Page Application
    emptyOutDir: true,
  },
  base: './', // Hace que los paths sean relativos, importante para subdirectorios
}));
