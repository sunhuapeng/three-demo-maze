const path = require("path");
const pluginsConfig = require("./webpack.plugins.js");
module.exports = {
  entry: {
    three: "./src/scene/index.ts"
  },
  mode: "development",
  plugins: pluginsConfig,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"]
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader"
        }
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              ["@babel/plugin-proposal-class-properties", { loose: true }]
            ]
          }
        }
      }
    ]
  },
  devServer: {
    host: "localhost",
    port: "4001",
    disableHostCheck: false // 取消host检查
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "map")
  }
};
