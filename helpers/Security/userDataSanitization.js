// ? Clean user data from malicious code
const mongoSanitize = require("express-mongo-sanitize");

const sanitizeUserData = () => {
  // ? NoSql query sanitization
  return mongoSanitize();
};

module.exports = sanitizeUserData;
