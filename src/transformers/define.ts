import webpack from 'webpack';
import { mapObject } from '../utils/mapObject';
import { ConfigTransformer } from '../Builder';

export const define = (definitions: Record<string, unknown>): ConfigTransformer => () => ({
  plugins: [
    new webpack.DefinePlugin(mapObject(definitions, (value) => JSON.stringify(value))),
  ],
});
