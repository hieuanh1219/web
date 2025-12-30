const { AppError } = require("../utils/errors");

function validateQuery(schema) {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.query);
      if (!result.success) {
        throw new AppError("Validation error", 400, "BAD_REQUEST", {
          name: "ZodError",
          message: result.error.toString(),
        });
      }
      req.queryNormalized = result.data; // ✅ normalized query
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = { validateQuery };
