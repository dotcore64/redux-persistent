import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const input = 'src/index.js';
const plugins = [babel({ babelHelpers: 'bundled' })];

const name = 'ReduxPersistent';

export default [{
  input,
  output: {
    file: 'dist/index.cjs',
    format: 'cjs',
    sourcemap: true,
    exports: 'named',
  },
  plugins,
}, {
  input,
  output: {
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins,
}, {
  input,
  output: {
    file: 'dist/index.umd.js',
    format: 'umd',
    name,
    exports: 'named',
  },
  plugins: [
    ...plugins,
    terser(),
  ],
}];
