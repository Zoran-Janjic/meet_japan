const { StatusCodes } = require("http-status-codes");

const handleMongooseValidationError = (customError, err) => {
  const newError = { ...customError };
  newError.msg = Object.values(err.errors)
    .map((item) => item.message)
    .join(",");
  newError.statusCode = StatusCodes.BAD_REQUEST;

  return newError;
};

module.exports = handleMongooseValidationError;
