import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^@fixtures/(.*)$': '<rootDir>/fixtures/$1',
    '^@tools/(.*)$': '<rootDir>/tools/$1',
  },
  collectCoverageFrom: ['tests/**/*.ts'],
  reporters: ['default'],
};

export default config;
