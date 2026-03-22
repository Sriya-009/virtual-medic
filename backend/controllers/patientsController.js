import pool from '../config/database.js';

export const getAllPatients = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, fullname, phone, role FROM users WHERE role = "patient"');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ message: 'Error fetching patients' });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT id, username, fullname, phone, role FROM users WHERE id = ? AND role = "patient"', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching patient:', err);
    res.status(500).json({ message: 'Error fetching patient' });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, phone } = req.body;

    await pool.query('UPDATE users SET fullname = ?, phone = ? WHERE id = ? AND role = "patient"', 
      [fullname, phone, id]);
    res.json({ message: 'Patient updated successfully' });
  } catch (err) {
    console.error('Error updating patient:', err);
    res.status(500).json({ message: 'Error updating patient' });
  }
};
