const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

async function ensureDefaultAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@clms.com').toLowerCase();
  const name = process.env.ADMIN_NAME || 'Admin';
  const existing = await Admin.findOne({ email });
  if (existing) return;
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({ email, name, passwordHash });
  // eslint-disable-next-line no-console
  console.log(`Seeded default admin: ${email}`);
}

module.exports = { ensureDefaultAdmin };

