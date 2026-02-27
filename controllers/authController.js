const Admin = require('../models/Admin');
const { signToken } = require('../utils/jwt');

async function login(req, res) {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: (email || '').toLowerCase() });
  if (!admin) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const ok = await admin.comparePassword(password || '');
  if (!ok) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = signToken({ id: admin._id, email: admin.email, name: admin.name });
  res.json({
    token,
    admin: { id: admin._id, name: admin.name, email: admin.email },
  });
}

module.exports = { login };

