# @stencil/stylus

This package is used to easily precompile Stylus files within the Stencil components.

First, npm install within the project:

```bash
npm install @stencil/stylus --save-dev
```

Next, within the project's `stencil.config.js` file, import the plugin and add it to the config's `plugins` config:

#### stencil.config.ts
```ts
import { Config } from '@stencil/core';
import { stylus } from '@stencil/stylus';

export const config: Config = {
  plugins: [
    stylus()
  ]
};
```

During development, this plugin will kick-in for `.styl` and `.stylus` style urls, and precompile them to CSS.

## Options

### Include Paths

The `includePaths` config is an array of paths that are used to resolve imports. By default, the plugin adds the project root dir and the current dir of the file to this array. The files should be relative to the root folder.

```js
exports.config = {
  plugins: [
    stylus({
      includePaths: [
        'src/globals'
      ]
    })
  ]
};
```

### Inject Globals Stylus Paths

The `injectGlobalPaths` config is an array of paths that automatically get added as `@import` declarations to all components. This can be useful to inject Stylus variables, mixins and functions to override defaults of external collections. Relative paths within `injectGlobalPaths` should be relative to the `stencil.config.js` file.

```js
exports.config = {
  plugins: [
    stylus({
      injectGlobalPaths: [
        'src/globals/variables.styl',
        'src/globals/mixins.styl'
      ]
    })
  ]
};
```

Note that each of these files are always added to each component, so in most cases they shouldn't contain CSS because it'll get duplicated in each component. Instead, `injectGlobalPaths` should only be used for Stylus variables, mixins and functions, but not contain any CSS.

### Plugins

The `plugins` config is an array of Stylus plugins.

```js
const axis = require('axis');
const nib = require('nib');

exports.config = {
  plugins: [
    stylus({
      plugins: [
        axis(),
        nib()
      ]
    })
  ]
};
```

## Related

* [Stylus](https://www.npmjs.com/package/stylus)
* [axis](https://www.npmjs.com/package/axis)
* [nib](https://www.npmjs.com/package/nib)
* [Stencil](https://stenciljs.com/)
* [Stencil Worldwide Slack](https://stencil-worldwide.slack.com)
* [Ionic Components](https://www.npmjs.com/package/@ionic/core)
* [Ionicons](http://ionicons.com/)

## Contributing

Please see our [Contributor Code of Conduct](https://github.com/ionic-team/ionic/blob/master/CODE_OF_CONDUCT.md) for information on our rules of conduct.
