import { ConfigTransformer } from '../Builder';

export const embedSmallFonts = (maxSize = 4 * 1024): ConfigTransformer => () => ({
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
