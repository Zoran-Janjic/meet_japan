const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./CustomAPIError");

class BadRequestError extends CustomAPIError {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
