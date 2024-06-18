import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { uniquePlugin } from '../utils/uniquePlugin';
import { ConfigTransformer } from '../Builder';

export const analyzer = (reportFilename = 'report.html'): ConfigTransformer => (config) => uniquePlugin(
  ['BundleAnalyzerPlugin'],
  config,
  {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename,
        openAnalyzer: false,
      }),
    ],
  },
);
