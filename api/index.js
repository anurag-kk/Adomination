import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Stat from '../models/Stat.js';
import { COUNTRIES } from '../constants.ts';

const app = express();

// Middleware setup
const allowedOrigins = [
  'https://adomination.vercel.app', // Your Vercel production URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Block the request if the origin is not in our list
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'], // Limit to only the methods your app actually uses
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Input Validation Middleware
const validateVoteInput = (req, res, next) => {
  const { country } = req.body;
  
  // Check if country is provided
  if (!country) {
    return res.status(400).json({ error: "Country is required" });
  }
  
  // Check if country is a string
  if (typeof country !== 'string') {
    return res.status(400).json({ error: "Country must be a string" });
  }
  
  // Trim and validate length (prevent long scripts)
  const trimmedCountry = country.trim();
  if (trimmedCountry.length === 0 || trimmedCountry.length > 100) {
    return res.status(400).json({ error: "Invalid country format" });
  }
  
  // Check for script tags and common XSS patterns
  const xssPatterns = /<script|<iframe|javascript:|on\w+\s*=|<svg|<img/gi;
  if (xssPatterns.test(trimmedCountry)) {
    return res.status(400).json({ error: "Invalid input detected" });
  }
  
  // Validate against the allowed countries list
  if (!COUNTRIES.includes(trimmedCountry)) {
    return res.status(400).json({ error: "Country not recognized" });
  }
  
  // Attach validated country to request
  req.body.country = trimmedCountry;
  next();
};

// Serverless Connection Logic
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) return cachedDb;
  
  // Important: ensure we don't try to connect multiple times simultaneously
  cachedDb = await mongoose.connect(process.env.MONGO_URI);
  return cachedDb;
}

// GET: Retrieve all country stats
app.get('/api/stats', async (req, res) => {
  try {
    await connectToDatabase();
    const stats = await Stat.find();
    const statsMap = stats.reduce((acc, curr) => {
      acc[curr.country] = curr.count;
      return acc;
    }, {});
    res.json(statsMap);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Failed to fetch archives" });
  }
});

// POST: Increment vote count
app.post('/api/vote', validateVoteInput, async (req, res) => {
  try {
    await connectToDatabase();
    const { country } = req.body;
    
    await Stat.findOneAndUpdate(
      { country: country },
      { $inc: { count: 1 } },
      { 
        upsert: true, 
        returnDocument: 'after' // Modern version of new: true
      }
    );

    const updatedStats = await Stat.find();
    const statsMap = updatedStats.reduce((acc, curr) => {
      acc[curr.country] = curr.count;
      return acc;
    }, {});
    
    res.json(statsMap);
  } catch (err) {
    console.error("Vote Error:", err);
    res.status(500).json({ error: "Vote transmission failed" });
  }
});

// CRITICAL FOR VERCEL: 
export default app;