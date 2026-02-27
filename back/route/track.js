const express = require("express");
const { Pool } = require("pg");
const app = express();
const router = express.Router();
const cors = require('cors');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});
app.use(cors());
app.use(express.json());
app.use(cors({ origin: "*" }));

// GET complaint by ID
router.get("/:id", async (req, res) => {
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
    const imageBase64 = complaint.image
      ? complaint.image.toString("base64")
      : null;

    res.json({
      complaint_id: complaint.complaint_id,
      title: complaint.title,
      location: complaint.location,
      description: complaint.description,
      status: complaint.status,
      time: complaint.time,
      image: imageBase64,
    });
  } catch (err) {
    console.error("❌ Error tracking complaint:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
