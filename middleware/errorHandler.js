const errorHandler = (err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    data: null,
    error: {
      code: err.code || "SERVER_ERROR",
      message: err.message || "Something went wrong",
    },
  });
};

export default errorHandler;