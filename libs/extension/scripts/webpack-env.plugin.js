const path = require('path');

function getEnvTsConfig(dir) {
  const env = process.argv.find(item => item.includes('--env'))?.replace('--env=', '');
  const file = path.resolve(dir, `./tsconfig.scripts-${env}.json`);
  return file;
}

module.exports = getEnvTsConfig;
