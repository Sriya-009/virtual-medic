import pool from '../config/database.js';

export const getAllPharmacists = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, fullname, phone, role FROM users WHERE role = "pharmacist"');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching pharmacists:', err);
    res.status(500).json({ message: 'Error fetching pharmacists' });
  }
};

export const getPharmacistById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT id, username, fullname, phone, role FROM users WHERE id = ? AND role = "pharmacist"', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Pharmacist not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching pharmacist:', err);
    res.status(500).json({ message: 'Error fetching pharmacist' });
  }
};

export const updatePharmacist = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, phone } = req.body;

    await pool.query('UPDATE users SET fullname = ?, phone = ? WHERE id = ? AND role = "pharmacist"', 
      [fullname, phone, id]);
    res.json({ message: 'Pharmacist updated successfully' });
  } catch (err) {
    console.error('Error updating pharmacist:', err);
    res.status(500).json({ message: 'Error updating pharmacist' });
  }
};
