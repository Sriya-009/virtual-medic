import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

const BCRYPT_PREFIX = /^\$2[aby]\$/;

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

const findUserForLogin = async (schema, loginId) => {
  // Default path: identifier column is already username.
  if (schema.username !== 'email') {
    const [rows] = await pool.query(`SELECT * FROM users WHERE ${schema.username} = ? LIMIT 1`, [loginId]);
    return rows[0] || null;
  }

  // Email-schema path: accept exact email, local-part of email (admin from admin@gmail.com), and name fallback.
  const fallbackNameColumn = schema.fullname || 'email';
  const [rows] = await pool.query(
    `SELECT * FROM users
     WHERE email = ?
        OR SUBSTRING_INDEX(email, '@', 1) = ?
        OR ${fallbackNameColumn} = ?
     LIMIT 1`,
    [loginId, loginId, loginId]
  );

  return rows[0] || null;
};

export const signup = async (req, res) => {
  try {
    const { username, password, fullname, phone, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const schema = await getUsersSchema();

    if (!schema.id || !schema.username) {
      return res.status(500).json({ message: 'Users table is missing required columns' });
    }

    // Check if user exists
    const [rows] = await pool.query(`SELECT ${schema.id} FROM users WHERE ${schema.username} = ?`, [username]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const insertColumns = [schema.username, 'password'];
    const insertValues = [username, hashedPassword];

    if (schema.fullname) {
      insertColumns.push(schema.fullname);
      insertValues.push(fullname || username);
    }

    if (schema.hasPhone) {
      insertColumns.push('phone');
      insertValues.push(phone || null);
    }

    if (schema.hasRole) {
      insertColumns.push('role');
      insertValues.push(role || 'patient');
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

    const resolvedRole = schema.hasRole ? (role || 'patient') : 'patient';

    // Generate token
    const token = jwt.sign(
      { username, role: resolvedRole },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({ token, role: resolvedRole, username });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Error creating account' });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const schema = await getUsersSchema();

    if (!schema.id || !schema.username) {
      return res.status(500).json({ message: 'Users table is missing required columns' });
    }

    // Find user
    const user = await findUserForLogin(schema, username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const storedPassword = user.password;

    if (!storedPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Verify password
    let isValidPassword = false;
    const isBcryptHash = BCRYPT_PREFIX.test(String(storedPassword));

    if (isBcryptHash) {
      isValidPassword = await bcrypt.compare(password, storedPassword);
    } else {
      isValidPassword = password === String(storedPassword);

      // Auto-migrate legacy plaintext passwords to bcrypt on successful login.
      if (isValidPassword) {
        const newHash = await bcrypt.hash(password, 10);
        await pool.query(`UPDATE users SET password = ? WHERE ${schema.id} = ?`, [newHash, user[schema.id]]);
      }
    }

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const resolvedRole = user.role || 'patient';
    const resolvedUsername = user[schema.username];

    // Generate token
    const token = jwt.sign(
      { username: resolvedUsername, role: resolvedRole },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({ token, role: resolvedRole, username: resolvedUsername });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Error logging in' });
  }
};
