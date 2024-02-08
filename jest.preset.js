/** @type {import('ts-jest').JestConfigWithTsJest} */
const nxPreset = require('@nx/jest/preset').default;
const path = require('path');

module.exports = {
  ...nxPreset,
  setupFilesAfterEnv: [path.resolve(__dirname, 'jest.setup.ts')],
  coverageReporters: ['html', 'text'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  verbose: true,
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  transformIgnorePatterns: ['node_modules/(?!axios)'],
};
