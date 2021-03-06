module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module",
  },
  env: {
    browser: true,
    node: true,
  },
  extends: ["airbnb-base", "prettier", "plugin:vue/base"],
  globals: {
    __static: true,
  },
  plugins: ["html", "prettier"],
  rules: {
    "global-require": 0,
    "import/no-unresolved": 0,
    "no-param-reassign": 0,
    "no-shadow": 0,
    "no-underscore-dangle": [
      "error",
      {
        allow: ["__static"],
      },
    ],
    "import/extensions": 0,
    "import/newline-after-import": 0,
    "import/no-extraneous-dependencies": 0,
    "no-multi-assign": 0,
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
  },
};
