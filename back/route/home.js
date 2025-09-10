require("dotenv").config();// adjust path as needed
const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const jwt = require("jsonwebtoken");
const router = express.Router();





const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        console.error(`Missing environment variable: ${key}`);
        process.exit(1);
    }
});


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

app.use(express.json());
app.use(cors({ origin: "http://localhost:3002" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "No token" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      "SELECT user_id, username, image FROM login WHERE user_id=$1",
      [decoded.id] 
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    // Instead of sending buffer directly, send URL
    let imageUrl = null;
        if (user.image) {
          imageUrl = user.image.toString("base64");
        }
    
    res.status(200).json({
      user_id: user.user_id,
      username: user.username,
      image: imageUrl,
      
    });
  } catch (err) {
    console.error("JWT verification or DB error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
});

module.exports = router;