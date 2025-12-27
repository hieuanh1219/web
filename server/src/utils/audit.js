function auditLog(req, { action, resource, targetId, meta }) {
  const actor = req.user
    ? { id: req.user.id, email: req.user.email, role: req.user.role }
    : null;

  req.log.info(
    {
      type: "AUDIT",
      action,
      resource,
      actor,
      targetId: targetId || null,
      meta: meta || null,
    },
    "AUDIT"
  );
}

module.exports = { auditLog };
