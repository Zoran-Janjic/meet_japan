const CustomApiError = require("./CustomAPIError");
const { StatusCodes } = require("http-status-codes");

class UnauthenticatedError extends CustomApiError {
  constructor(message, status) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.status = status;
  }
}

module.exports = UnauthenticatedError;
