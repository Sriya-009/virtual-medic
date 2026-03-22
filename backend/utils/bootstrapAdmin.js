import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

const getUsersSchema = async () => {
  const [columns] = await pool.query('SHOW COLUMNS FROM users');
  const names = new Set(columns.map((column) => String(column.Field).toLowerCase()));

  return {
    id: names.has('id') ? 'id' : (names.has('user_id') ? 'user_id' : null),
    username: names.has('username') ? 'username' : (names.has('email') ? 'email' : null),
    fullname: names.has('fullname') ? 'fullname' : (names.has('name') ? 'name' : null),
    hasPhone: names.has('phone'),
    hasRole: names.has('role'),
    hasStatus: names.has('status')
  };
};

export const ensureBootstrapAdmin = async () => {
  const username = process.env.BOOTSTRAP_ADMIN_USERNAME;
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!username || !password) {
    return;
  }

  try {
    const schema = await getUsersSchema();

    if (!schema.id || !schema.username) {
      console.error('Failed to bootstrap admin user: users table missing required columns.');
      return;
    }

    const [existing] = await pool.query(
      `SELECT ${schema.id} FROM users WHERE ${schema.username} = ? LIMIT 1`,
      [username]
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existing.length > 0) {
      const updateColumns = ['password = ?'];
      const updateValues = [hashedPassword];

      if (schema.hasRole) {
        updateColumns.push('role = ?');
        updateValues.push('admin');
      }

      if (schema.hasStatus) {
        updateColumns.push('status = ?');
        updateValues.push('active');
      }

      updateValues.push(existing[0][schema.id]);

      await pool.query(
        `UPDATE users SET ${updateColumns.join(', ')} WHERE ${schema.id} = ?`,
        updateValues
      );

      console.log('Bootstrap admin user updated successfully.');
      return;
    }

    const insertColumns = [schema.username, 'password'];
    const insertValues = [username, hashedPassword];

    if (schema.fullname) {
      insertColumns.push(schema.fullname);
      insertValues.push('System Admin');
    }

    if (schema.hasPhone) {
      insertColumns.push('phone');
      insertValues.push(null);
    }

    if (schema.hasRole) {
      insertColumns.push('role');
      insertValues.push('admin');
    }

    if (schema.hasStatus) {
      insertColumns.push('status');
      insertValues.push('active');
    }

    const placeholders = insertColumns.map(() => '?').join(', ');

    await pool.query(
      `INSERT INTO users (${insertColumns.join(', ')}) VALUES (${placeholders})`,
      insertValues
    );

    console.log('Bootstrap admin user created successfully.');
  } catch (error) {
    console.error('Failed to bootstrap admin user:', error.message);
  }
};
