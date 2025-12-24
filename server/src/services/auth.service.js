const bcrypt = require("bcryptjs");
const prisma = require("../db/prisma");
const { signAccessToken, signRefreshToken, verifyRefresh } = require("../utils/jwt");

async function login(email, password) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { roles: { include: { role: true } } },
  });
  if (!user || user.status !== "ACTIVE") throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("Invalid credentials");

  const roles = user.roles.map((ur) => ur.role.code);

  return {
    accessToken: signAccessToken({ sub: user.id, roles }),
    refreshToken: signRefreshToken({ sub: user.id }),
    user: { id: user.id, email: user.email, roles },
  };
}

async function refresh(refreshToken) {
  const decoded = verifyRefresh(refreshToken);
  const user = await prisma.user.findUnique({
    where: { id: decoded.sub },
    include: { roles: { include: { role: true } } },
  });
  if (!user || user.status !== "ACTIVE") throw new Error("Unauthorized");
  const roles = user.roles.map((ur) => ur.role.code);
  return { accessToken: signAccessToken({ sub: user.id, roles }) };
}

module.exports = { login, refresh };
