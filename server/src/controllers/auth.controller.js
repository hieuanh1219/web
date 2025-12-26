const authService = require("../services/auth.service");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return res.json(result);
  } catch (e) {
    return next(e);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    return res.json(result);
  } catch (e) {
    return next(e);
  }
}

module.exports = { login, refresh };
