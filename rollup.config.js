import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const input = 'src/index.js';
const plugins = [babel({ babelHelpers: 'bundled' })];

const name = 'ReduxPersistent';

export default [{
  input,
  output: {
    file: `dist/${pkg.name}.cjs.js`,
    format: 'cjs',
    sourcemap: true,
    exports: 'named',
  },
  plugins,
}, {
  input,
  output: {
    file: `dist/${pkg.name}.esm.js`,
    format: 'esm',
    sourcemap: true,
  },
  plugins,
}, {
  input,
  output: {
    file: `dist/${pkg.name}.umd.js`,
    format: 'umd',
    name,
    exports: 'named',
  },
  plugins: [
    ...plugins,
    terser(),
  ],
}];
