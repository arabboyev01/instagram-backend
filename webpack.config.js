import  path from 'path';

module.exports = {
  mode: 'development',
  entry: './src/index.mts',
  output: {
    path: path.resolve(index.js, 'src/index.dist'),
    filename: 'bundle.js',
  },
  target: 'node',
};
