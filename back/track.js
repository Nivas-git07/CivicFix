require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// --- Database connection ---
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});
pool.connect()
    .then(() => console.log("✅ Connected to PostgreSQL"))
    .catch((err) => {
        console.error("❌ Database connection error:", err.message);
        process.exit(1);
    });

// --- API Routes ---
router.get("/complaint_id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM complaint WHERE complaint_id=$1", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Complaint not found" });
        }
        
        const complaint = result.rows[0];
        res.json({
            complaint_id: complaint.complaint_id,
            title: complaint.title,
            location: complaint.location,
            description: complaint.description,
            status: complaint.status,
            time: complaint.time
        });

    } catch (err) {
        console.error("❌ Error tracking complaint:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
