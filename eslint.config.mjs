import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn", // Change to warning
      "@typescript-eslint/no-explicit-any": "warn", // Change to warning
      "@typescript-eslint/no-require-imports": "warn", // Change to warning
      "react-hooks/exhaustive-deps": "warn", // Change to warning
      "react/jsx-no-comment-textnodes": "warn", // Change to warning
    }
  }
];

export default eslintConfig;