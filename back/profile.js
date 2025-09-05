require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const router = express.Router();
const app = express();
const port = 5000;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
// --- API Routes ---

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

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
};
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            "SELECT user_id, username, email,district,image FROM login WHERE user_id=$1",
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("❌ Error fetching profile:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});

