import { ConfigTransformer } from '../Builder';

export const sourceMaps = (inline = false): ConfigTransformer => () => ({
  devtool: inline ? 'inline-source-map' : 'source-map',
});
