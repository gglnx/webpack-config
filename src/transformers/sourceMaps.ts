import { ConfigTransformer } from '../Builder';

export type SourceMapsOptions = {
  inline?: boolean;
};

export const sourceMaps = ({ inline = false }: SourceMapsOptions = {}): ConfigTransformer => () => ({
  devtool: inline ? 'inline-source-map' : 'source-map',
});
