import * as d from '../src/declarations';
import * as util from '../src/util';


describe('getRenderOptions', () => {

  const sourceText = 'body { color: blue; }';
  const fileName = '/some/path/file-name.scss';
  const context: d.PluginCtx = {
    config: {
      rootDir: '/Users/my/app/',
      srcDir: '/Users/my/app/src/',
    },
    fs: {} as any,
    diagnostics: []
  } as any;


  it('should remove "file" config', () => {
    const input: d.PluginOptions = {
      file: '/my/global/variables.scss'
    };
    const output = util.getRenderOptions(input, sourceText, fileName, context);
    expect(output.data).toBe(`body { color: blue; }`);
    expect(output.file).toBeUndefined();
  });

  it('should inject global styl array and not change input options or include globals in output opts', () => {
    const input: d.PluginOptions = {
      injectGlobalPaths: ['/my/global/variables.scss']
    };
    const output = util.getRenderOptions(input, sourceText, fileName, context);
    expect(output.data).toBe(`@import "/my/global/variables.scss";body { color: blue; }`);
    expect(output.injectGlobalPaths).toBeUndefined();
    expect(input.injectGlobalPaths).toHaveLength(1);
  });

  it('should add dirname of filename to existing includePaths array and not change input options', () => {
    const input: d.PluginOptions = {
      includePaths: ['/some/other/include/path']
    };
    const output = util.getRenderOptions(input, sourceText, fileName, context);
    expect(output.includePaths).toHaveLength(2);
    expect(output.includePaths[0]).toBe('/some/other/include/path');
    expect(output.includePaths[1]).toBe('/some/path');
    expect(input.includePaths).toHaveLength(1);
    expect(input.includePaths[0]).toBe('/some/other/include/path');
  });

  it('should add dirname of filename to includePaths and not change input options', () => {
    const input: d.PluginOptions = {};
    const output = util.getRenderOptions(input, sourceText, fileName, context);
    expect(output.includePaths).toHaveLength(1);
    expect(output.includePaths[0]).toBe('/some/path');
    expect(input.includePaths).toBeUndefined();
  });

  it('should set data', () => {
    const input: d.PluginOptions = {};
    const output = util.getRenderOptions(input, sourceText, fileName, context);
    expect(output.data).toBe(sourceText);
  });

});


describe('usePlugin', () => {

  it('should use the plugin for .styl file', () => {
    const fileName = 'my-file.styl';
    expect(util.usePlugin(fileName)).toBe(true);
  });


  it('should not use the plugin for .css file', () => {
    const fileName = 'my-file.css';
    expect(util.usePlugin(fileName)).toBe(false);
  });

});
