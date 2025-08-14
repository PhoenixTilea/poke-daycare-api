// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

const customConfig = defineConfig({
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_"
    }]
  }
});

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  customConfig
);
