const prisma = require("../db/prisma");
const bcrypt = require("bcryptjs");
const { signAccessToken, signRefreshToken } = require("../utils/jwt");

async function login(email, password) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new Error("Invalid email or password");
  }

  const accessToken = signAccessToken({
    id: user.id,
    role: user.role,
  });

  const refreshToken = signRefreshToken({
    id: user.id,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}

module.exports = { login };
