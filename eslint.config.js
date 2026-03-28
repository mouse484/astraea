import mouse, { GLOB_TSX } from '@mouse_484/eslint-config'
import pluginQuery from '@tanstack/eslint-plugin-query'
import pluginRouter from '@tanstack/eslint-plugin-router'

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
  {
    rules: {
      'unicorn/prevent-abbreviations': [
        'error',
        {
          allowList: {
            Props: true,
            Ref: true,
            args: true,
            Req: true,
          },
        },
      ],
    },
  },
  {
    files: ['vite-env.d.ts'],
    rules: {
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  pluginQuery.configs['flat/recommended'],
  pluginRouter.configs['flat/recommended'],
)
