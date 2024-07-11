import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { NodePackageImporter } from 'sass';

import { ConfigTransformer } from '../Builder';

export const scss = (): ConfigTransformer => () => ({
  module: {
    rules: [
      {
        test: /\.scss$/,
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
});
