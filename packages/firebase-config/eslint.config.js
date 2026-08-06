import { config } from '@workspace/eslint-config/base'

/** @type {import("eslint").Linter.Config} */
const esLintConfig = [
  ...config,
  { ignores: ['eslint.config.js', 'vitest.config.ts'] },
]

export default esLintConfig
