import { defineConfig } from 'vite-plus'

export default defineConfig({
  defaultPackage: './apps/web',
  fmt: {
    singleQuote: true,
    semi: false,
  },
  run: {
    cache: true,
  },
})
