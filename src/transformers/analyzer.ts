import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { uniquePlugin } from '../utils/uniquePlugin';
import { ConfigTransformer } from '../Builder';

export type AnalyzerOptions = {
  reportFilename?: string;
};

export const analyzer = ({
  reportFilename = 'report.html',
}: AnalyzerOptions = {}): ConfigTransformer => (config) => uniquePlugin(
  ['BundleAnalyzerPlugin'],
  config,
  {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename,
        openAnalyzer: false,
        logLevel: 'error',
      }),
    ],
  },
);
