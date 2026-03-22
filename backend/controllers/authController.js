import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

const ALLOWED_ROLES = new Set(['admin', 'patient', 'doctor']);

const getJwtConfig = () => {
  const secret = process.env.JWT_SECRET || 'temporary-dev-secret-change-in-production';
  const expiresIn = process.env.JWT_EXPIRE || '24h';
  return { secret, expiresIn };
};

const normalizeAllowedRole = (requestedRole) => {
  const normalized = String(requestedRole || '').toLowerCase();
  return ALLOWED_ROLES.has(normalized) ? normalized : 'patient';
};

export const signup = async (req, res) => {
  try {
    console.log('Signup request:', req.body);

    const { username, password, role, phone, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const resolvedRole = normalizeAllowedRole(role);
    const generatedEmail = (email && String(email).trim()) ? String(email).trim().toLowerCase() : `${username}@app.com`;

    const [existing] = await pool.query(
      'SELECT user_id FROM users WHERE name = ? OR email = ? LIMIT 1',
      [username, generatedEmail]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with requested schema mapping.
    try {
      await pool.query(
        'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
        [username, generatedEmail, hashedPassword, resolvedRole, phone || null]
      );
    } catch (err) {
      console.log('Signup DB Error:', err);
      return res.status(500).json({ message: err.message });
    }

    const jwtConfig = getJwtConfig();

    // Generate token
    const token = jwt.sign(
      { username, role: resolvedRole },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    res.status(201).json({ token, role: resolvedRole, username });
  } catch (err) {
    console.log(err);
    console.error('Signup error:', err);
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log('Login request:', req.body);

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const usernameAsEmail = `${username}@app.com`;
    let rows;
    try {
      [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ? OR name = ? OR email = ? LIMIT 1',
        [username, username, usernameAsEmail]
      );
    } catch (err) {
      console.log('Login DB Error:', err);
      return res.status(500).json({ message: err.message });
    }

    const user = rows[0];
    if (!user) {
      console.log('User not found for:', req.body.username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const storedPassword = user.password;

    if (!storedPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, storedPassword);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const resolvedRole = normalizeAllowedRole(user.role);
    const resolvedUsername = user.name || user.email || username;

    // Generate token
    const token = jwt.sign(
      { username: resolvedUsername, role: resolvedRole },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.json({
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: resolvedRole,
        phone: user.phone,
        status: user.status
      }
    });
  } catch (err) {
    console.log('Login DB Error:', err);
    console.log(err);
    console.error('Login error:', err);
    return res.status(500).json({ message: err.message });
  }
};
