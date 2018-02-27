import * as d from '../src/declarations';
import * as util from '../src/util';


describe('getRenderOptions', () => {

  const sourceText = 'body { color: blue; }';
  const fileName = '/some/path/file-name.stylus';
  const context: d.PluginCtx = {
    config: {
      rootDir: '/Users/my/app/',
      srcDir: '/Users/my/app/src/',
      devMode: true
    },
    fs: {},
    diagnostics: []
  };


  it('should pass the plugins array and not change the input options', () => {
    const dummyPlugin: any = () => undefined;
    const input: d.PluginOptions = {
      plugins: [dummyPlugin]
    };
    const output = util.getRenderOptions(input, fileName, context);
    expect(output.plugins).toBe(input.plugins);
    expect(input.plugins[0]).toBe(dummyPlugin);
  });

  it('should pass the global paths array and not change the input options', () => {
    const input: d.PluginOptions = {
      injectGlobalPaths: ['/some/other/include/path']
    };
    const output = util.getRenderOptions(input, fileName, context);
    expect(output.injectGlobalPaths).toHaveLength(1);
    expect(output.injectGlobalPaths[0]).toBe(input.injectGlobalPaths[0]);
    expect(input.injectGlobalPaths).toHaveLength(1);
    expect(input.injectGlobalPaths[0]).toBe('/some/other/include/path');
  });

  it('should add root dir and dirname of filename to existing includePaths array and not change input options', () => {
    const input: d.PluginOptions = {
      includePaths: ['/some/other/include/path']
    };
    const output = util.getRenderOptions(input, fileName, context);
    expect(output.includePaths).toHaveLength(3);
    expect(output.includePaths[0]).toBe('/Users/my/app/');
    expect(output.includePaths[1]).toBe('/some/path');
    expect(output.includePaths[2]).toBe('/some/other/include/path');
    expect(input.includePaths).toHaveLength(1);
    expect(input.includePaths[0]).toBe('/some/other/include/path');
  });

});


describe('usePlugin', () => {

  it('should use the plugin for .stylus file', () => {
    const fileName = 'my-file.stylus';
    expect(util.usePlugin(fileName)).toBe(true);
  });

  it('should use the plugin for .styl file', () => {
    const fileName = 'my-file.styl';
    expect(util.usePlugin(fileName)).toBe(true);
  });

  it('should not use the plugin for .css file', () => {
    const fileName = 'my-file.css';
    expect(util.usePlugin(fileName)).toBe(false);
  });

});

describe('createResultsId', () => {

  it('should change stylus the extension to be css', () => {
    const input = '/my/path/my-file.stylus';
    const output = util.createResultsId(input);
    expect(output).toBe('/my/path/my-file.css');
  });

  it('should change styl the extension to be css', () => {
    const input = '/my/path.DIR/my-file.whatever.SOME.dots.STYL';
    const output = util.createResultsId(input);
    expect(output).toBe('/my/path.DIR/my-file.whatever.SOME.dots.css');
  });

});
