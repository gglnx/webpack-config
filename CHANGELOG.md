# Changelog

## 1.0.0

- Upgrade all dependencies
- Clean up removed Babel config entries
- Corejs version gets tracked directly from the package
- Restore core-js polyfills via `babel-plugin-polyfill-corejs3` (new peer dependency), as Babel 8 removed `useBuiltIns`
- Fix ESM build failing to load on Node.js 22+
- Drop the CommonJS build (the package is ESM-only now)
- Fix `main` entry in `package.json`
- Require Node.js 22 or newer
- Fix invalid `exclude` placement in the `typescript` transformer and add `ts-loader` as peer dependency
- Allow one `svgIconSprite` per config instead of one per process
- Keep assets from outside the source path inside the output path
- Fix manifest keys for URL public paths and file names containing hex segments
- Add smoke tests
- Make the Babel peer dependencies (`@babel/core`, `@babel/preset-env`, `@babel/preset-typescript`, `babel-loader`, `babel-plugin-polyfill-corejs3`, `core-js`) and the SCSS peer dependencies (`sass`, `sass-loader`, `resolve-url-loader`) optional; install them when using the `babel` or `scss` transformer
- Move `cosmiconfig` from peer dependencies to dependencies and allow version 9
- Watch polling is now opt-in via the `watchPoll` builder option (was always 500 ms)
- Exclude core-js from Babel compilation
- Mark transformer options with defaults as optional
- Use forward slashes in chunk filenames on Windows
- Publish to npm before creating the GitHub release

## 1.0.0-beta.1

- Upgrade to Babel 8
- Add support for TypeScript 6
- Remove `arrify` as dependency
