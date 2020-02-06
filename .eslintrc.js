module.exports = {
  "env": {
    "es6": true,
    "node": true,
  },
  "extends": [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
  },
  "rules": {
    "no-return-assign": "off",
    "no-throw-literal": "off",
    "quotes": ["error", "single"],
    "no-underscore-dangle": "off",
    "curly": ["error", "multi-or-nest"],
    "max-len": ["error", { "code": 120 }],
    "prefer-promise-reject-errors": "off",
    "nonblock-statement-body-position": "off",
    "@typescript-eslint/semi": ["error", "never"],
    "@typescript-eslint/interface-name-prefix": "off",
    "padded-blocks": ["error", { "classes": "always" }],
    "no-console": ["error", { allow: ["info", "warn", "error"] }],
    "arrow-parens": ["error", "as-needed", { "requireForBlockBody": true }],
    "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
  },
};
