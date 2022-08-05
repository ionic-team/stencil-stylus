export * from '@stencil/core/internal';

export type PluginOptions = Partial<RenderOpts>;

export interface RenderOpts {
  includePaths: string[];
  injectGlobalPaths: string[];
  plugins: ((stylus: any) => void)[];
}
