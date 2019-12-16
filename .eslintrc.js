module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'airbnb-base',
    'plugin:vue/recommended'
  ],
  rules: {
    // override/add rules settings here, such as:
    'no-new': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
  }
}