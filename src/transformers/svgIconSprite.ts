import { createHash } from 'node:crypto';
import { cosmiconfig } from 'cosmiconfig';
import { globby } from 'globby';
import { extname } from 'node:path';
import SvgChunkWebpackPlugin from 'svg-chunk-webpack-plugin';
import { AsyncConfigTransformer } from '../Builder';
import { removeExtension } from '../utils';

let hasRun = false;

export const svgIconSprite = (
  outputFilename: string,
  globs: string | string[],
  hash = true,
): AsyncConfigTransformer => {
  if (hasRun) {
    throw new Error('Currently only one SvgIconSprite is allowed. Sorry!');
  }

  hasRun = true;

  const hasher = createHash('sha1');
  const id = hasher.update(Array.isArray(globs) ? globs.join() : globs).digest('hex');
  const name = `svgIconSprite:${id}`;

  return async (config) => {
    const svgoConfig = await cosmiconfig('svgo').search();
    const entryName = removeExtension(outputFilename);
    const extension = extname(outputFilename);

    let filename = `[name]${extension}`;

    if (hash && typeof config.output?.hashDigestLength === 'number') {
      filename = `[name].[contenthash]${extension}`;
    }

    return {
      entry: {
        [entryName]: {
          layer: name,
          import: await globby(globs, {
            cwd: config.context,
            absolute: true,
          }),
        },
      },
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
          filename,
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
    };
  };
};
