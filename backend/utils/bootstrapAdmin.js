import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

export const ensureBootstrapAdmin = async () => {
  const username = process.env.BOOTSTRAP_ADMIN_USERNAME;
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!username || !password) {
    return;
  }

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE username = ? LIMIT 1', [username]);

    if (existing.length > 0) {
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, password, fullname, phone, role) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, 'System Admin', null, 'admin']
    );

    console.log('Bootstrap admin user created successfully.');
  } catch (error) {
    console.error('Failed to bootstrap admin user:', error.message);
  }
};
