/// <reference path="./node_modules/@types/node/index.d.ts" />

try {
  require("os").networkInterfaces()
}
catch (e) {
  require("os").networkInterfaces = () => ({})
}

const path = require("path")

const { AureliaPlugin, ModuleDependenciesPlugin } = require("aurelia-webpack-plugin")

const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const { EnvironmentPlugin, ProvidePlugin, LoaderOptionsPlugin, UglifyJsPlugin, optimize } = require("webpack")

const autoprefixer = require("autoprefixer")

const ENV = process.env.NODE_ENV.toLowerCase()
const IS_PROD = (ENV === "production")

const config = {
  devtool: process.env.NODE_ENV === "production" ? "cheap-module-source-map" : "eval",

  entry: {
    main: ["aurelia-bootstrapper"],
    vendor: ["core-js/es6"]
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    chunkFilename: "[name].js"
  },

  resolve: {
    extensions: [".ts", ".js"],
    modules: ["src", "node_modules"].map(x => path.resolve(x)),
    symlinks: false,
  },

  devServer: {
    compress: true,
    port: 9000,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: "\u001b[32m",
      }
    },
    historyApiFallback: true
  },

  stats: {
    colors: {
      green: "\u001b[32m",
    }
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        loader: 'css-loader',
        issuer: /\.html$/i
      },
      {
        test: /\.css$/i,
        loader: ['style-loader', 'css-loader'],
        issuer: /\.[tj]s$/i
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: IS_PROD ? ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader!postcss-loader!sass-loader"
        }) : "style-loader!css-loader!postcss-loader!sass-loader"
      },
      {
        test: /\.ts$/i,
        exclude: /node_modules/,
        loader: "awesome-typescript-loader",
        options: {
          doTypeCheck: false,
          sourceMap: false,
          inlineSourceMap: true,
          inlineSources: true
        }
      },
      {
        test: /\.ts$/i,
        exclude: /node_modules/,
        use: "source-map-loader",
        enforce: "pre"
      },
      {
        test: /\.html$/i,
        use: "html-loader"
      },
      {
        test: /\.(png|gif|jpg)$/,
        loader: "url-loader",
        query: {
          limit: 8192
        }
      },
      {
        test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader",
        query: {
          limit: 10000,
          mimetype: "application/font-woff2"
        }
      },
      {
        test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader",
        query: {
          limit: 10000,
          mimetype: "application/font-woff"
        }
      },
      {
        test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      },
      {
        test: /\.json$/i,
        exclude: /node_modules/,
        use: "json-loader"
      },
      {
        test: /\.(ts)$/,
        loader: "sourcemap-istanbul-instrumenter-loader",
        query: {
          "force-sourcemap": true
        },
        enforce: "post",
        include: "src"
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "tslint-loader",
        enforce: "pre"
      }
    ]
  },

  plugins: [
    new AureliaPlugin(),
    new optimize.CommonsChunkPlugin({
      names: ["vendor", "manifest"],
      minChunks: Infinity
    }),
    new ExtractTextPlugin({
      filename: "styles.css",
      allChunks: true
    }),
    new LoaderOptionsPlugin(
      {
        test: /\.scss$/,
        minimize: false,
        debug: false,
        options: {
          postcss: [autoprefixer({ browsers: ["last 2 versions"] })]
        }
      }
    ),
    new HtmlWebpackPlugin({
      template: "index.html",
      chunksSort: "dependency"
    }),
    new CopyWebpackPlugin([
      { from: "images/**/*" }
    ]),
    new EnvironmentPlugin(["NODE_ENV"]),
    new ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      fetch: "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch",
    }),
  ],
}


if (process.env.NODE_ENV === "production") {
  config.output.filename = "[hash].[name].js"
  config.output.chunkFilename = "[hash].[name].js"

  // OptimizeCssAssetsPlugin ensures that no duplicate CSS is put into final bundle
  // handy in the case of the same stylesheet imported multiple times
  config.plugins.push(
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require("cssnano"),
      cssProcessorOptions: { discardComments: { removeAll: true }, discardUnused: false },
      canPrint: true
    })
  )

  config.plugins.push(
    new LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  )
  config.plugins.push(
    new optimize.UglifyJsPlugin()
  )
}

module.exports = config
