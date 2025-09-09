const bcrypt = require("bcryptjs");  
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());        
app.use(express.json());

// --- Database connection ---
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

// --- API Route for Register ---
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password, district } = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    
   const existingUser = await pool.query(
      "SELECT * FROM login WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }


    // Insert into database
    const result = await pool.query(
      `INSERT INTO login (username, email, password, district) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [username, email, hashedPassword, district]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Error inserting user:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// --- Serve frontend (if using React build) ---
const buildPath = path.join(__dirname, "../nivas/build");
app.use(express.static(buildPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
