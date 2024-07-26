// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
    {
      files: ["**/*.ts"],
      extends: [
        eslint.configs.recommended,
        ...tseslint.configs.recommended,
        ...tseslint.configs.stylistic,
        ...angular.configs.tsAll,
      ],
      processor: angular.processInlineTemplates,
      rules: {
        "@angular-eslint/directive-selector": [
          "error",
          {
            type: "attribute",
            prefix: "anon",
            style: "camelCase",
          },
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            type: "element",
            prefix: "anon",
            style: "kebab-case",
          },
        ],
      },
    },
    {
      files: ["**/*.html"],
      extends: [
        ...angular.configs.templateAll,
      ],
      rules: {
        "@angular-eslint/template/no-call-expression": "off",
        "@angular-eslint/template/i18n": "off",
      },
    }
);
