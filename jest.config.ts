import type { Config } from 'jest';
import * as dotenv from 'dotenv';

dotenv.config();

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
  testTimeout: 30000,
};

export default config;
