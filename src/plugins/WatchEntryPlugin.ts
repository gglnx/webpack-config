import type { Compiler } from 'webpack';

const PLUGIN_NAME = 'WatchEntryPlugin';

class WatchEntryPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.make.tapPromise(PLUGIN_NAME, (compilation) => {});
  }
}

export default WatchEntryPlugin;
