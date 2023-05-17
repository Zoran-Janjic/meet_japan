// helmetWrapper.js
const helmet = require("helmet");

function configuredHelmet() {
  // Configure Helmet with desired security headers
  return helmet();
}

module.exports = configuredHelmet;
