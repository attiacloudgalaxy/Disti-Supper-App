module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:security/recommended-legacy',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: '18.2',
    },
  },
  plugins: ['react-refresh', 'security'],
  rules: {
    // React Refresh
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    // React specific
    'react/prop-types': 'off', // Disable prop-types as we're not using TypeScript
    'react/react-in-jsx-scope': 'off', // Not needed in React 18+

    // General JavaScript
    // `React` is ignored because the automatic JSX runtime makes the import optional;
    // unused args are ignored because handler signatures are dictated by the caller.
    'no-unused-vars': ['warn', { args: 'none', varsIgnorePattern: '^_|^React$', ignoreRestSiblings: true }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'warn',
    'no-var': 'error',

    // Security rules
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'warn',
    'security/detect-possible-timing-attacks': 'warn',
  },
  ignorePatterns: [
    'dist',
    'build',
    'node_modules',
    '.eslintrc.js',
    'vite.config.mjs',
    'tailwind.config.js',
    'postcss.config.js',
    '**/*.test.js',
    '**/*.test.jsx',
    '**/*.spec.js',
    '**/*.spec.jsx',
  ],
};
