import js from "@eslint/js";
import node from "eslint-plugin-n";
import mocha from "eslint-plugin-mocha";
import imprt from "eslint-plugin-import";
import unicorn from "eslint-plugin-unicorn";
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import globals from "globals";

const testFiles = ["test/{,**/}*.js"];

export default [
  js.configs.recommended,
  node.configs["flat/recommended-script"],
  comments.recommended,
  unicorn.configs.recommended,
  imprt.flatConfigs.recommended,
  {
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "unicorn/prevent-abbreviations": 0,
      "unicorn/no-array-for-each": 0,
      "unicorn/import-style": 0,
      "unicorn/no-anonymous-default-export": 0,
      "unicorn/no-null": 0,
      "n/no-unsupported-features/node-builtins": [
        "error",
        { "ignores": ["localStorage"] }
      ],
      "@eslint-community/eslint-comments/no-unused-disable": "error"
    },
  },
  {
    ...mocha.configs.recommended,
    files: testFiles,
  },
  {
    files: testFiles,
    rules: {
      "mocha/no-mocha-arrows": "off",
    },
  },
  {
    ignores: ["coverage/", "node_modules/"],
  },
];
