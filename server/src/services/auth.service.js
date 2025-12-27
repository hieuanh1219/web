const bcrypt = require("bcryptjs");
const prisma = require("../db/prisma");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefresh,
} = require("../utils/jwt");
const { UnauthorizedError } = require("../utils/errors");

async function login(email, password) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.status !== "ACTIVE") {
    throw new UnauthorizedError("Invalid credentials");
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new UnauthorizedError("Invalid credentials");
  }

  // 🔑 role giờ là field đơn
  const role = user.role;

  return {
    accessToken: signAccessToken({
      sub: user.id,
      role,
    }),
    refreshToken: signRefreshToken({
      sub: user.id,
    }),
    user: {
      id: user.id,
      email: user.email,
      role,
    },
  };
}

async function refresh(refreshToken) {
  const decoded = verifyRefresh(refreshToken);

  const user = await prisma.user.findUnique({
    where: { id: decoded.sub },
  });

  if (!user || user.status !== "ACTIVE") {
    throw new UnauthorizedError("Unauthorized");
  }

  return {
    accessToken: signAccessToken({
      sub: user.id,
      role: user.role,
    }),
  };
}

module.exports = { login, refresh };
