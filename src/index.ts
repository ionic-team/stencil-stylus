import stylusCompiler from 'stylus';
import { loadDiagnostic } from './diagnostics';
import * as d from './declarations';
import * as util from './util';


export function stylus(opts: d.PluginOptions = {}): d.Plugin {

  return {
    name: 'stylus',
    pluginType: 'css',
    transform(sourceText: string, fileName: string, context: d.PluginCtx) {
      if (!context || !util.usePlugin(fileName)) {
        return null;
      }

      const renderOpts = util.getRenderOptions(opts, fileName, context);

      const results: d.PluginTransformResults = {
        id: util.createResultsId(fileName)
      };

      if (sourceText.trim() === '') {
        results.code = '';
        return Promise.resolve(results);
      }

      return new Promise<d.PluginTransformResults>(resolve => {

        const styl = stylusCompiler(sourceText);

        styl.set('filename', fileName);
        styl.set('dest', fileName.replace('.styl', '.css'));
        styl.set('compress', !context.config.devMode);
        styl.set('paths', renderOpts.includePaths);

        renderOpts.injectGlobalPaths.forEach(injectGlobalPath => styl.import(injectGlobalPath));

        renderOpts.plugins.forEach(plugins => styl.use(plugins));

        styl.render((err: any, stylusResult: string) => {
          if (err) {
            loadDiagnostic(context, err, fileName);
            results.code = `/**  stylus error${err && err.message ? ': ' + err.message : ''}  **/`;
            resolve(results);

          } else {
            results.code = stylusResult.toString();

            // write this css content to memory only so it can be referenced
            // later by other plugins (autoprefixer)
            // but no need to actually write to disk
            context.fs.writeFile(results.id, results.code, { inMemoryOnly: true }).then(() => {
              resolve(results);
            });
          }
        });
      });
    }
  };
}
