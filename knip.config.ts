import type { KnipConfig } from 'knip'

export default {
  ignore: ['**/src/shadcn-ui/**/*'],
  ignoreDependencies: [
    /** from @antufu/eslint-config */
    '@eslint-react/eslint-plugin',
    'eslint-plugin-react-hooks',
    'eslint-plugin-react-refresh',
  ],
} satisfies KnipConfig
