const { permissions } = require("../constants/permissions");

function can(resource, action) {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const rolePermissions = permissions[role];
    if (!rolePermissions) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // SuperAdmin
    if (rolePermissions["*"]?.includes("*")) {
      return next();
    }

    const allowedActions = rolePermissions[resource] || [];
    if (!allowedActions.includes(action)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
}

module.exports = { can };
