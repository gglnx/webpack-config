import { createRequire } from 'node:module';
import { ConfigTransformer } from '../Builder';

const corejsPackage = createRequire(import.meta.url)('core-js/package.json') as { version: string };

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
                  corejs: corejsPackage.version,
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
