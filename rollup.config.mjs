import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import { dts } from 'rollup-plugin-dts';

// For GitHub Actions, we only externalize Node.js built-in modules
const external = [
  'fs',
  'path',
  'crypto',
  'http',
  'https',
  'url',
  'util',
  'events',
  'stream',
  'buffer',
  'querystring',
  'os',
  'child_process',
  'net',
  'tls',
  'zlib',
  'readline',
  'dns',
  'cluster',
  'worker_threads'
];

export default [
  // CommonJS build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    external,
    plugins: [
      resolve({
        preferBuiltins: true,
        exportConditions: ['node'],
        browser: false,
        resolveOnly: (module) => {
          // Bundle all npm packages, only externalize Node.js built-ins
          return !external.includes(module);
        }
      }),
      commonjs({
        ignoreDynamicRequires: true
      }),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false
      })
    ]
  },
  // ESM build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    external,
    plugins: [
      resolve({
        preferBuiltins: true,
        exportConditions: ['node'],
        browser: false,
        resolveOnly: (module) => {
          // Bundle all npm packages, only externalize Node.js built-ins
          return !external.includes(module);
        }
      }),
      commonjs({
        ignoreDynamicRequires: true
      }),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false
      })
    ]
  },
  // Type definitions
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'esm'
    },
    external,
    plugins: [
      dts()
    ]
  }
];
