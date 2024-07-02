import { type Configuration } from 'webpack';
import { merge as deepMerge } from 'ts-deepmerge';
import { dirname, join } from 'node:path';

export declare type MergeStrategy = 'default' | 'overwrite';

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

export class Builder {
  private sourcePath: string;
  private outputPath: string;
  private mode: 'none' | 'development' | 'production';
  private pipeline: Array<PipelineTransformer> = [];

  constructor(sourcePath: string, outputPath: string, mode: 'none' | 'development' | 'production') {
    this.sourcePath = sourcePath;
    this.outputPath = outputPath;
    this.mode = mode;
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
      mode: this.mode,
      context: this.sourcePath,
      optimization: {
        chunkIds: 'named',
      },
      experiments: {
        layers: true,
      },
      output: {
        path: this.outputPath,
        assetModuleFilename: '[path][name][ext]',
        filename: '[name].js',
        chunkFilename(pathData) {
          if (pathData.chunk && 'runtime' in pathData.chunk && typeof pathData.chunk.runtime === 'string') {
            return join(dirname(pathData.chunk.runtime), '[id].js');
          }

          return '[id].js';
        },
        cssFilename: '[name].css',
        cssChunkFilename(pathData) {
          if (pathData.chunk && 'runtime' in pathData.chunk && typeof pathData.chunk.runtime === 'string') {
            return join(dirname(pathData.chunk.runtime), '[id].css');
          }

          return '[id].css';
        },
      },
      performance: {
        hints: false,
      },
      watchOptions: {
        poll: 500,
      },
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
