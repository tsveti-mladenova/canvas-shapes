import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import css from 'rollup-plugin-import-css'
import copy from 'rollup-plugin-copy'

export default {
  input: 'src/index.js',
  output: [{ file: 'dist/bundle.js', format: 'iife' }],
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    css(),
    copy({
      targets: [
        { src: 'src/assets', dest: 'dist' }
      ]
    })
  ],
}
