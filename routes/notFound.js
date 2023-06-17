const helpers = require("../helpers/index");
const { StatusCodes } = require("http-status-codes");

const unknownEndpoint = (req, res) => {
  helpers.createHttpResponse(
    res,
    StatusCodes.NOT_FOUND,
    `Endpoint ${req.originalUrl} does not exist on this server.`,
    "Failed"
  );
};

module.exports = unknownEndpoint;
