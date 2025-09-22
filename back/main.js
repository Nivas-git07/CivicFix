require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");
const multer = require("multer");
const exifr = require("exifr");
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



app.use(cors({
  origin: ["https://civicfix.selfmade.solutions"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/complaints", async (req, res) => {
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

app.post("/report/location", async (req, res) => {
  try {
    const { complaint_id, latitude, longitude } = req.body;

    if (!complaint_id || !latitude || !longitude) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const query = `
      UPDATE complaint
      SET latitude = $1, longitude = $2
      WHERE complaint_id = $3
      RETURNING complaint_id, latitude, longitude;
    `;

    const values = [latitude, longitude, complaint_id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Error updating location:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/total-complaints", async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) AS total FROM complaint");
    res.json({ total: Number(result.rows[0].total) });
    console.log("Total complaints fetched:", result.rows[0].total);
  } catch (err) {
    console.error("Error fetching total complaints:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// ✅ Mount routes first
const trackRoute = require("./route/track");
app.use("/complaints", trackRoute);

// other routes
const regrouter = require("./route/reg");
const signrouter = require("./route/sign");
const homerouter = require("./route/home");
const complrouter = require("./route/comp");
const profilrouter = require("./route/profile");
// const totalreportrouter = require("./route/totalreport");
const serverrouter = require("./route/server");

app.use("/register", regrouter);
app.use("/login", signrouter);
app.use("/user/me", homerouter);
app.use("/allcomplaints", complrouter);
app.use("/profile", profilrouter);
// app.use("/total-complaints", totalreportrouter);
app.use("/report", serverrouter);
app.use("/profile/image", profilrouter);

// ✅ Serve React only AFTER API routes
const buildPath = path.join(__dirname, "../nivas/build");
app.use(express.static(buildPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /extract endpoint
app.post("/extract", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Parse EXIF metadata
    const metadata = await exifr.parse(req.file.buffer);

    res.json({
      DateTime: metadata?.DateTimeOriginal || null,
      GPSLatitude: metadata?.latitude || null,
      GPSLongitude: metadata?.longitude || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to extract EXIF metadata" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
