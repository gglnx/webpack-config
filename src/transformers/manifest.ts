import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { posix } from 'node:path';
import { ConfigTransformerWithOptions } from '../Builder';

export type ManifestOptions = {
  filename?: string;
  publicPath?: string;
};

export const manifest = ({
  filename = 'manifest.json',
  publicPath = '',
}: ManifestOptions = {}): ConfigTransformerWithOptions => ({
  transformer: (config) => {
    const hashLength = config.output?.hashDigestLength ?? 20;
    const hashPattern = new RegExp(String.raw`\.[a-f0-9]{${hashLength}}(\.\S+)$`, 'i');

    return {
      plugins: [
        new WebpackManifestPlugin({
          writeToFileEmit: true,
          fileName: filename,
          removeKeyHash: false,
          map: (file) => {
            const [, origin = '', path] = /^((?:[a-z][\d+.a-z-]*:)?\/\/[^/]*)?(.*)$/is.exec(file.path)!;
            const name = posix.basename(file.name).replace(hashPattern, '$1');

            return {
              ...file,
              name: origin + posix.join(posix.dirname(path), name),
            };
          },
          publicPath,
        }),
      ],
    };
  },
  priority: 99_999,
});
