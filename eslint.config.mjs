import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/**
 * Flat config.
 *
 * Next 16 removed `next lint`, so linting runs through the eslint CLI directly
 * (see the `lint` script in package.json).
 *
 * eslint-config-next@16 ships native flat configs from its subpath exports, so
 * these are spread in directly. The `FlatCompat` bridge that older Next
 * projects use throws a circular-structure error against this version — it is
 * for wrapping legacy eslintrc configs, and these are not legacy.
 */
const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
