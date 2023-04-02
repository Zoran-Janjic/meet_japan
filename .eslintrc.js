module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: "airbnb-base",
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    quotes: ["error", "double"],
    indent: ["error", 2],
    "no-console": "off",
    "comma-dangle": "off",
    "import/order": "off",
    "import/no-extraneous-dependencies": "off",
    "import/newline-after-import": "off",
    "arrow-body-style": "off",
  },
};
