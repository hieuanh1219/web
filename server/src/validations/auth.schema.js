const { z } = require("zod");

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

module.exports = { loginSchema, refreshSchema };
