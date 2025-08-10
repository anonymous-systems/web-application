import { config } from "@workspace/eslint-config/react-internal"

/** @type {import("eslint").Linter.Config} */
const esLintConfig =  [
  ...config,
  { ignores: ["eslint.config.js", "postcss.config.mjs"] }
]

export default esLintConfig
