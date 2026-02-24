const { ApiError } = require("../utils/ApiError");
const { env } = require("../config/env");

const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.nodeEnv !== "production" ? { stack: err.stack } : {}),
  });
};

module.exports = { notFoundHandler, errorHandler };
