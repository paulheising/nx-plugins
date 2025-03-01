module.exports = {
  displayName: 'nx-jest-playwright',

  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/nx-jest-playwright',
  testEnvironment: 'node',
  preset: '../../jest.preset.ts',
};
