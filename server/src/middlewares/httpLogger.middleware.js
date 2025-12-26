function httpLogger(logger) {
  return (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
      const ms = Date.now() - start;
      logger.info(
        {
          requestId: req.requestId,
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
          ms,
        },
        "HTTP"
      );
    });

    next();
  };
}

module.exports = { httpLogger };
