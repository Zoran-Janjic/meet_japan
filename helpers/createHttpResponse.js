const createHttpResponse = (res, statusCode, statusMessage, message, data) => {
  return res.status(statusCode).json({
    totalItems: data ? data.length : null,
    status: statusMessage || null,
    message: message || null,
    data: data || null,
  });
};

module.exports = createHttpResponse;
