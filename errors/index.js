const CustomAPIError = require("./CustomAPIError");
const UnauthenticatedError = require("./UnauthenticatedError");
const NotFoundError = require("./NotFoundError");
const BadRequestError = require("./BadRequestError");
const JsonWebTokenError = require("./JsonWebTokenError");
const NoPermissionError = require("./NoPermissionError");

module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  JsonWebTokenError,
  NoPermissionError,
};
