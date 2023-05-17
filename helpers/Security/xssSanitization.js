// ? Clean user data from malicious code
const xss = require("xss-clean");

const sanitizeHTMLCode = () => {
  // ? XSS Cross site scripting
  return xss();
};

module.exports = sanitizeHTMLCode;
