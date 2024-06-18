import { ConfigTransformer } from '../Builder';

export const publicPath = (path: string): ConfigTransformer => () => ({
  output: {
    publicPath: path,
  },
});
