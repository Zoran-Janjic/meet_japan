const { StatusCodes } = require("http-status-codes");

const INVALID_TOKEN = "Invalid signature";
const MISSING_TOKEN = "Missing token";
const USER_NOT_REGISTERED = "User not found";
const PASSWORD_CHANGED = "Password changed";
const handleDuplicateKeyError = (customError, err) => {
  const newError = { ...customError };

  switch (err.message) {
  case INVALID_TOKEN:
    newError.msg = "Invalid token.";
    newError.statusCode = StatusCodes.UNAUTHORIZED;
    break;
  case MISSING_TOKEN:
    newError.msg = "You must be logged in to access this resource.";
    newError.statusCode = StatusCodes.BAD_REQUEST;
    break;
  case USER_NOT_REGISTERED:
    newError.msg = "User not found.";
    newError.statusCode = StatusCodes.BAD_REQUEST;
    break;
  case PASSWORD_CHANGED:
    newError.msg = "Password changed. Please login again.";
    newError.statusCode = StatusCodes.UNAUTHORIZED;
    break;
  default:
    console.log("No such JWT error");
    break;
  }

  return newError;
};

module.exports = handleDuplicateKeyError;
