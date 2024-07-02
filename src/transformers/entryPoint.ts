import { globby } from 'globby';
import { relative } from 'path';
import { removeExtension } from '../utils/removeExtension';
import { AsyncConfigTransformer } from '../Builder';

export const entryPoint = (name: string, globs: string | string[]): AsyncConfigTransformer => async (config) => ({
  entry: (await globby(globs, {
    cwd: config.context,
    absolute: true,
  })).reduce((entries, file) => {
    const entryName = removeExtension(relative(config.context as string, file));
    return {
      ...entries,
      [entryName]: {
        import: file,
        layer: name,
      },
    };
  }, {}),
});
