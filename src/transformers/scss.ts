import WebpackRemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { NodePackageImporter } from 'sass';
import { TransformAttributeOptions, browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';
import { ConfigTransformer } from '../Builder';

export const scss = (): ConfigTransformer => (config) => ({
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                importers: [new NodePackageImporter()],
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: ['...', new CssMinimizerPlugin<Partial<TransformAttributeOptions>>({
      minify: CssMinimizerPlugin.lightningCssMinify,
      minimizerOptions: {
        targets: browserslistToTargets(browserslist()),
      },
    })],
  },
  plugins: [
    new WebpackRemoveEmptyScriptsPlugin({
      extensions: /\.s?css$/,
    }),
    new MiniCssExtractPlugin({
      filename: config.output?.cssFilename,
      chunkFilename: config.output?.cssChunkFilename,
    }),
  ],
});
