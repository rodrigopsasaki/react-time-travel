import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

const external = [];

const plugins = [
  resolve({
    browser: true,
    preferBuiltins: false,
  }),
  commonjs(),
  typescript({
    tsconfig: './packages/core/tsconfig.json',
    declaration: true,
    declarationDir: './packages/core/dist/types',
    outDir: './packages/core/dist',
  }),
];

export default [
  // ESM build
  {
    input: 'packages/core/src/index.ts',
    output: {
      file: 'dist/core.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    external,
    plugins,
  },
  // CJS build
  {
    input: 'packages/core/src/index.ts',
    output: {
      file: 'dist/core.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    external,
    plugins,
  },
  // Type definitions
  {
    input: 'packages/core/src/index.ts',
    output: {
      file: 'dist/core.d.ts',
      format: 'esm',
    },
    external,
    plugins: [dts()],
  },
];