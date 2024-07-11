import type { Configuration } from 'webpack';
import { merge as deepMerge } from 'ts-deepmerge';
import { dirname, join } from 'node:path';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { TransformAttributeOptions, browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import WebpackRemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';

export declare type MergeStrategy = 'default' | 'overwrite';

export declare type WebpackMode = 'none' | 'development' | 'production';

export declare type AsyncConfigTransformer = (
  config: Configuration
) => Promise<Configuration>;

export declare type ConfigTransformer = (
  config: Configuration
) => Configuration;

export declare type PipelineTransformer = {
  transformer: AsyncConfigTransformer | ConfigTransformer,
  priority: number,
  mergeStrategy: MergeStrategy,
};

export declare type ConfigTransformerWithOptions = {
  transformer: AsyncConfigTransformer | ConfigTransformer,
  priority?: number,
  mergeStrategy?: MergeStrategy;
};

export declare type BuilderOptions = {
  sourcePath: string;
  outputPath: string;
  mode?: WebpackMode;
  cssChunkPath?: string;
  chunkPath?: string;
  hashDigestLength?: number;
};

const cssFilename = () => '[name].css';

const chunkFilename = (extension: string, chunkPath?: string) => join(
  chunkPath ?? '',
  `[id].[contenthash].${extension}`,
);

export class Builder {
  private options: BuilderOptions;
  private pipeline: Array<PipelineTransformer> = [];

  constructor(options: BuilderOptions) {
    this.options = options;
  }

  add(transformer: ConfigTransformer | AsyncConfigTransformer | ConfigTransformerWithOptions | null | undefined) {
    if (!transformer) {
      return this;
    }

    if (typeof transformer === 'function') {
      this.pipeline.push({
        priority: 0,
        mergeStrategy: 'default',
        transformer,
      });
    } else {
      this.pipeline.push({ priority: 0, mergeStrategy: 'default', ...transformer });
    }

    return this;
  }

  async build() {
    let config: Configuration = {
      mode: this.options.mode ?? 'none',
      context: this.options.sourcePath,
      optimization: {
        chunkIds: 'named',
        splitChunks: {
          minChunks: 2,
        },
        minimizer: ['...', new CssMinimizerPlugin<Partial<TransformAttributeOptions>>({
          minify: CssMinimizerPlugin.lightningCssMinify,
          minimizerOptions: {
            targets: browserslistToTargets(browserslist()),
          },
        })],
      },
      experiments: {
        layers: true,
      },
      output: {
        path: this.options.outputPath,
        hashDigestLength: this.options.hashDigestLength ?? 10,
        assetModuleFilename(file) {
          let path = '';

          if (file.filename) {
            path = `${dirname(file.filename)}/`;

            if (path === './') {
              path = '';
            }

            if (path.startsWith('../')) {
              path = path.substring(path.indexOf('/') + 1);
            }
          }

          return `${path}[name].[contenthash][ext]`;
        },
        filename() {
          return '[name].js';
        },
        chunkFilename: () => chunkFilename('js', this.options.chunkPath),
        cssFilename,
        cssChunkFilename: () => chunkFilename('css', this.options.cssChunkPath),
      },
      performance: {
        hints: false,
      },
      watchOptions: {
        poll: 500,
      },
      resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx'],
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename: (pathData, assetInfo) => {
            if (pathData.chunk && 'filenameTemplate' in pathData.chunk) {
              if (typeof pathData.chunk.filenameTemplate === 'function') {
                return pathData.chunk.filenameTemplate(pathData, {
                  ...assetInfo,
                  css: true,
                });
              }

              if (typeof pathData.chunk.filenameTemplate === 'string') {
                return pathData.chunk.filenameTemplate;
              }
            }

            return '[name].css';
          },
          chunkFilename: () => chunkFilename('css', this.options.cssChunkPath),
        }),
        new WebpackRemoveEmptyScriptsPlugin({
          extensions: /\.(css|scss|sass|less|styl|svg)([?].*)?$/,
        }),
      ],
    };

    for (const { transformer, mergeStrategy } of this.pipeline.sort((a, b) => a.priority - b.priority)) {
      // eslint-disable-next-line no-await-in-loop
      const outputedConfig = await transformer(config);

      if (mergeStrategy === 'overwrite') {
        config = outputedConfig;
      } else {
        config = deepMerge(config, outputedConfig);
      }
    }

    return config;
  }
}
