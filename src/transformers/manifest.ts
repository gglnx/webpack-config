import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { basename, dirname, join } from 'node:path';
import { ConfigTransformerWithOptions } from '../Builder';

export const manifest = (filename = 'manifest.json', publicPath = ''): ConfigTransformerWithOptions => ({
  transformer: () => ({
    plugins: [
      new WebpackManifestPlugin({
        writeToFileEmit: true,
        fileName: filename,
        removeKeyHash: false,
        map: (file) => ({
          ...file,
          name: join(dirname(file.path), basename(file.name).replace(/\.[a-f0-9]+\.(\S+)$/i, '.$1')),
        }),
        publicPath,
      }),
    ],
  }),
  priority: 99999,
});
