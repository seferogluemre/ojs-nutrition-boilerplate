import tanstackQueryPlugin from "@tanstack/eslint-plugin-query";
import * as typescriptEstree from "@typescript-eslint/parser";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
  {
    ignores: ["**/src/components/ui"],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: typescriptEstree,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  {
    files: ["**/*.tsx", "**/*.jsx"],
    plugins: {
      "react-hooks": reactHooksPlugin,
      "react-refresh": reactRefreshPlugin,
      "@tanstack/query": tanstackQueryPlugin,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@tanstack/query/exhaustive-deps": "warn",
    },
    parserOptions: {
      project: "./tsconfig.json",
    },
  },
];
