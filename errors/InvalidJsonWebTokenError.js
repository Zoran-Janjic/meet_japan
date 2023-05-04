const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./CustomAPIError");

class InvalidJsonWebTokenError extends CustomAPIError {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = InvalidJsonWebTokenError;
