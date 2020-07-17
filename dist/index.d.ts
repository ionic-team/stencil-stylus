import * as d from './declarations';
export declare function stylus(opts?: d.PluginOptions): {
    name: string;
    transform(sourceText: string, fileName: string, context: d.PluginCtx): Promise<d.PluginTransformResults>;
};
