const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});
app.use(cors({ origin: "http://localhost:3000" }));

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  });
app.get('/api/complaints', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM complaint');
    const complaints = result.rows.map(row => ({
      ...row,
      image: row.image ? row.image.toString('base64') : null
    }));

    res.status(200).json(complaints);
  } catch (err) {
    console.error('Error fetching complaints:', err.message);
    res.status(500).json({ error: 'Server error' });
  }

})
const staticPath = path.join(__dirname, '..', 'nivas', 'build');
app.use(express.static(staticPath));
app.use(cors());
// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});