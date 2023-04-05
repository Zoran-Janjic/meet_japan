const { StatusCodes } = require("http-status-codes");

const handleDuplicateKeyError = (customError, err) => {
  const newError = { ...customError };

  newError.msg = `That value has already been used : ${Object.entries(
    err.keyValue
  )}. Please use a different value.`;

  newError.statusCode = StatusCodes.BAD_REQUEST;

  return newError;
};

module.exports = handleDuplicateKeyError;
