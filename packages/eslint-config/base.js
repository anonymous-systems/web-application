import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import onlyWarn from 'eslint-plugin-only-warn'
import tseslint from 'typescript-eslint'
import nxPlugin from '@nx/eslint-plugin'

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: { '@nx': nxPlugin },
    rules: { '@nx/enforce-module-boundaries': 'warn' },
  },
  { plugins: { onlyWarn, } },
  { ignores: ['dist/**'] },
]
