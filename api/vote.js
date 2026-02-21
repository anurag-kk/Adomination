import 'dotenv/config'; // Automatically loads .env
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Stat from '../models/Stat.js'; // Note: .js extension is required in ESM

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const db = await mongoose.connect(process.env.MONGO_URI);
  cachedDb = db;
  return db;
}
// GET: Retrieve all country stats
app.get('/api/stats', async (req, res) => {
  await connectToDatabase();
  try {
    const stats = await Stat.find();
    const statsMap = stats.reduce((acc, curr) => {
      acc[curr.country] = curr.count;
      return acc;
    }, {});
    res.json(statsMap);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch archives" });
  }
});

// POST: Increment vote count
app.post('/api/vote', async (req, res) => {
  await connectToDatabase();
  const { country } = req.body;
  try {
    await Stat.findOneAndUpdate(
      { country: country },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    const updatedStats = await Stat.find();
    const statsMap = updatedStats.reduce((acc, curr) => {
      acc[curr.country] = curr.count;
      return acc;
    }, {});
    
    res.json(statsMap);
  } catch (err) {
    res.status(500).json({ error: "Vote transmission failed" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server pulsing on port ${PORT}`));