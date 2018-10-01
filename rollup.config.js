import {terser} from 'rollup-plugin-terser';

export default [{
  input: './sparkline-element.js',
  output: {
    file: 'sparkline-element.min.js',
    dir: './demo',
    format: 'es',
  },
  inlineDynamicImports: true,
  plugins: [
    terser()
  ]
}, {
  input: './demo/gauge-element.js',
  output: {
    file: 'gauge-element.min.js',
    dir: './demo',
    format: 'es'
  },
  inlineDynamicImports: true,
  plugins: [
    terser()
  ]
}];
