require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const router = express.Router();
const app=express();
const port=5000;
const cors=require('cors');
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

app.use(cors({origin:"http://localhost:3000"}));
app.use(express.json());
app.get('/api/profile',async(req,res)=>{
    try{
        const result =await pool.query
        ("SELECT * FROM login");
        req.status(200).json(result.rows);
    }catch(err){
        console.error('Error fetching profile:', err.message);
        res.status(500).json({error:'Server error'});

    }
});
 app.listen(port,()=>
    {console.log(`server running on port ${port}`);
});

