const { NotFoundError, AppError } = require("../utils/errors");

function notFound(req, res, next) {
  // Route không tồn tại -> đẩy qua errorHandler chung
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
}

function isPrismaError(err) {
  // Prisma errors thường có code bắt đầu bằng "Pxxxx"
  return typeof err?.code === "string" && err.code.startsWith("P");
}

function mapPrismaError(err) {
  // Map lỗi Prisma -> AppError (chuẩn hóa message/status/code)
  if (err.code === "P2002") {
    return new AppError("Duplicate value", 409, "DUPLICATE", {
      target: err?.meta?.target || null,
    });
  }
  if (err.code === "P2025") {
    return new AppError("Record not found", 404, "NOT_FOUND");
  }
  return new AppError("Database error", 500, "DB_ERROR");
}

function shouldLogStack(finalErr) {
  // Dev: log stack luôn
  if (process.env.NODE_ENV !== "production") return true;

  // Prod: chỉ log stack khi 5xx (hoặc bật cờ)
  if (process.env.LOG_STACK === "true") return true;
  return finalErr.statusCode >= 500;
}

function errorHandler(err, req, res, next) {
  const requestId = req.requestId;

  let finalErr = err;

  // 1) Prisma -> AppError
  if (isPrismaError(err)) {
    finalErr = mapPrismaError(err);
  }

  // 2) Nếu không phải AppError -> bọc lại thành AppError chuẩn
  if (!finalErr?.isAppError) {
    finalErr = new AppError(
      finalErr?.message || "Internal Server Error",
      500,
      "INTERNAL_ERROR"
    );
  }

  // 3) Logger: ưu tiên req.log (Core #2), fallback console
  const log = req.log || console;

  const payload = {
    requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode: finalErr.statusCode,
    code: finalErr.code,
    message: err?.message,
  };

  if (shouldLogStack(finalErr)) {
    payload.stack = err?.stack;
  }

  // 4) Log: 5xx dùng error, 4xx dùng warn
  if (finalErr.statusCode >= 500) log.error(payload, "ERROR");
  else log.warn(payload, "ERROR");

  // 5) Response chuẩn Core #1
  return res.status(finalErr.statusCode).json({
    message: finalErr.message,
    code: finalErr.code,
    details: finalErr.details ?? null,
    requestId,
  });
}

module.exports = { notFound, errorHandler };
