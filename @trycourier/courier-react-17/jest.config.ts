export default /** @type {import('ts-jest').JestConfigWithTsJest} */ ({
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',

  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.json',
        jsx: 'react-jsx'
      }
    ]
  },

  // Don't transform @trycourier packages - use them as-is
  transformIgnorePatterns: [
    'node_modules/(?!(@trycourier)/)',
    '^.+\\.module\\.(css|sass|scss)$'
  ],

  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*(spec|test).ts?(x)',
    '**/?(*.)+(spec|test).ts?(x)'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],

  // Module resolution
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^react$': require.resolve('react'),
    '^react-dom$': require.resolve('react-dom'),
    '^react/jsx-runtime$': require.resolve('react/jsx-runtime'),
  },

  // Test environment options
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  }
});
