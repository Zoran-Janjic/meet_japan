const unknownEndpoint = (req, res) => {
  res.status(404).send({
    status: "fail",
    message: `Endpoint ${req.originalUrl} does not exist on thi server.`,
  });
};

module.exports = unknownEndpoint;
