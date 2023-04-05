const { StatusCodes } = require("http-status-codes");
const CustomApiError = require("./CustomAPIError");

class NotFoundError extends CustomApiError {
  constructor(message, status) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.status = status;
  }
}

module.exports = NotFoundError;
