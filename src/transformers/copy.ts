import CopyPlugin from 'copy-webpack-plugin';
import arrify from 'arrify';
import { ConfigTransformer } from '../Builder';

export const copy = (copyFrom: string | string[], hash = true): ConfigTransformer => (config) => ({
  plugins: [
    new CopyPlugin({
      patterns: arrify(copyFrom).map((from) => ({
        from,
        to: () => {
          if (hash && typeof config.output?.hashDigestLength === 'number') {
            return '[path][name].[contenthash][ext]';
          }

          return '[path][name][ext]';
        },
      })),
    }),
  ],
});
