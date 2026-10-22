import { createRequire } from 'node:module';
import { ConfigTransformer } from '../Builder';

export const babel = (): ConfigTransformer => () => {
  const corejsPackage = createRequire(import.meta.url)('core-js/package.json') as { version: string };

  return {
    module: {
      rules: [
        {
          test: /\.(m|c)?(js|ts)x?$/,
          exclude: /node_modules[\\/]core-js[\\/]/,
          use: {
            loader: 'babel-loader',
            options: {
              compact: false,
              sourceType: 'unambiguous',
              plugins: [
                [
                  'babel-plugin-polyfill-corejs3',
                  {
                    method: 'entry-global',
                    version: corejsPackage.version,
                  },
                ],
              ],
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
                    shippedProposals: true,
                  },
                ],
              ],
            },
          },
        },
      ],
    },
  };
};
