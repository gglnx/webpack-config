import { AssetInfo, PathData } from 'webpack';
import { ConfigTransformer } from '../Builder';

export type PublicPathOptions = {
  path: string | ((pathData: PathData, assetInfo?: AssetInfo) => string);
};

export const publicPath = ({ path }: PublicPathOptions): ConfigTransformer => () => ({
  output: {
    publicPath: path,
  },
});
