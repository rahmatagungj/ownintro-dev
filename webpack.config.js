const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'ownintro.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'ownintro.min.js',
    library: 'ownintro',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: [/node_modules/],
        options: {
          presets: ["@babel/preset-env"],
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
    ]
  },
  optimization: {
    minimize: true,
    splitChunks: false
  },
  target: "web",
  mode: "production",
  resolve: {
    extensions: [".js", ".css"]
  },
};