const handleDuplicateKeyError = require("./handleDuplicateKeyError");
const handleMongooseValidationError = require("./HandleMongooseValidationError");
const handleMongooseCastError = require("./handleMongooseCastError");
// const handleJsonWebTokenError = require("./handleJsonWebTokenError");

module.exports = {
  handleMongooseValidationError,
  handleDuplicateKeyError,
  handleMongooseCastError,
};
