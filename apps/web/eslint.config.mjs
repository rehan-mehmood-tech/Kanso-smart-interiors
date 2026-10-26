import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Stitch reference screens are preserved as generated visual fixtures.
    // They intentionally use raw <img> tags because their source HTML has no
    // intrinsic dimensions; application routes use next/image.
    files: ["app/(preview)/**/*.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
      "jsx-a11y/alt-text": "off",
    },
  },
  {
    // Build-time Node scripts, not app code: CommonJS is correct there.
    files: ["scripts/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);

export default eslintConfig;
