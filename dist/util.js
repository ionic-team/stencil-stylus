import * as path from 'path';
export function usePlugin(fileName) {
    return /(\.styl|\.stylus)$/i.test(fileName);
}
export function getRenderOptions(opts, fileName, context) {
    let includePaths = Array.isArray(opts.includePaths) ? opts.includePaths.slice() : [];
    // add the directory of the source file to includePaths
    includePaths.unshift(path.dirname(fileName));
    // add the root directory to includePaths
    includePaths.unshift(context.config.rootDir);
    includePaths = includePaths.map(includePath => {
        if (path.isAbsolute(includePath)) {
            return includePath;
        }
        // if it's a relative path then resolve it with the project's root directory
        return path.resolve(context.config.rootDir, includePath);
    });
    const injectGlobalPaths = Array.isArray(opts.injectGlobalPaths) ? opts.injectGlobalPaths.slice() : [];
    const plugins = opts.plugins || [];
    return {
        includePaths,
        injectGlobalPaths,
        plugins
    };
}
export function createResultsId(fileName) {
    // create what the new path is post transform (.css)
    const pathParts = fileName.split('.');
    pathParts[pathParts.length - 1] = 'css';
    return pathParts.join('.');
}
