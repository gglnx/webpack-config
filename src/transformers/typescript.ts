import { ConfigTransformer } from '../Builder';

export const typescript = (): ConfigTransformer => () => ({
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
    ],
  },
});
