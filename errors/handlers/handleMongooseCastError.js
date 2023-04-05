const { StatusCodes } = require("http-status-codes");

const handleMongooseCastError = (customError, err) => {
  const newError = { ...customError };

  newError.msg = `Invalid item id of : ${err.value}. Check your input.`;
  newError.statusCode = StatusCodes.NOT_FOUND;

  return newError;
};

module.exports = handleMongooseCastError;
