import os from 'os';
import { dirname, isAbsolute, resolve } from 'path';
import stylusCompiler from 'stylus';

function loadDiagnostic(context, stylusError, filePath) {
    if (!stylusError || !context) {
        return;
    }
    // Split the message
    const messageLines = stylusError.message.split(os.EOL);
    const messageTextIndex = messageLines.length - 2;
    const diagnostic = {
        level: 'error',
        type: 'css',
        language: 'stylus',
        header: 'stylus error',
        code: stylusError.status && stylusError.status.toString(),
        relFilePath: null,
        absFilePath: null,
        messageText: messageLines[messageTextIndex],
        lines: []
    };
    if (filePath) {
        diagnostic.absFilePath = filePath;
        diagnostic.relFilePath = formatFileName(context.config.rootDir, diagnostic.absFilePath);
        diagnostic.header = formatHeader('stylus', diagnostic.absFilePath, context.config.rootDir, stylusError.line);
        // Skip the first line as it represents the filepath and Stencil already prints it
        for (let i = 1, len = messageTextIndex; i < len; i++) {
            diagnostic.lines.push({
                lineIndex: i,
                lineNumber: i,
                text: messageLines[i],
                errorCharStart: -1,
                errorLength: -1
            });
        }
    }
    context.diagnostics.push(diagnostic);
}
function formatFileName(rootDir, fileName) {
    if (!rootDir || !fileName)
        return '';
    fileName = fileName.replace(rootDir, '');
    if (/\/|\\/.test(fileName.charAt(0))) {
        fileName = fileName.substr(1);
    }
    if (fileName.length > 80) {
        fileName = '...' + fileName.substr(fileName.length - 80);
    }
    return fileName;
}
function formatHeader(type, fileName, rootDir, startLineNumber = null, endLineNumber = null) {
    let header = `${type}: ${formatFileName(rootDir, fileName)}`;
    if (startLineNumber !== null && startLineNumber > 0) {
        if (endLineNumber !== null && endLineNumber > startLineNumber) {
            header += `, lines: ${startLineNumber} - ${endLineNumber}`;
        }
        else {
            header += `, line: ${startLineNumber}`;
        }
    }
    return header;
}

function usePlugin(fileName) {
    return /(\.styl|\.stylus)$/i.test(fileName);
}
function getRenderOptions(opts, fileName, context) {
    let includePaths = Array.isArray(opts.includePaths) ? opts.includePaths.slice() : [];
    // add the directory of the source file to includePaths
    includePaths.unshift(dirname(fileName));
    // add the root directory to includePaths
    includePaths.unshift(context.config.rootDir);
    includePaths = includePaths.map(includePath => {
        if (isAbsolute(includePath)) {
            return includePath;
        }
        // if it's a relative path then resolve it with the project's root directory
        return resolve(context.config.rootDir, includePath);
    });
    const injectGlobalPaths = Array.isArray(opts.injectGlobalPaths) ? opts.injectGlobalPaths.slice() : [];
    const plugins = opts.plugins || [];
    return {
        includePaths,
        injectGlobalPaths,
        plugins
    };
}
function createResultsId(fileName) {
    // create what the new path is post transform (.css)
    const pathParts = fileName.split('.');
    pathParts[pathParts.length - 1] = 'css';
    return pathParts.join('.');
}

function stylus(opts = {}) {
    return {
        name: 'stylus',
        transform(sourceText, fileName, context) {
            if (!context || !usePlugin(fileName)) {
                return null;
            }
            const renderOpts = getRenderOptions(opts, fileName, context);
            const results = {
                id: createResultsId(fileName)
            };
            if (sourceText.trim() === '') {
                results.code = '';
                return Promise.resolve(results);
            }
            return new Promise(resolve$$1 => {
                const styl = stylusCompiler(sourceText);
                styl.set('filename', fileName);
                styl.set('dest', fileName.replace('.styl', '.css'));
                styl.set('compress', !context.config.devMode);
                styl.set('paths', renderOpts.includePaths);
                renderOpts.injectGlobalPaths.forEach(injectGlobalPath => styl.import(injectGlobalPath));
                renderOpts.plugins.forEach(plugins => styl.use(plugins));
                styl.render((err, stylusResult) => {
                    if (err) {
                        loadDiagnostic(context, err, fileName);
                        results.code = `/**  stylus error${err && err.message ? ': ' + err.message : ''}  **/`;
                        resolve$$1(results);
                    }
                    else {
                        results.code = stylusResult.toString();
                        // write this css content to memory only so it can be referenced
                        // later by other plugins (autoprefixer)
                        // but no need to actually write to disk
                        context.fs.writeFile(results.id, results.code, { inMemoryOnly: true }).then(() => {
                            resolve$$1(results);
                        });
                    }
                });
            });
        }
    };
}

export { stylus };
