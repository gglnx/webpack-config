import { ConfigTransformer } from '../Builder';

export type EmbedSmallFontsOptions = {
  maxSize?: number;
};

export const embedSmallFonts = ({ maxSize = 4 * 1024 }: EmbedSmallFontsOptions = {}): ConfigTransformer => () => ({
  module: {
    rules: [
      {
        test: /\.(woff2?)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize,
          },
        },
      },
    ],
  },
});
