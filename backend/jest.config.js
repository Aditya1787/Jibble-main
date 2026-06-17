/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@db/(.*)$': '<rootDir>/src/db/$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        // Relax strict for test files so mocks compile cleanly
        strict: false,
      },
    }],
  },
  collectCoverageFrom: [
    'src/modules/**/*.ts',
    '!src/modules/**/*.types.ts',
    '!src/modules/**/*.validation.ts',
    '!src/modules/**/*.constants.ts',
    '!src/modules/**/*.routes.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
  testTimeout: 10000,
  verbose: true,
};
