import mongoose from 'mongoose';

const statSchema = new mongoose.Schema({
  country: { 
    type: String, 
    required: true, 
    unique: true 
  },
  count: { 
    type: Number, 
    default: 0 
  }
});

export default mongoose.models.Stat || mongoose.model('Stat', statSchema);