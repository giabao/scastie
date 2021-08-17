const Path = require('path');
const { merge } = require("webpack-merge");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const Webpack = require('webpack');

const ProdConfig = 
  new Webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  })

const Common = require('./webpack.common.js');
const publicFolderName = "out/public"

function extract(){
  return new MiniCssExtractPlugin();
}

const extractSassApp = extract();
const extractSassEmbed = extract();

function Web(extractSass){
  return merge(Common.Web, {
    mode: 'production',
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    output: {
      path: Path.resolve(__dirname, publicFolderName),
      publicPath: '/public/',
      libraryTarget: 'window',
      clean: true,
    },
    resolve: {
      alias: {
        'scalajs': Path.resolve(__dirname)
      }
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: "css-loader", options: {sourceMap: true} },
            { loader: "resolve-url-loader", options: {sourceMap: true} },
            { loader: "sass-loader", options: {sourceMap: true} }
          ]
        },
        {
          test: /\.js$/,
          use: ["source-map-loader"],
          enforce: "pre"
        }
      ]
    },
    plugins: [
      ProdConfig,
      extractSass,
      new CompressionPlugin({
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  });
}

const WebApp = merge(Web(extractSassApp), {
  entry: {
    app: Path.resolve(Common.resourcesDir, './prod.js')
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      chunks: ["app"],
      template: Path.resolve(Common.resourcesDir, './prod.html'),
      favicon: Path.resolve(Common.resourcesDir, './images/favicon.ico')
    })
  ]
});

const WebEmbed = merge(Web(extractSassEmbed), {
  entry: {
    embedded: Path.resolve(Common.resourcesDir, './prod-embed.js')
  }
});

const ScalaJs = merge(Common.ScalaJs,{
  plugins: [
    ProdConfig
  ]
});


module.exports = [
  ScalaJs,
  WebApp,
  WebEmbed
]
