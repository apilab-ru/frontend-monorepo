const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  testMatch: ['**/*.{spec,test}.{js,jsx,ts,tsx}'],
};
