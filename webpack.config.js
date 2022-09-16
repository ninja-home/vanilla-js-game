const path = require('path');
const rules = require('require.all')('./tasks/rules');
const plugins = require('require.all')('./tasks/plugins');

module.exports = (env, options) => {
  const modes = {
    development: 'development',
    production: 'production'
  };

  const environment = modes[options.mode] || modes.development;

  rules((name, rule) => rule(environment));
  plugins((name, rule) => rule(environment));

  return {
    mode: environment,
    entry: {
      app: path.resolve(__dirname, 'src/index.js')
    },
    output: {
      filename: '[name].js'
    },
    module: {
      rules: [...rules.files, rules.scripts, rules.styles]
    },
    plugins: [plugins.html, plugins.images, plugins.extractStyles, plugins.purgeStyles],
    
    
    resolve: {
      alias: {
        assets: path.resolve(__dirname, 'src/assets'),
        '~': path.resolve(__dirname, 'src/app')
      }
    }
  };
};
