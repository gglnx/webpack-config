import { ConfigTransformer } from '../Builder';

export const typescript = (): ConfigTransformer => () => ({
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
      },
    ],
  },
});
