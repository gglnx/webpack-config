import CopyPlugin from 'copy-webpack-plugin';
import { ConfigTransformer } from '../Builder';

export type CopyOptions = {
  copyFrom: string | string[];
  hash: boolean;
};

export const copy = ({ copyFrom, hash = false }: CopyOptions): ConfigTransformer => () => ({
  plugins: [
    new CopyPlugin({
      patterns: (copyFrom == null ? [] : (Array.isArray(copyFrom) ? copyFrom : [copyFrom])).map((from) => ({
        from,
        to: () => (hash ? '[path][name].[contenthash][ext]' : '[path][name][ext]'),
      })),
    }),
  ],
});
