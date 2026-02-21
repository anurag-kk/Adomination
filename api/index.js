import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Stat from '../models/Stat.js';

const app = express();

// Middleware setup
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

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
app.post('/api/vote', async (req, res) => {
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