import pkg from './package.json';


export default {
  input: 'dist/index.js',

  external: [
    'os',
    'path',
    'stylus'
  ],

  output: [{
      format: 'cjs',
      file: pkg.main
    },
    {
      format: 'es',
      file: pkg.module
    }
  ]
};
