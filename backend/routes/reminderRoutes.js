import express from 'express';
import Reminder from '../models/Reminder.js';

const router = express.Router();

// Get all reminders for a user
router.get('/:userId', async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.params.userId });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a new reminder
router.post('/', async (req, res) => {
  try {
    const { userId, medicineName, dosage, time, frequency } = req.body;
    
    const reminder = await Reminder.create({
      userId,
      medicineName,
      dosage,
      time,
      frequency,
    });
    
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a reminder
router.delete('/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);
    if (reminder) {
      res.json({ message: 'Reminder removed' });
    } else {
      res.status(404).json({ message: 'Reminder not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
