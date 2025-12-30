function httpLogger() {
  return (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
      const ms = Date.now() - start;

      // Log tổng kết request
      req.log.info(
        {
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
