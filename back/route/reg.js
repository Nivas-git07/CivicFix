const bcrypt = require("bcryptjs");  
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const router = express.Router();

const app = express();


// Middleware
const allowedOrigins = [
  "http://localhost:3002",  // React dev server
  "https://civicfix.selfmade.solutions"   // Production domain
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
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
router.post("/", async (req, res) => {
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

module.exports = router;