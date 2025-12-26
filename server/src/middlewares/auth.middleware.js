const prisma = require("../db/prisma");
const jwt = require("jsonwebtoken");

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded = { id, role, iat, exp }
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.status !== "ACTIVE") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (e) {
    console.error("AUTH ERROR:", e.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { requireAuth };
