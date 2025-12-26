const { NotFoundError, AppError } = require("../utils/errors");

function notFound(req, res, next) {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
}

function isPrismaError(err) {
  return typeof err?.code === "string" && err.code.startsWith("P");
}

function mapPrismaError(err) {
  if (err.code === "P2002") {
    return new AppError("Duplicate value", 409, "DUPLICATE", { target: err?.meta?.target });
  }
  if (err.code === "P2025") {
    return new AppError("Record not found", 404, "NOT_FOUND");
  }
  return new AppError("Database error", 500, "DB_ERROR");
}

function errorHandler(err, req, res, next) {
  const requestId = req.requestId;
  console.error("STACK:", err?.stack);

  let finalErr = err;

  if (isPrismaError(err)) {
    finalErr = mapPrismaError(err);
  }

  if (!finalErr?.isAppError) {
    finalErr = new AppError(finalErr?.message || "Internal Server Error", 500, "INTERNAL_ERROR");
  }

  // Log nội bộ
  console.error("ERROR", {
    requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode: finalErr.statusCode,
    code: finalErr.code,
    message: err?.message,
    stack: err?.stack,
  });

  return res.status(finalErr.statusCode).json({
    message: finalErr.message,
    code: finalErr.code,
    details: finalErr.details,
    requestId,
  });
}

module.exports = { notFound, errorHandler };
