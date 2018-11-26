export declare type PluginOptions = Partial<RenderOpts>;
export interface PluginTransformResults {
    code?: string;
    id?: string;
}
export interface PluginCtx {
    config: {
        rootDir?: string;
        srcDir?: string;
        devMode?: boolean;
    };
    fs: any;
    diagnostics: Diagnostic[];
}
export interface Diagnostic {
    level: 'error' | 'warn' | 'info' | 'log' | 'debug';
    type: 'typescript' | 'bundling' | 'build' | 'runtime' | 'hydrate' | 'css';
    header?: string;
    language?: string;
    messageText: string;
    code?: string;
    absFilePath?: string;
    relFilePath?: string;
    lineNumber?: number;
    columnNumber?: number;
    lines?: PrintLine[];
}
export interface PrintLine {
    lineIndex: number;
    lineNumber: number;
    text?: string;
    errorCharStart: number;
    errorLength?: number;
}
export interface RenderOpts {
    includePaths: string[];
    injectGlobalPaths: string[];
    plugins: ((stylus: any) => void)[];
}
