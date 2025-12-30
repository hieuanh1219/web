// server/src/constants/index.js

module.exports = {
  // RBAC
  ...require("./roles"),
  ...require("./actions"),
  ...require("./resources"),
  ...require("./permissions"),

  // Other constants (mo rong sau)
  ...require("./propertyStatus"),
};
