import type { KnipConfig } from 'knip'

export default {
  ignore: ['**/**.gen.*', '**/src/shadcn-ui/**/*'],
  ignoreDependencies: ['tailwindcss', 'tw-animate-css'],
} satisfies KnipConfig
