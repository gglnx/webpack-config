import { Configuration } from 'webpack';
import { mergeWithCustomize, unique } from 'webpack-merge';

export const uniquePlugin = (
  pluginNames: string[],
  baseConfig: Configuration,
  ...configs: Configuration[]
): Configuration => mergeWithCustomize({
  customizeArray: unique(
    'plugins',
    pluginNames,
    (plugin) => plugin.constructor && plugin.constructor.name,
  ),
})(baseConfig, ...configs);
