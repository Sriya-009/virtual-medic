import pool from '../config/database.js';

export const getAllDoctors = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE role = "doctor"');
    res.json(rows);
  } catch (err) {
    console.log(err);
    console.error('Error fetching doctors:', err);
    res.status(500).json({ message: err.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? AND role = "doctor"', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    console.error('Error fetching doctor:', err);
    res.status(500).json({ message: err.message });
  }
};

export const getDoctorsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;
    const [rows] = await pool.query('SELECT * FROM users WHERE role = "doctor" AND specialization = ?', [specialization]);
    res.json(rows);
  } catch (err) {
    console.log(err);
    console.error('Error fetching doctors:', err);
    res.status(500).json({ message: err.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, phone, specialization } = req.body;

    await pool.query('UPDATE users SET fullname = ?, phone = ?, specialization = ? WHERE id = ? AND role = "doctor"', 
      [fullname, phone, specialization, id]);
    res.json({ message: 'Doctor updated successfully' });
  } catch (err) {
    console.log(err);
    console.error('Error updating doctor:', err);
    res.status(500).json({ message: err.message });
  }
};
