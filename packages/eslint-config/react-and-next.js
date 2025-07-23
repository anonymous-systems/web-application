import pluginReactHooks from "eslint-plugin-react-hooks"

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const reactAndNextJsConfig = [
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      // 'no-undef': 'error',
      'linebreak-style': 0,
      'object-curly-spacing': [ 'error', 'always' ],
      quotes: [ 'error', 'single' ],
      indent: [ 'error', 2, { 'SwitchCase': 1, 'ignoredNodes': ['JSXElement', 'JSXElement *', 'JSXAttribute'] } ],
      semi: [ 'error', 'never' ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: { attributes: false }
        }
      ],
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/explicit-function-return-type': 'error',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
      'react/jsx-indent': ['error', 2, { checkAttributes: true, indentLogicalExpressions: true }],
      'react/jsx-indent-props': ['error', 2],
    },
  },
]