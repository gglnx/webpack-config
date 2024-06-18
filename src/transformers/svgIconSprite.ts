import { createHash } from 'crypto';
import { cosmiconfig } from 'cosmiconfig';
import SvgChunkWebpackPlugin from 'svg-chunk-webpack-plugin';
import { merge } from 'webpack-merge';
import { entryPoint } from './entryPoint';
import { AsyncConfigTransformer } from '../Builder';

let hasRun = false;

export const svgIconSprite = (outputFilename: string, globs: string | string[]): AsyncConfigTransformer => {
  if (hasRun) {
    throw new Error('Currently only one SvgIconSprite is allowed. Sorry!');
  }

  hasRun = true;

  const hasher = createHash('sha1');
  const id = hasher.update(Array.isArray(globs) ? globs.join() : globs).digest('hex');
  const name = `svgIconSprite:${id}`;
  const entryPointConfig = entryPoint(name, globs);

  return async (config) => {
    const svgoConfig = await cosmiconfig('svgo').search();

    return merge(await entryPointConfig(config), {
      module: {
        rules: [
          {
            test: /\.svg$/,
            issuerLayer: (layer) => layer === name,
            use: {
              // @ts-expect-error Loader is not part of type definitions
              loader: SvgChunkWebpackPlugin.loader,
              options: {
                configFile: svgoConfig?.filepath,
              },
            },
          },
        ],
      },
      plugins: [
        new SvgChunkWebpackPlugin({
          filename: outputFilename,
          svgstoreConfig: {
            renameDefs: true,
            inline: true,
            svgAttrs: {
              xmlns: 'http://www.w3.org/2000/svg',
              'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            },
          },
        }),
      ],
    });
  };
};
