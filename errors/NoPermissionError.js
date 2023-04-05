const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./CustomAPIError");

class NoPermissionError extends CustomAPIError {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = NoPermissionError;
