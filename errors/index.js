const CustomAPIError = require("./CustomAPIError");
const NotFoundError = require("./NotFoundError");
const BadRequestError = require("./BadRequestError");
const JsonWebTokenError = require("./JsonWebTokenError");
const NoPermissionError = require("./NoPermissionError");
const InvalidJsonWebTokenError = require("./InvalidJsonWebTokenError");

module.exports = {
  CustomAPIError,
  NotFoundError,
  BadRequestError,
  JsonWebTokenError,
  NoPermissionError,
  InvalidJsonWebTokenError,
};
