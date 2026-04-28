import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import analyzeRoutes from './routes/analyzeRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/carepulse')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/analyze', analyzeRoutes);

app.get('/', (req, res) => {
  res.send('CarePulse API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
