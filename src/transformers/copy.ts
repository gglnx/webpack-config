import CopyPlugin from 'copy-webpack-plugin';
import arrify from 'arrify';
import { ConfigTransformer } from '../Builder';

export type CopyOptions = {
  copyFrom: string | string[],
  hash: boolean,
};

export const copy = ({ copyFrom, hash = false }: CopyOptions): ConfigTransformer => () => ({
  plugins: [
    new CopyPlugin({
      patterns: arrify(copyFrom).map((from) => ({
        from,
        to: () => (hash ? '[path][name].[contenthash][ext]' : '[path][name][ext]'),
      })),
    }),
  ],
});
