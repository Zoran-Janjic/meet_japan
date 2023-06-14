const createHttpResponse = (res, statusCode, statusMessage, message, data) => {
  return res.status(statusCode).json({
    status: statusMessage,
    message: message || null,
    data: data || null,
  });
};

module.exports = createHttpResponse;
