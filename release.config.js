/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['main', { name: 'next', prerelease: true }],
  // @semantic-release/npm is dropped on purpose: the package is private and
  // never published, while its prepare step shells out to `npm version`,
  // which rejects the pnpm `devEngines.packageManager` declaration.
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github',
  ],
}
