const authService = require("../services/auth.service");

async function login(req, res) {
  try {
    const { email, password } = req.validated.body;
    const data = await authService.login(email, password);
    res.json(data);
  } catch (e) {
    res.status(400).json({ message: e.message || "Login failed" });
  }
}

async function refresh(req, res) {
  try {
    const { refreshToken } = req.validated.body;
    const data = await authService.refresh(refreshToken);
    res.json(data);
  } catch (e) {
    res.status(401).json({ message: e.message || "Refresh failed" });
  }
}

module.exports = { login, refresh };
