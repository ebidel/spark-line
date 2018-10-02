import {terser} from 'rollup-plugin-terser';

export default [{
  input: './demo/main.js',
  output: {
    file: 'main.min.js',
    dir: './demo',
    format: 'es',
  },
  inlineDynamicImports: true,
  plugins: [
    terser()
  ]
}];
