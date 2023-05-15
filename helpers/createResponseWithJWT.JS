const createResponseWithJWT = (
  res,
  statusCode,
  statusMessage,
  token,
  message,
  data
) => {
  res.status(statusCode).json({
    status: statusMessage,
    message: message || null,
    data: data || null,
    token,
  });
};

module.exports = createResponseWithJWT;
