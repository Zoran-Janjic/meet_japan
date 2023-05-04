const handleDuplicateKeyError = require("./handleDuplicateKeyError");
const handleMongooseValidationError = require("./HandleMongooseValidationError");
const handleMongooseCastError = require("./handleMongooseCastError");
const handleJwtError = require("./handleJwtError");
module.exports = {
  handleMongooseValidationError,
  handleDuplicateKeyError,
  handleMongooseCastError,
  handleJwtError,
};
