import pool from '../config/database.js';

const ALLOWED_ROLES = new Set(['admin', 'patient', 'doctor']);

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, fullname, phone, role FROM users');
    res.json(rows);
  } catch (err) {
    console.log(err);
    console.error('Error fetching users:', err);
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT id, username, fullname, phone, role FROM users WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    console.error('Error fetching user:', err);
    res.status(500).json({ message: err.message });
  }
};

export const getUsersByRole = async (req, res) => {
  try {
    const normalizedRole = String(req.params.role || '').toLowerCase();
    if (!ALLOWED_ROLES.has(normalizedRole)) {
      return res.status(400).json({ message: 'Invalid role. Allowed values: admin, patient, doctor' });
    }

    const [rows] = await pool.query('SELECT id, username, fullname, phone, role FROM users WHERE role = ?', [normalizedRole]);
    res.json(rows);
  } catch (err) {
    console.log(err);
    console.error('Error fetching users by role:', err);
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    console.log('Update request:', req.body);

    const { id } = req.params;
    const { fullname, phone } = req.body;

    await pool.query('UPDATE users SET fullname = ?, phone = ? WHERE id = ?', [fullname, phone, id]);
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.log('Update DB Error:', err);
    console.error('Error updating user:', err);
    res.status(500).json({ message: err.message });
  }
};
