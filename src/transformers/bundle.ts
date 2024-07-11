import { resolve } from 'node:path';
import type { NormalModule, ModuleGraph, ChunkGraph } from 'webpack';

import { ConfigTransformer } from '../Builder';
import { removeExtension } from '../utils';

export type BundleOptions = {
  name: string;
  cssEntry: string | undefined;
  jsEntry: string | undefined;
  hash: boolean;
  mergeCss: boolean;
};

type CacheGroupsContext = {
  moduleGraph: ModuleGraph;
  chunkGraph: ChunkGraph;
}

export const bundle = ({
  name,
  cssEntry,
  jsEntry,
  mergeCss = true,
  hash = false,
}: BundleOptions): ConfigTransformer => (config) => {
  const context = config.context as string;
  const layer = `bundle:${name}`;

  return {
    entry: {
      [name]: {
        import: [
          cssEntry ? resolve(context, cssEntry) : null,
          jsEntry ? resolve(context, jsEntry) : null,
        ].filter((entry) => entry !== null),
        layer,
        filename: (pathData, assetInfo) => {
          const jsName = jsEntry ? removeExtension(jsEntry) : '[name]';
          const filename = assetInfo?.css && cssEntry ? removeExtension(cssEntry) : jsName;

          return `${filename}${hash ? '.[contenthash]' : ''}.${assetInfo?.css ? 'css' : 'js'}`;
        },
      },
    },
    optimization: cssEntry ? {
      splitChunks: {
        cacheGroups: {
          [name]: {
            reuseExistingChunk: false,
            name,
            type: 'css/mini-extract',
            enforce: true,
            chunks: mergeCss ? 'all' : 'initial',
            test(module: NormalModule, { moduleGraph, chunkGraph }: CacheGroupsContext) {
              if (module.type !== 'css/mini-extract') {
                return false;
              }

              // Skip chunks that have more than one runtimes (don't share chunks between bundles)
              for (const chunk of chunkGraph.getModuleChunks(module)) {
                if (typeof chunk.runtime === 'object') {
                  if (chunk.runtime.size > 1) {
                    return false;
                  }
                }
              }

              return module.layer === layer || moduleGraph.getIssuer(module)?.layer === layer;
            },
          },
        },
      },
    } : {},
  };
};
