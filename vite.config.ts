import path from 'node:path'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
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
    }),
    devtools(),
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
    mode === 'analyze' && visualizer({
      open: true,
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
}))
