function attachLogger(logger) {
  return (req, res, next) => {
    // child logger
    req.log = logger.child({
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
    });

    next();
  };
}

module.exports = { attachLogger };
