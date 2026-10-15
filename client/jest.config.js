module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '^react-native/setup-env$': '<rootDir>/tests/setupEnv.js',
  },
  setupFiles: ['<rootDir>/tests/setupEnv.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*)/)',
  ],
  testMatch: ['**/tests/**/*.test.js'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
