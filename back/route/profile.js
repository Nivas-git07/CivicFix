require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const router = express.Router();
const app = express();
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

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });


router.post("/", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const imageBuffer = req.file.buffer;

    await pool.query(
      "UPDATE login SET image = $1 WHERE user_id = $2",
      [imageBuffer, userId]
    );

    res.json({ message: "✅ Image updated", image: imageBuffer.toString("base64") });
  } catch (err) {
    console.error("❌ Error updating image:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const userResult = await pool.query(
      "SELECT user_id, username, email, district, image, reputation, complaint_id FROM login WHERE user_id=$1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    // Convert user profile image
    let imageBase64 = null;
    if (user.image) {
      imageBase64 = user.image.toString("base64");
    }

    // complaints
    // complaints
let complaints = [];
if (user.complaint_id) {
  // Convert DB string into array of ids
  // Remove curly braces if it's a Postgres array string like {123,456}
  let complaintIds = user.complaint_id
    .toString()
    .replace(/[{}]/g, "")       // remove { }
    .split(",")                 // split by comma
    .map(id => id.replace(/"/g, "").trim()); // clean quotes/spaces

  if (complaintIds.length > 0) {
    const complaintResult = await pool.query(
      `SELECT complaint_id, title, location, description, status, time, image
       FROM complaints
       WHERE complaint_id = ANY($1)`,
      [complaintIds]
    );

    complaints = complaintResult.rows.map(c => {
      let complaintImage = null;
      if (c.image) {
        complaintImage = c.image.toString("base64");
      }
      return {
        complaint_id: c.complaint_id,
        title: c.title,
        location: c.location,
        description: c.description,
        status: c.status,
        time: c.time,
        image: complaintImage
      };
    });
  }
}

    res.status(200).json({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      district: user.district,
      image: imageBase64,
      reputation: user.reputation,
      complaints
    });

  } catch (err) {
    console.error("❌ Error fetching profile:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

