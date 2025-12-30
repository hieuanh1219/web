class AppError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR", details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isAppError = true;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = "Bad Request", details = null) {
    super(message, 400, "BAD_REQUEST", details);
  }
}
class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details = null) {
    super(message, 401, "UNAUTHORIZED", details);
  }
}
class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details = null) {
    super(message, 403, "FORBIDDEN", details);
  }
}
class NotFoundError extends AppError {
  constructor(message = "Not Found", details = null) {
    super(message, 404, "NOT_FOUND", details);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
};
