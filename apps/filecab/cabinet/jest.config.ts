export default {
  displayName: 'filecab-cabinet',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['jest-preset-angular/setup-jest'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': ['jest-preset-angular', {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    }],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
};
