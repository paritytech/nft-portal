import HtmlWebpackPlugin from 'html-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import webpack from 'webpack';

export default {
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()],
    fallback: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
    },
  },
  externals: {
    'node:net': {},
    'node:stream': {},
    'node:fs/promises': {},
  },
  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          CAPI_SERVER: JSON.stringify(process.env.CAPI_SERVER),
          CAPI_TARGET: JSON.stringify(process.env.CAPI_TARGET),
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  experiments: {
    topLevelAwait: true,
  },
};
