const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};

module.exports = sendError;
