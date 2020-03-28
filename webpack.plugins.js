const webpack = require("webpack")
const path = require('path')
const htmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin")
const CopyPlugin = require('copy-webpack-plugin')

module.exports = [
  new webpack.HotModuleReplacementPlugin(),
  // 调用之前先清除 map 文件夹
  new CleanWebpackPlugin(),
  // 4.x之前可用uglifyjs-webpack-plugin用以压缩文件，4.x可用--mode更改模式为production来压缩文件
  new UglifyjsWebpackPlugin(),
  new CopyPlugin([{
    from: path.resolve(__dirname, "src/assets"),
    to: './static'
  }]),
 
  new htmlWebpackPlugin({
    filename: "maze.html",
    title: "three",
    chunks: ['three'],
    template: "./src/views/maze.html"
  }),
  
]