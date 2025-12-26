const { z } = require("zod");

const loginSchema = {
  body: z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Password tối thiểu 6 ký tự"),
  }),
};

const refreshSchema = {
  body: z.object({
    refreshToken: z.string().min(1, "refreshToken là bắt buộc"),
  }),
};

module.exports = { loginSchema, refreshSchema };
