import { dirname, join } from 'node:path';
import { ConfigTransformerWithOptions } from '../Builder';

export const hashedOutput = (hashDigestLength = 10): ConfigTransformerWithOptions => ({
  transformer: () => ({
    output: {
      hashDigestLength,
      assetModuleFilename(file) {
        let path = '';

        if (file.filename) {
          path = `${dirname(file.filename)}/`;

          if (path === './') {
            path = '';
          }

          if (path.startsWith('../')) {
            path = path.substring(path.indexOf('/') + 1);
          }
        }

        return `${path}[name].[contenthash][ext]`;
      },
      filename: '[name].[contenthash].js',
      chunkFilename(pathData) {
        if (pathData.chunk && 'runtime' in pathData.chunk && typeof pathData.chunk.runtime === 'string') {
          return join(dirname(pathData.chunk.runtime), '[id].[contenthash].js');
        }

        return '[id].[contenthash].js';
      },
      cssFilename: '[name].[contenthash].css',
      cssChunkFilename(pathData) {
        if (pathData.chunk && 'runtime' in pathData.chunk && typeof pathData.chunk.runtime === 'string') {
          return join(dirname(pathData.chunk.runtime), '[id].[contenthash].css');
        }

        return '[id].[contenthash].css';
      },
    },
  }),
  priority: -1000,
});
