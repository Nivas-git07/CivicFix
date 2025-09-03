require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const router = express.Router();
const app = express();
const PORT = 5000;
const cors = require('cors');

app.use(cors({ origin: "http://localhost:3000" }));

// --- Database connection ---
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});
pool.connect()
    .then(() => console.log('✅ Connected to PostgreSQL'))
    .catch((err) => {
        console.error('❌ Database connection error:', err.message);
        process.exit(1);
    });
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));
// --- API Routes ---
app.get("/complaint_id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT complaint_id, title, location, description, status, time, image FROM complaint WHERE complaint_id=$1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        const complaint = result.rows[0];

        // Convert image (bytea) to base64 if exists
        let imageBase64 = null;
        if (complaint.image) {
            imageBase64 = complaint.image.toString("base64");
        }

        res.json({
            complaint_id: complaint.complaint_id,
            title: complaint.title,
            location: complaint.location,
            description: complaint.description,
            status: complaint.status,
            time: complaint.time,
            image: imageBase64   // ✅ send image as base64
        });

    } catch (err) {
        console.error("❌ Error tracking complaint:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
