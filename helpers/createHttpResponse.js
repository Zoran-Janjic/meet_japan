const createHttpResponse = (res, statusCode, statusMessage, message, data) => {
  res.status(statusCode).json({
    status: statusMessage,
    message: message || null,
    data: data || null,
  });
};

module.exports = createHttpResponse;
