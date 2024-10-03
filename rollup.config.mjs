import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts',  // 번들링할 진입 파일 (TypeScript 파일)
  output: {
    file: 'dist/index.js',  // 번들링된 파일을 출력할 경로
    format: 'cjs',         // 번들링된 파일의 포맷 (ES Module)
  },
  plugins: [
    nodeResolve(),          // Node.js 모듈을 번들링하기 위해 사용
    typescript(),           // TypeScript를 컴파일하기 위한 플러그인
    commonjs(),
  ],
  external: [],             // 외부 모듈 (필요시 설정)
};
