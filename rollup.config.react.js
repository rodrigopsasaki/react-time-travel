import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { dts } from 'rollup-plugin-dts';

const external = ['react', 'react-dom', '@time-travel/core'];

const plugins = [
  peerDepsExternal(),
  resolve({
    browser: true,
    preferBuiltins: false,
  }),
  commonjs(),
  typescript({
    tsconfig: './packages/react/tsconfig.json',
    declaration: true,
    declarationDir: './packages/react/dist/types',
    outDir: './packages/react/dist',
  }),
];

export default [
  // ESM build
  {
    input: 'packages/react/src/index.ts',
    output: {
      file: 'dist/react.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    external,
    plugins,
  },
  // CJS build
  {
    input: 'packages/react/src/index.ts',
    output: {
      file: 'dist/react.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    external,
    plugins,
  },
  // Type definitions
  {
    input: 'packages/react/src/index.ts',
    output: {
      file: 'dist/react.d.ts',
      format: 'esm',
    },
    external,
    plugins: [dts()],
  },
];