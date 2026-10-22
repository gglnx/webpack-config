import { ConfigTransformer } from '../Builder';

export const babel = (): ConfigTransformer => () => ({
  module: {
    rules: [
      {
        test: /\.(m|c)?(js|ts)x?$/,
        use: {
          loader: 'babel-loader',
          options: {
            compact: false,
            sourceType: 'unambiguous',
            presets: [
              [
                '@babel/preset-typescript',
                {
                  onlyRemoveTypeImports: true,
                },
              ],
              [
                '@babel/preset-env',
                {
                  modules: 'auto',
                  corejs: '3',
                  shippedProposals: true,
                },
              ],
            ],
          },
        },
      },
    ],
  },
});
