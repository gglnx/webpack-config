import webpack from 'webpack';
import { mapObject } from '../utils/mapObject';
import { ConfigTransformer } from '../Builder';

export type DefineOptions = {
  definitions: Record<string, unknown>;
};

export const define = ({ definitions }: DefineOptions): ConfigTransformer => () => ({
  plugins: [
    new webpack.DefinePlugin(mapObject(definitions, (value) => JSON.stringify(value))),
  ],
});
