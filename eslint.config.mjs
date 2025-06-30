import js from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import nextPlugin from '@next/eslint-plugin-next'
import tsEslint from 'typescript-eslint'

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    settings: { react: { version: 'detect' } },
  },
  js.configs.recommended,
  pluginReact.configs.flat.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  pluginReact.configs.flat['jsx-runtime'],
  pluginReactHooks.configs["recommended-latest"],
  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules
    }
  },
  {
    rules: {
      'linebreak-style': 0,
      'object-curly-spacing': [ 'error', 'always' ],
      quotes: [ 'error', 'single' ],
      indent: [ 'error', 2 ],
      semi: [ 'error', 'never' ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: { attributes: false }
        }
      ],
      '@typescript-eslint/no-extraneous-class': 'off',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
      'react/jsx-indent': ['error', 2, { checkAttributes: true, indentLogicalExpressions: true }],
    }
  },
]
