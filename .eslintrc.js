module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    // react
    'plugin:react/recommended',
    // airbnb + airbnb 推荐的 ts 规范
    'airbnb',
    'airbnb-typescript',
    // 解决 eslint 和 prettier 的冲突 , 此项配置必须在最后
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    // 开启 hooks 规则
    'react-hooks/rules-of-hooks': 'error',
    // 打开 检查 effect 依赖 ，默认关闭
    'react-hooks/exhaustive-deps': 'warn',
    // 覆盖 eslint-config-airbnb 和 react 里的配置
    //  允许 在ts、tsx 中书写 jsx
    'react/jsx-filename-extension': [
      2,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    // 修改 对于 函数式组件 声明方式(箭头函数 or 函数声明)的 校验
    'react/function-component-definition': [
      'error',
      {
        namedComponents: ['arrow-function', 'function-declaration'],
        unnamedComponents: ['arrow-function'],
      },
    ],
    // 关闭 对文件扩展名的 校验
    'import/extensions': 'off',
    // 关闭对于 组件可选prop 的默认值必须 检测
    'react/require-default-props': 'off',
  },
}
