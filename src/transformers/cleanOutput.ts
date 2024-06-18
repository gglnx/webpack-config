import { ConfigTransformer } from '../Builder';

export const cleanOutput = (): ConfigTransformer => () => ({
  output: {
    clean: true,
  },
});
