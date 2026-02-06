const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  return res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || "Something went wrong on the server",
      details: err.extraDetails || null,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  });
};

module.exports = errorMiddleware;
