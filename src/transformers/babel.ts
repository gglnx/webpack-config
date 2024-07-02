import { ConfigTransformer } from '../Builder';

export const babel = (): ConfigTransformer => () => ({
  module: {
    rules: [
      {
        test: /\.(m|c)?(js|ts)x?$/,
        use: {
          loader: 'babel-loader',
          options: {
            sourceType: 'unambiguous',
            presets: [
              [
                '@babel/preset-typescript',
                {
                  allowDeclareFields: true,
                  onlyRemoveTypeImports: true,
                },
              ],
              [
                '@babel/preset-env',
                {
                  bugfixes: true,
                  useBuiltIns: 'entry',
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
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx'],
  },
});
