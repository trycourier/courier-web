export default /** @type {import('ts-jest').JestConfigWithTsJest} */ ({
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',

  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.spec.json',
      },
    ],
  },

  // Don't transform @trycourier packages - use them as-is
  transformIgnorePatterns: ['node_modules/(?!(@trycourier)/)'],

  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*(spec|test).ts', '**/?(*.)+(spec|test).ts'],
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],

  moduleDirectories: ['node_modules', 'src'],

  // @angular/core is ESM-only and can't be parsed as CJS by Jest. The service
  // only needs the Injectable decorator at runtime, so stub it (see the mock).
  moduleNameMapper: {
    '^@angular/core$': '<rootDir>/src/__mocks__/angular-core.ts',
  },

  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
});
