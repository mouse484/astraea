import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    rolldownOptions: {
      input: {
        main: path.resolve(import.meta.dirname, 'index.html'),
        sw: path.resolve(import.meta.dirname, 'src/service-worker.ts'),
      },
      output: {
        entryFileNames: chunk =>
          chunk.name === 'sw' ? '[name].js' : 'assets/[name]-[hash].js',
      },
    },
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      verboseFileRoutes: false,
    }),
    devtools(),
    react(),
    tailwindcss(),
  ],
})
