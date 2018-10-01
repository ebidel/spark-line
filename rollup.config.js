import {terser} from 'rollup-plugin-terser';

export default {
  input: './sparkline-element.js',
  output: {
    file: 'sparkline-element.min.js',
    format: 'es'
  },
  inlineDynamicImports: true,
  plugins: [
    terser()
  ]
};