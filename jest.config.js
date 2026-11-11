const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^.+\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/.next-dev/', '<rootDir>/node_modules/'],
  modulePathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/.next-dev/'],
};

module.exports = createJestConfig(customJestConfig);
