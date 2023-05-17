/* eslint-disable no-unused-vars */
const colors = require("colors/safe");
const { StatusCodes } = require("http-status-codes");
const {
  handleMongooseValidationError,
  handleDuplicateKeyError,
  handleMongooseCastError,
  handleJwtError,
} = require("../errors/handlers");

const MONGOOSE_DUPLICATE_KEY_ERROR_CODE = 11000;
const MONGOOSE_VALIDATION_ERROR = "ValidationError";
const MONGOOSE_CAST_ERROR = "CastError";
const JWT_ERROR = "JsonWebTokenError";
const EXPIRED_JWT = "TokenExpiredError";

const errorHandler = (error, request, response, next) => {
  console.error(colors.bgRed.white.bold(error)); //! Dev only

  let customError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    status: error.status || "Failed",
    msg: error.message || "Something went wrong. We are working on it.",
  };

  // If error from mongoose make more user friendly error message
  if (error.name === MONGOOSE_VALIDATION_ERROR) {
    customError = handleMongooseValidationError(customError, error);
  }
  // Duplicate register value
  if (error.code && error.code === MONGOOSE_DUPLICATE_KEY_ERROR_CODE) {
    customError = handleDuplicateKeyError(customError, error);
  }
  // Wrong format of request value
  if (error.name === MONGOOSE_CAST_ERROR) {
    customError = handleMongooseCastError(customError, error);
  }
  //  Jwt errors
  if (error.name === JWT_ERROR) {
    customError = handleJwtError(customError, error);
  }
  // ! Dev only
  // console.error(
  //   colors.bgRed.white.bold(
  //     "Error not handled by error handler: ",
  //     error.message
  //   )
  // );

  // Send the error message
  response
    .status(customError.statusCode)
    .json({ msg: customError.msg, status: customError.status });
};

module.exports = errorHandler;
