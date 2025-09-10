const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const bcrypt = require("bcryptjs");  
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const app = express();
const router = express.Router();


// --- Check required environment variables ---
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ,
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  });
app.use(cors());
app.use(cors({ origin: "http://localhost:3002" }));

app.use(express.json());
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) AS total FROM complaint");
    res.json({ total: result.rows[0].total });
  } catch (err) {
    console.error("Error fetching total complaints:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;