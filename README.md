# @gglnx/webpack-config

This is my personal opinionated Webpack configuration builder.

## Installation

Install the configuration and all peer dependencies:

```bash
npm install --save-dev webpack-cli @gglnx/webpack-config
```

## Usage

Create an `webpack.config.mjs` file in your project root:

```js
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as webpack from '@gglnx/webpack-config';

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const sourcePath = resolve(rootDirectory, 'src');
const outputPath = resolve(rootDirectory, 'build');
const isDevelopment = process.env.NODE_ENV === 'development';
const mode = isDevelopment ? 'development' : 'production';

const config = await (new webpack.Builder(sourcePath, outputPath, mode))
  .add(webpack.entryPoint('main', [
    'stylesheets/main.scss',
    'javascripts/main.ts',
  ]))
  .add(webpack.cleanOutput())
  .add(webpack.scss())
  .add(webpack.babel())
  .add(webpack.sourceMaps())
  .add(webpack.manifest())
  .add(webpack.analyzer())
  .add(webpack.copy('images/**'))
  .add(webpack.hashedOutput())
  .build();

export default config;
```

## Contribution Policy

This project is open to code contributions for bug fixes only. Features carry a long-term maintenance burden so they will not be accepted at this time. Please submit an issue if you have a feature you'd like to request.

Please note that project is provided AS IN. Issues requesting support or help will be closed and locked. You can [hire me](https://dennismorhardt.de/) for any help with your Webpack configuration.

## License

Distributed under the [MIT License](https://opensource.org/license/mit). See `LICENSE` for more information.
