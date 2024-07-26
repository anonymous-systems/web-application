// @ts-check
const tsEslint = require("typescript-eslint");
const rootConfig = require("../../eslint.config.js");

module.exports = tsEslint.config(
  ...rootConfig,
  {
    files: ["**/*.ts"],
    rules: {
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "anon-shared",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    rules: {},
  }
);
