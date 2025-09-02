const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const bcrypt = require("bcryptjs");  
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const app = express();
const PORT = 5000;  
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
app.use(express.json());
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const result = await pool.query(
      "SELECT * FROM login WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
   const token = jwt.sign(
      { id: user.user_id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "2h" }
      );
    res.json({ message: "✅ Login successful", token  });
  } catch (err) {
    console.error("❌ Error logging in:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});