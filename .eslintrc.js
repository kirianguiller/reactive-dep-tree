module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  ignorePatterns: ["temp.js", "**/snapsvg-cjs/**"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "prefer-spread": "off",
    "@typescript-eslint/interface-name-prefix": "off",

    // "@typescript-eslint/no-use-before-define": ["error"]
  },
};
