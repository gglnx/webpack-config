import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import webpack from 'webpack';

// Imported through the package exports, so this tests the published build
import {
  Builder,
  babel,
  bundle,
  css,
  manifest,
  svgIconSprite,
  typescript,
} from '@gglnx/webpack-config';

const require = createRequire(import.meta.url);
const fixturePath = fileURLToPath(new URL('fixture', import.meta.url));
const outputPath = await mkdtemp(join(tmpdir(), 'webpack-config-'));

const createBuilder = () => new Builder({
  sourcePath: fixturePath,
  outputPath,
  mode: 'production',
});

const compile = (config) => new Promise((resolve, reject) => {
  webpack(config, (error, stats) => {
    if (error) {
      reject(error);
    } else if (stats.hasErrors()) {
      reject(new Error(stats.toString('errors-only')));
    } else {
      resolve(stats);
    }
  });
});

after(() => rm(outputPath, { recursive: true, force: true }));

describe('builder', () => {
  it('produces a valid webpack config', async () => {
    const config = await createBuilder()
      .add(babel())
      .add(typescript())
      .add(css())
      .add(manifest())
      .build();

    assert.doesNotThrow(() => webpack.validate(config));
  });

  it('keeps assets from outside the context inside the output path', async () => {
    const config = await createBuilder().build();
    const filename = (file) => config.output.assetModuleFilename({ filename: file });

    assert.equal(filename('./image.png'), '[name].[contenthash][ext]');
    assert.equal(filename('images/image.png'), 'images/[name].[contenthash][ext]');
    assert.equal(filename('../images/image.png'), 'images/[name].[contenthash][ext]');
    assert.equal(filename('../../images/image.png'), 'images/[name].[contenthash][ext]');
  });
});

describe('babel', () => {
  it('expands core-js entry imports to polyfills', async () => {
    const config = await createBuilder().add(babel()).build();
    const { transformAsync } = require('@babel/core');
    const { code } = await transformAsync('import \'core-js\';', {
      ...config.module.rules[0].use.options,
      filename: join(fixturePath, 'app.js'),
      configFile: false,
      babelrc: false,
      targets: 'ie 11',
    });

    assert.match(code, /core-js\/modules\//);
  });
});

describe('svgIconSprite', () => {
  it('allows a sprite in each config', async () => {
    const options = { outputFilename: 'icons.svg', globs: 'icons/*.svg' };

    await createBuilder().add(svgIconSprite(options)).build();
    await createBuilder().add(svgIconSprite(options)).build();
  });

  it('rejects a second sprite in the same config', async () => {
    const builder = createBuilder()
      .add(svgIconSprite({ outputFilename: 'a.svg', globs: 'icons/*.svg' }))
      .add(svgIconSprite({ outputFilename: 'b.svg', globs: 'icons/*.svg' }));

    await assert.rejects(builder.build(), /only one SvgIconSprite per config/);
  });
});

describe('compile', () => {
  it('builds the fixture with a manifest', async () => {
    const config = await createBuilder()
      .add(babel())
      .add(css())
      .add(bundle({ name: 'app', jsEntry: './app.js', cssEntry: './style.css' }))
      .add(manifest({ publicPath: 'https://cdn.example.com/assets/' }))
      .build();

    await compile(config);

    const files = JSON.parse(await readFile(join(outputPath, 'manifest.json'), 'utf8'));

    assert.deepEqual(Object.keys(files).toSorted((a, b) => a.localeCompare(b)), [
      'https://cdn.example.com/assets/app.css',
      'https://cdn.example.com/assets/app.js',
    ]);
  });
});
