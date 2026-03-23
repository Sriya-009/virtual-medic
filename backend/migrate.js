require('dotenv').config();
const db = require('./config/db');

async function migrate() {
  try {
    // Add approval_status column if it doesn't exist
    const [result] = await db.query(
      `ALTER TABLE users ADD COLUMN approval_status VARCHAR(20) DEFAULT 'approved' AFTER role`
    );
    console.log('✓ Added approval_status column to users table');
  } catch (e) {
    if (e.message.includes('Duplicate column')) {
      console.log('✓ Column approval_status already exists');
    } else {
      console.error('✗ Migration error:', e.message);
    }
  } finally {
    try {
      await db.end();
    } catch (e2) {
      // no-op
    }
  }
}

migrate();
