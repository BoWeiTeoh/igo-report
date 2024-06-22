module.exports = {
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    // Additional, per-project rules...
    "no-console": "off",
    "max-len": [
      "error",
      {
        code: 120,
        ignoreComments: true,
        ignoreTemplateLiterals: true,
        tabWidth: 4
      }
    ],
    "no-var": "error",
    "prefer-const": "warn",
    "no-unused-vars": "warn",
    "no-unused-labels": "warn",
    "quote-props": "off",
    "comma-dangle": "off",
    "no-trailing-spaces": "off",
    "new-cap": "off",
    "linebreak-style": 0,
    quotes: ["error", "double"]
  },
  env: {
    amd: true,
    commonjs: true,
    es6: true,
    node: true,
    mocha: true
  }
};
