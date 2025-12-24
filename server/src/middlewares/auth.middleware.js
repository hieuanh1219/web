const prisma = require("../db/prisma");
const { verifyAccess } = require("../utils/jwt");

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing token" });

    const decoded = verifyAccess(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      include: { roles: { include: { role: true } } }
    });
    if (!user || user.status !== "ACTIVE") return res.status(401).json({ message: "Unauthorized" });

    req.user = {
      id: user.id,
      email: user.email,
      roles: user.roles.map((ur) => ur.role.code),
    };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { requireAuth };
