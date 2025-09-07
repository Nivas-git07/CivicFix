const express=require("express");
const app=express();
const { Pool }=require('pg');
const cors=require("cors");
require("dotenv").config();
const path=require("path");
const port =5000;
const fs=require('fs');
app.use(cors());
const exifParser = require("exif-parser");
const fetch = require("node-fetch");
const multer=require("multer");
app.use(express.json());



//database connection



const pool=new Pool(({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT,
}));


pool.connect()
.then(()=>console.log("connected to postgresql"))
.catch((err)=>{
    console.error("database connection error:",err.message);
    process.exit(1);
})



// Setup multer to store uploaded images in ./uploads



const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  }
});


const upload = multer({ storage });


// Helper: parse EXIF GPS from file buffer (returns {lat, lon} or null)

function getGpsFromFile(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const parser = exifParser.create(buffer);
    const result = parser.parse();
    const gps = result.tags && result.tags.GPSLatitude && result.tags.GPSLongitude
      ? {
          lat: (result.tags.GPSLatitudeRef === "S" ? -1 : 1) * result.tags.GPSLatitude,
          lon: (result.tags.GPSLongitudeRef === "W" ? -1 : 1) * result.tags.GPSLongitude
        }
      : null;
    return gps;
  } catch (err) {
    console.warn("EXIF parse error:", err.message);
    return null;
  }
}

// Helper: reverse geocode or forward geocode using Google Geocoding API

async function geocodeLatLng(lat, lng) {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) return null;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`;
  const r = await fetch(url);
  const json = await r.json();
  if (json.results && json.results[0]) return json.results[0].formatted_address;
  return null;
}


async function geocodeAddress(address) {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) return null;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${key}`;
  const r = await fetch(url);
  const json = await r.json();
  if (json.results && json.results[0]) {
    const loc = json.results[0].geometry.location;
    return { address: json.results[0].formatted_address, lat: loc.lat, lng: loc.lng };
  }
  return null;
}



// POST /api/complaints - multipart form: photo + title + description + (lat & lng optional) + address optional



app.post("/", upload.single("photo"), async (req, res) => {
  try
   {
    const { title, description, lat: latFromBody, lng: lngFromBody, address: addressFromBody } = req.body;
    let lat = latFromBody ? parseFloat(latFromBody) : null;
    let lng = lngFromBody ? parseFloat(lngFromBody) : null;
    let address = addressFromBody || null;
    let photo_path = null;

    if (req.file) 
        {
      photo_path = "/uploads/" + req.file.filename; // accessible if you serve static folder
// Try to extract GPS from EXIF
      const gps = getGpsFromFile(req.file.path);
      if (gps) {
        lat = gps.lat;
        lng = gps.lon;
// Optional: get formatted address from lat/lng
        const rev = await geocodeLatLng(lat, lng);
        if (rev) address = rev;
      }
    }

 // If no lat/lng yet but address provided -> geocode it

    if ((!lat || !lng) && address) {
      const ge = await geocodeAddress(address);
      if (ge) {
        lat = ge.lat;
        lng = ge.lng;
        address = ge.address;
      }
    }

 // Finally, if still no lat/lng, keep as null (client should have provided)
    const insert = await pool.query(
      `INSERT INTO complaints (title, description, address, lat, lng, photo_path) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title || null, description || null, address, lat, lng, photo_path]
    );

    res.json({ success: true, complaint: insert.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// GET /api/complaints - return all complaints


app.get("/", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM complaints ORDER BY created_at DESC");
    res.json({ success: true, complaints: data.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});



app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})