export default /** @type {import('ts-jest').JestConfigWithTsJest} */ ({
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',

  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      { useESM: true, tsconfig: './tsconfig.json' }
    ]
  },

  transformIgnorePatterns: ['/node_modules/(?!@trycourier/)'],
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },

  // These suites exercise live Courier APIs over the network, so the default
  // 5s per-test timeout is too tight and flakes on latency spikes (e.g. a slow
  // brands query). Give integration calls generous headroom.
  testTimeout: 30000,

  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*(spec|test).ts?(x)',
    '**/?(*.)+(spec|test).ts?(x)'
  ],
  setupFiles: ['<rootDir>/src/jest.setup.ts'],

  globals: {
    '__PACKAGE_VERSION__': 'test-version',
  },
});
