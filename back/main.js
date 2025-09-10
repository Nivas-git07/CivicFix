require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const app = express();
const PORT = 5000;


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
    .then(() => console.log('Connected to PostgreSQL 1234'))
    .catch((err) => {
        console.error('Database connection error:', err.message);
        process.exit(1);
    });



app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/api/complaints", async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ error: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const result = await pool.query(
            "SELECT complaint_id FROM login WHERE user_id=$1",
            [decoded.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const complaintIds = result.rows[0].complaint_id || [];

        res.json({ complaint_ids: complaintIds });
    }
    catch (err) {
        console.error("❌ Error fetching complaints:", err.message);
        res.status(500).json({ error: "Server error" });
    }
})

// ✅ Mount routes first
const trackRoute = require("./route/track");
app.use("/api/complaints", trackRoute);

// other routes
const regrouter = require("./route/reg");
const signrouter = require("./route/sign");
const homerouter = require("./route/home");
const complrouter = require("./route/comp");
const profilrouter = require("./route/profile");
const totalreportrouter = require("./route/totalreport");
const serverrouter = require("./route/server");

app.use("/api/register", regrouter);
app.use("/api/login", signrouter);
app.use("/api/user/me", homerouter);
app.use("/api/complaints", complrouter);
app.use("/api/profile", profilrouter);
app.use("/api/total-complaints", totalreportrouter);
app.use("/api/report", serverrouter);
app.use("/api/profile/image", profilrouter);

// ✅ Serve React only AFTER API routes
const buildPath = path.join(__dirname, "../nivas/build");
app.use(express.static(buildPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
