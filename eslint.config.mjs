import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/* eslint-config-next ships flat config in v16, so FlatCompat is not needed. */
export default [
  ...coreWebVitals,
  ...typescript,
  { ignores: [".next/**", "node_modules/**", ".screenshots/**"] },
];
