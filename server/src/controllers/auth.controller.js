const authService = require("../services/auth.service");
const { auditLog } = require("../utils/audit");
const { AUDIT_ACTIONS, AUDIT_RESOURCES } = require("../constants/audit");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    // (Core #2) audit login success
    if (req.log && auditLog) {
      auditLog(req, {
        action: AUDIT_ACTIONS?.LOGIN || "LOGIN",
        resource: AUDIT_RESOURCES?.AUTH || "AUTH",
        targetId: result?.user?.id,
        meta: { email: result?.user?.email, role: result?.user?.role },
      });
    }

    return res.json(result);
  } catch (e) {
    return next(e);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);

    // (Core #2) audit refresh
    if (req.log && auditLog) {
      auditLog(req, {
        action: AUDIT_ACTIONS?.REFRESH || "REFRESH",
        resource: AUDIT_RESOURCES?.AUTH || "AUTH",
        meta: { userId: result?.user?.id || null },
      });
    }

    return res.json(result);
  } catch (e) {
    return next(e);
  }
}

module.exports = { login, refresh };
