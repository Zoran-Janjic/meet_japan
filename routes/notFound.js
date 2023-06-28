const createHttpResponse = require("../helpers/createHttpResponse");
const { StatusCodes } = require("http-status-codes");

const unknownEndpoint = (req, res) => {
  createHttpResponse(
    res,
    StatusCodes.NOT_FOUND,
    `Endpoint ${req.originalUrl} does not exist on this server.`,
    "Failed"
  );
};

module.exports = unknownEndpoint;
