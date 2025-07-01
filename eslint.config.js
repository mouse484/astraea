import { mouse } from '@mouse_484/eslint-config'

export default mouse(
  {
    react: true,
    tailwind: {
      entryPoint: 'src/globals.css',
    },
    ignores: ['**/*.gen.ts', '**/src/shadcn-ui/**'],
  },
)
