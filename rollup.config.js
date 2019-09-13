import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const input = 'src/index.js';
const plugins = [babel()];

const name = 'ReduxPersistent';

export default [{
  input,
  output: { file: `dist/${pkg.name}.cjs.js`, format: 'cjs', exports: 'named' },
  plugins,
}, {
  input,
  output: { file: `dist/${pkg.name}.esm.js`, format: 'esm' },
  plugins,
}, {
  input,
  output: {
    file: `dist/${pkg.name}.umd.js`, format: 'umd', name, exports: 'named',
  },
  plugins: [
    ...plugins,
    terser(),
  ],
}];
