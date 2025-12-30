const jwt = require("jsonwebtoken");
const prisma = require("../db/prisma");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is missing");

function unauthorized(res, message = "Unauthorized") {
  return res.status(401).json({ message });
}

exports.requireAuth = async (req, res, next) => {
  try {
    // 1) Header
    const authHeader = req.headers.authorization;
    if (!authHeader) return unauthorized(res, "Missing Authorization header");

    // 2) Bearer token
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return unauthorized(res, "Invalid Authorization format");
    }

    // 3) Verify token
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return unauthorized(res, "Invalid or expired token");
    }

    // 4) Payload tối thiểu
    if (!payload.sub) {
      return unauthorized(res, "Invalid token payload");
    }

    // 5) Check user tồn tại
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!user || user.status !== "ACTIVE") {
      return unauthorized(res);
    }

    // 6) Gắn user
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return next();
  } catch (err) {
    return unauthorized(res, "Invalid token");
  }
};
