// @ts-check
const tsEslint = require("typescript-eslint");
const workspaceEslint = require("../../eslint.config");

module.exports = tsEslint.config(
    ...workspaceEslint,
);
