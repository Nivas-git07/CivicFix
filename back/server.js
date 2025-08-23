require("dotenv").config();// adjust path as needed
const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 5000;



// --- Check required environment variables ---
const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`);
    process.exit(1);
  }
});

// --- Database connection ---
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => {
    console.error('Database connection error:', err.message);
    process.exit(1);
  });

// --- Middleware ---
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for photo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- Helper functions ---
function random5Digit() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

async function generateUniqueComplaintId() {
  let id, exists;
  do {
    id = random5Digit();
    const res = await pool.query('SELECT 1 FROM complaint WHERE complaint_id=$1 LIMIT 1', [id]);
    exists = res.rows.length > 0;
  } while (exists);
  return id;
}

// --- API Routes ---

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Submit complaint
app.post("/api/report", upload.single("photo"), async (req, res) => {
  try {
    const {  issueType, location, description } = req.body;
    const photo = req.file ? req.file.buffer : null;

    if ( !issueType || !location || !description || !photo) {
      return res.status(400).json({ error: 'All fields are required (including photo)' });
    }

    const complaintId = await generateUniqueComplaintId();

    await pool.query(
      `INSERT INTO complaint
       (complaint_id,issue_type, photo, location, description)
       VALUES ($1,$2,$3,$4,$5)`,
      [complaintId, issueType, photo, location, description]
    );

    res.status(201).json({ complaintId, message: 'Complaint submitted successfully' });
  } catch (err) {
    console.error('Error submitting complaint:', err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});


// Fetch complaint by ID
app.get('/api/complaint/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT complaint_id, username, email, location, description, time, status
       FROM complaint WHERE complaint_id=$1`,
      [id]
    );

    if (!rows.length) return res.status(404).json({ error: 'Complaint not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching complaint:', err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// --- Serve React build ---
const buildPath = path.join(__dirname, '../nivas/build');
app.use(express.static(buildPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// --- Start server ---
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));