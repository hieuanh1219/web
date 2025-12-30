const bcrypt = require("bcrypt");
const prisma = require("../../db/prisma");

const ALLOWED_ROLES = new Set(["ADMIN", "SUPER_ADMIN"]);
// kiem tra tinh hop le cua role
function assertRole(role) {
  if (!ALLOWED_ROLES.has(role)) {
    const err = new Error("Invalid role");
    err.status = 400;
    throw err;
  }
}
//kiem tra so luong supper admin
async function countSuperAdmins() {
  return prisma.user.count({ where: { role: "SUPER_ADMIN" } });
}
// tim va lay danh sach admin

exports.listAdmins = async ({ q, page = 1, limit = 20 }) => {
  const take = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * take;

  const where = q
    ? { email: { contains: q, mode: "insensitive" } }
    : {};

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
    }),
    prisma.user.count({ where }),
  ]);

  return { items, page: Math.max(parseInt(page, 10) || 1, 1), limit: take, total };
};
// lay thong tin cua admin theo id
exports.getAdminById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
  });

  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return user;
};
// tao ra admin moi
exports.createAdmin = async ({ email, password, role = "ADMIN" }) => {
  if (!email || typeof email !== "string") {
    const err = new Error("Email is required");
    err.status = 400;
    throw err;
  }
  //kiem tra mk
  if (!password || typeof password !== "string" || password.length < 6) {
    const err = new Error("Password must be at least 6 characters");
    err.status = 400;
    throw err;
  }
// cap vai tro
  assertRole(role);

  const passwordHash = await bcrypt.hash(password, 10);
// kiem trah trung email
  try {
    const created = await prisma.user.create({
      data: { email: email.toLowerCase().trim(), password: passwordHash, role },
      select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
    return created;
  } catch (e) {
    // email unique
    const err = new Error("Email already exists");
    err.status = 409;
    throw err;
  }
};

exports.updateAdmin = async ({ targetId, actorId, email, password, role }) => {
  const existing = await prisma.user.findUnique({ where: { id: targetId } });
  if (!existing) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  // Không cho đổi role sang giá trị rác
  if (role !== undefined) assertRole(role);

  // Rule: Không được hạ cấp SUPER_ADMIN cuối cùng
  if (existing.role === "SUPER_ADMIN" && role === "ADMIN") {
    const totalSA = await countSuperAdmins();
    if (totalSA <= 1) {
      const err = new Error("Cannot downgrade the last SUPER_ADMIN");
      err.status = 400;
      throw err;
    }
  }

  // (Tuỳ bạn) cho phép tự đổi email/password của chính mình? -> hiện cho phép
  const data = {};

  if (email !== undefined) {
    if (!email || typeof email !== "string") {
      const err = new Error("Invalid email");
      err.status = 400;
      throw err;
    }
    data.email = email.toLowerCase().trim();
  }

  if (role !== undefined) data.role = role;

  if (password !== undefined) {
    if (!password || typeof password !== "string" || password.length < 6) {
      const err = new Error("Password must be at least 6 characters");
      err.status = 400;
      throw err;
    }
    data.password = await bcrypt.hash(password, 10);
  }

  // Không update rỗng
  if (Object.keys(data).length === 0) {
    const err = new Error("No fields to update");
    err.status = 400;
    throw err;
  }

  // Email trùng
  try {
    const updated = await prisma.user.update({
      where: { id: targetId },
      data,
      select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
    return updated;
  } catch (e) {
    const err = new Error("Email already exists");
    err.status = 409;
    throw err;
  }
};

exports.deleteAdmin = async ({ targetId, actorId }) => {
  if (targetId === actorId) {
    const err = new Error("Cannot delete yourself");
    err.status = 400;
    throw err;
  }

  const existing = await prisma.user.findUnique({ where: { id: targetId } });
  if (!existing) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  // Không xoá SUPER_ADMIN cuối cùng
  if (existing.role === "SUPER_ADMIN") {
    const totalSA = await countSuperAdmins();
    if (totalSA <= 1) {
      const err = new Error("Cannot delete the last SUPER_ADMIN");
      err.status = 400;
      throw err;
    }
  }

  await prisma.user.delete({ where: { id: targetId } });
  return { success: true };
};