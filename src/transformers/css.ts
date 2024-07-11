import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { ConfigTransformer } from '../Builder';

export const css = (): ConfigTransformer => () => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
});
