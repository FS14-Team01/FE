import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = defineConfig([
  ...nextVitals,
  
  {
    rules: { // 추가로 사용하는 팀 규칙
      'no-unused-vars': 'warn', // 선언 뒤 사용하지 않은 변수는 경고 
    },
  },

  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
