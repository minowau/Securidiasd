module.exports = {
  projects: [
    '<rootDir>/packages/core',
    '<rootDir>/packages/react',
    '<rootDir>/packages/node',
    '<rootDir>/packages/cli',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['packages/**/*.{ts,tsx}', '!**/node_modules/**', '!**/dist/**'],
}; 