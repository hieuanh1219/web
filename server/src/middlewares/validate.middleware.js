const { BadRequestError } = require("../utils/errors");

function validate(schema) {
  return (req, res, next) => {
    if (!schema || typeof schema !== "object") {
      return next(new BadRequestError("Validation schema is missing"));
    }

    const { body, query, params } = schema;

    try {
      if (body) req.body = body.parse(req.body);
      if (query) req.query = query.parse(req.query);
      if (params) req.params = params.parse(req.params);
      return next();
    } catch (err) {
      const issues = err?.issues || err?.errors;
      const details = Array.isArray(issues)
        ? issues.map((e) => ({
            path: Array.isArray(e.path) ? e.path.join(".") : String(e.path),
            message: e.message,
          }))
        : null;

      return next(new BadRequestError("Validation error", details));
    }
  };
}

module.exports = { validate };
