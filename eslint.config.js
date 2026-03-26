import mouse, { GLOB_TSX } from '@mouse_484/eslint-config'

export default mouse(
  {
    typescript: {
      tsconfigPath: './tsconfig.json',
    },
    react: true,
    tailwind: {
      entryPoint: 'src/globals.css',
    },
    ignores: ['**/*.gen.ts', '**/src/shadcn-ui/**'],
  },
  {
    files: [GLOB_TSX],
    rules: {
      'react-refresh/only-export-components': ['error', {
        extraHOCs: ['createFileRoute'],
      }],
    },
  },
)
