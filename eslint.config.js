// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const google = require("eslint-config-google");

/**
 * Modifies the Google ESLint rules configuration for v9 compatibility.
 *
 * This function removes specific rules ('valid-jsdoc' and 'require-jsdoc')
 * that have been removed or deprecated in ESLint v9. By doing so, it ensures
 * that your project's ESLint configuration remains compatible with the latest
 * version and avoids potential errors.
 *
 * @returns {Record<string, unknown>} A modified version of the Google ESLint
 *                                   rules with the incompatible rules removed.
 */
function getGoogleRulesForV9() {
    const rules = {...google.rules};

    // @ts-ignore
    delete rules['valid-jsdoc'];

    // @ts-ignore
    delete rules['require-jsdoc'];

    return rules;
}

module.exports = tseslint.config(
    {
        files: ["**/*.ts"],
        ignores: ['*/CustomEditorSuperBuild/*'],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...tseslint.configs.stylistic,
            ...angular.configs.tsAll,
        ],
        processor: angular.processInlineTemplates,
        rules: {
            ...getGoogleRulesForV9(),
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
            "new-cap": 0,
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
