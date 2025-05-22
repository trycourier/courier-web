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

  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*(spec|test).ts?(x)',
    '**/?(*.)+(spec|test).ts?(x)'
  ],
  setupFiles: ['<rootDir>/src/jest.setup.ts']
});
