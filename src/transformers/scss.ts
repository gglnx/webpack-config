import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { cosmiconfig } from 'cosmiconfig';
import { NodePackageImporter, Options } from 'sass';
import { merge } from 'ts-deepmerge';

import { AsyncConfigTransformer } from '../Builder';

export const scss = (): AsyncConfigTransformer => async () => {
  const sassConfig = await cosmiconfig('sass').search();
  const sassOptions: Options<'async'> = sassConfig?.config ?? {};
  const sassDefaultOptions: Options<'async'> = {
    importers: [new NodePackageImporter()],
  };

  return {
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
                sassOptions: merge(sassDefaultOptions, sassOptions),
              },
            },
          ],
        },
      ],
    },
  };
};
