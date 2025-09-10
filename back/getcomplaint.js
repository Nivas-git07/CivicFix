require("dotenv").config();// adjust path as needed
const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const jwt = require("jsonwebtoken");
const { resolve } = require("path/posix");
const router = express.Router();
const port=5000;



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

app.use(cors({ origin: "http://localhost:3002" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/api/complaints", async (req, res) => {
//     try {
//         const authHeader = req.headers["authorization"];
//         if (!authHeader) {
//             return res.status(401).json({ error: "No token provided" });
//         }
//         const token = authHeader.split(" ")[1];
//         const decoded = jwt.verify(token, JWT_SECRET);
//         const result = await pool.query(
//             "SELECT complaint_id FROM login WHERE user_id=$1",
//             [decoded.id]
//         );
//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: "User not found" });
//         }
//         const complaintIds = result.rows[0].complaint_id || [];

//         res.json({ complaint_ids: complaintIds });
//     }
//     catch (err) {
//         console.error("❌ Error fetching complaints:", err.message);
//         res.status(500).json({ error: "Server error" });
//     }
// })
// app.listen(port,()=>{
//     console.log(`Server running on ${port}`);
// })
