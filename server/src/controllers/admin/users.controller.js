const service = require("../../services/admin/users.service");
// dungf de su ly loi
function handle(res, err) {
  const status = err.status || 500;
  return res.status(status).json({ message: err.message || "Server error" });
}
// //Nhận request từ client

// Lấy query params

// Gọi service layer

// Trả response

// Bắt lỗi và trả lỗi chuẩn
exports.listAdmins = async (req, res) => {
  try {
    const { q, page, limit } = req.query;
    const data = await service.listAdmins({ q, page, limit });
    res.json(data);
  } catch (err) {
    handle(res, err);
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const data = await service.getAdminById(req.params.id);
    res.json(data);
  } catch (err) {
    handle(res, err);
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const data = await service.createAdmin({ email, password, role });
    res.status(201).json(data);
  } catch (err) {
    handle(res, err);
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const data = await service.updateAdmin({
      targetId: req.params.id,
      actorId: req.user.id,
      email,
      password,
      role,
    });
    res.json(data);
  } catch (err) {
    handle(res, err);
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const data = await service.deleteAdmin({
      targetId: req.params.id,
      actorId: req.user.id,
    });
    res.json(data);
  } catch (err) {
    handle(res, err);
  }
};